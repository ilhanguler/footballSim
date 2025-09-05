package com.mycompany.myapp.service.game.sim;

import com.mycompany.myapp.domain.game.Match;
import com.mycompany.myapp.domain.game.Score;
import com.mycompany.myapp.domain.game.Team;
import com.mycompany.myapp.domain.game.Turn;
import com.mycompany.myapp.service.game.MatchService;
import com.mycompany.myapp.service.game.ScoreService;
import com.mycompany.myapp.service.game.SeasonService;
import com.mycompany.myapp.service.game.TurnService;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for orchestrating and generating fixtures.
 */
@Service
@Transactional
@RequiredArgsConstructor
public class FixtureService {

    private final MatchService matchService;
    private final TurnService turnService;
    private final SeasonService seasonService;
    private final ScoreService scoreService;
    private final MoraleChangelogService moraleChangelogService;

    /**
     * Generates a new, clean fixture for a given season.
     * This method is the main entry point for fixture generation. It ensures that any
     * existing scores, turns, and matches for the season are deleted before creating new ones.
     *
     * @param seasonId the ID of the season for which to generate the fixture.
     * @return true if the fixture was created successfully, false otherwise.
     */
    public boolean generateNewFixtureForSeason(Long seasonId) {
        return seasonService
            .findOne(seasonId)
            .map(
                season -> {
                    // 1. Clean up all existing data for this season to ensure idempotency.
                    moraleChangelogService.deleteAllBySeason(seasonId);
                    matchService.deleteAllBySeason(seasonId);
                    scoreService.deleteAllBySeason(seasonId);
                    turnService.deleteAllBySeason(seasonId);

                    List<Team> teams = new ArrayList<>(season.getTeams());
                    Collections.shuffle(teams);

                    // 2. Create a new, zero-initialized score for each team for the entire season.
                    for (Team team : teams) {
                        Score score = new Score();
                        score.setSeason(season);
                        score.setTeam(team);
                        score.setPoints(0);
                        score.setWins(0);
                        score.setLosses(0);
                        score.setDraws(0);
                        score.setGoalsFor(0);
                        score.setGoalsAgainst(0);
                        score.setGoalDifference(0);
                        scoreService.save(score);
                    }

                    // 3. Generate the new turns for the season.
                    List<Turn> turns = turnService.generateTurnsForSeason(season);

                    // 4. Create the new fixture (matches).
                    createDoubleRoundRobinFixture(teams, turns);

                    return true;
                }
            )
            .orElse(false); // Return false if season was not found
    }

    /**
     * Creates a double round-robin fixture with improved home/away alternation and fairness.
     *
     * @param teams the list of teams to be paired.
     * @param turns the list of turns for which the matches are created.
     */
    private void createDoubleRoundRobinFixture(List<Team> teams, List<Turn> turns) {
        if (teams == null || teams.size() < 2 || turns == null || turns.isEmpty()) {
            return; // Not enough teams or turns to create a fixture.
        }

        List<Team> scheduleTeams = new ArrayList<>(teams);

        if (scheduleTeams.size() % 2 != 0) {
            scheduleTeams.add(null); // Represents a bye
        }

        int numTeams = scheduleTeams.size();
        int roundsPerLeg = numTeams - 1;

        Map<String, Team> firstLegHomeAssignments = new HashMap<>();
        Map<Long, Boolean> playedHomeLast = new HashMap<>();
        Map<Long, Integer> homeGamesCount = new HashMap<>();

        for (Team team : teams) {
            if (team != null) {
                playedHomeLast.put(team.getId(), ThreadLocalRandom.current().nextBoolean());
                homeGamesCount.put(team.getId(), 0);
            }
        }

        for (int round = 0; round < turns.size(); round++) {
            Turn currentTurn = turns.get(round);

            for (int i = 0; i < numTeams / 2; i++) {
                Team team1 = scheduleTeams.get(i);
                Team team2 = scheduleTeams.get(numTeams - 1 - i);

                if (team1 == null || team2 == null) {
                    continue; // Skip bye matches
                }

                Team homeTeam;
                Team awayTeam;

                if (round < roundsPerLeg) {
                    // First leg: try to enforce home/away alternation
                    boolean team1PlayedHomeLast = playedHomeLast.get(team1.getId());
                    boolean team2PlayedHomeLast = playedHomeLast.get(team2.getId());

                    if (!team1PlayedHomeLast && team2PlayedHomeLast) {
                        homeTeam = team1;
                        awayTeam = team2;
                    } else if (team1PlayedHomeLast && !team2PlayedHomeLast) {
                        homeTeam = team2;
                        awayTeam = team1;
                    } else {
                        // Conflict: Both teams have the same last-played status.
                        // Use home game counts for fairness.
                        int team1HomeCount = homeGamesCount.get(team1.getId());
                        int team2HomeCount = homeGamesCount.get(team2.getId());

                        if (team1HomeCount < team2HomeCount) {
                            homeTeam = team1;
                            awayTeam = team2;
                        } else if (team2HomeCount < team1HomeCount) {
                            homeTeam = team2;
                            awayTeam = team1;
                        } else {
                            // Tie-breaker: random assignment
                            if (ThreadLocalRandom.current().nextBoolean()) {
                                homeTeam = team1;
                                awayTeam = team2;
                            } else {
                                homeTeam = team2;
                                awayTeam = team1;
                            }
                        }
                    }

                    playedHomeLast.put(homeTeam.getId(), true);
                    playedHomeLast.put(awayTeam.getId(), false);
                    homeGamesCount.put(homeTeam.getId(), homeGamesCount.get(homeTeam.getId()) + 1);

                    String key = getMatchKey(team1, team2);
                    firstLegHomeAssignments.put(key, homeTeam);
                } else {
                    // Second leg: reverse of the first leg
                    String key = getMatchKey(team1, team2);
                    Team firstLegHomeTeam = firstLegHomeAssignments.get(key);

                    if (firstLegHomeTeam != null && firstLegHomeTeam.getId().equals(team1.getId())) {
                        homeTeam = team2;
                        awayTeam = team1;
                    } else {
                        homeTeam = team1;
                        awayTeam = team2;
                    }
                }

                Match match = new Match();
                match.setTurn(currentTurn);
                match.setHomeTeam(homeTeam);
                match.setAwayTeam(awayTeam);

                if (currentTurn.getStartDate() != null && currentTurn.getEndDate() != null) {
                    long startMillis = currentTurn.getStartDate().toEpochMilli();
                    long endMillis = currentTurn.getEndDate().toEpochMilli();
                    long randomMillis = ThreadLocalRandom.current().nextLong(startMillis, endMillis);
                    match.setMatchDate(Instant.ofEpochMilli(randomMillis));
                }

                matchService.save(match);
            }

            // Rotate teams for the next round
            Team lastTeam = scheduleTeams.remove(numTeams - 1);
            scheduleTeams.add(1, lastTeam);
        }
    }

    private String getMatchKey(Team team1, Team team2) {
        if (team1.getId() < team2.getId()) {
            return team1.getId() + "-" + team2.getId();
        } else {
            return team2.getId() + "-" + team1.getId();
        }
    }
}
