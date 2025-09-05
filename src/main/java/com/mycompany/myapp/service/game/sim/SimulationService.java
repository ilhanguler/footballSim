package com.mycompany.myapp.service.game.sim;

import com.mycompany.myapp.domain.game.Match;
import com.mycompany.myapp.domain.game.Score;
import com.mycompany.myapp.domain.game.Season;
import com.mycompany.myapp.domain.game.Turn;
import com.mycompany.myapp.domain.game.sim.MoraleChangelog;
import com.mycompany.myapp.domain.game.sim.TeamStats;
import com.mycompany.myapp.service.game.MatchService;
import com.mycompany.myapp.service.game.ScoreService;
import com.mycompany.myapp.service.game.TurnService;
import java.util.List;
import java.util.Random;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class SimulationService {

    private final TeamStatsService teamStatsService;
    private final TurnService turnService;
    private final MatchService matchService;
    private final ScoreService scoreService;
    private final MoraleChangelogService moraleChangelogService;
    private final Random random = new Random();

    public void simulateSeason(Season season) {
        List<Turn> turns = turnService.findTurnsBySeason(season.getId());
        for (Turn turn : turns) {
            simulateTurn(turn);
        }
    }

    public void simulateTurn(Turn turn) {
        List<Match> matches = matchService.findMatchesByTurnOrderByMatchDateAsc(turn.getId());
        Long seasonId = turn.getSeason().getId();

        for (Match match : matches) {
            TeamStats homeTeamStats = teamStatsService.findByTeam(match.getHomeTeam()).orElseThrow();
            TeamStats awayTeamStats = teamStatsService.findByTeam(match.getAwayTeam()).orElseThrow();
            simulateMatch(homeTeamStats, awayTeamStats, match);

            Score homeScore = scoreService.findOneByTeamIdAndSeasonId(match.getHomeTeam().getId(), seasonId).orElseThrow();
            Score awayScore = scoreService.findOneByTeamIdAndSeasonId(match.getAwayTeam().getId(), seasonId).orElseThrow();

            // Calculate Score of Teams that played the match
            if (match.getHomeGoals() > match.getAwayGoals()) {
                homeScore.setWins(homeScore.getWins() + 1);
                awayScore.setLosses(awayScore.getLosses() + 1);
                homeScore.setPoints(homeScore.getPoints() + 3);
            } else if (match.getHomeGoals() < match.getAwayGoals()) {
                homeScore.setLosses(homeScore.getLosses() + 1);
                awayScore.setWins(awayScore.getWins() + 1);
                awayScore.setPoints(awayScore.getPoints() + 3);
            } else {
                homeScore.setDraws(homeScore.getDraws() + 1);
                awayScore.setDraws(awayScore.getDraws() + 1);
                homeScore.setPoints(homeScore.getPoints() + 1);
                awayScore.setPoints(awayScore.getPoints() + 1);
            }

            homeScore.setGoalsFor(homeScore.getGoalsFor() + match.getHomeGoals());
            homeScore.setGoalsAgainst(homeScore.getGoalsAgainst() + match.getAwayGoals());
            homeScore.setGoalDifference(homeScore.getGoalsFor() - homeScore.getGoalsAgainst());

            awayScore.setGoalsFor(awayScore.getGoalsFor() + match.getAwayGoals());
            awayScore.setGoalsAgainst(awayScore.getGoalsAgainst() + match.getHomeGoals());
            awayScore.setGoalDifference(awayScore.getGoalsFor() - awayScore.getGoalsAgainst());

            // Update Score of Teams
            scoreService.save(homeScore);
            scoreService.save(awayScore);
        }
    }

    public void simulateMatch(TeamStats homeTeamStats, TeamStats awayTeamStats, Match match) {
        double homeSkill = homeTeamStats.getSkill() / 100.0d;
        double awaySkill = awayTeamStats.getSkill() / 100.0d;

        // Override skill to test
        // homeSkill = 1.0d;
        // awaySkill = 1.0d;

        double homeMorale = homeTeamStats.getMorale();
        double awayMorale = awayTeamStats.getMorale();

        double homeStrength = calculateTeamStrength(homeSkill, homeMorale);
        double awayStrength = calculateTeamStrength(awaySkill, awayMorale);

        int homeGoals = calculateGoals(homeStrength, awayStrength);
        int awayGoals = calculateGoals(awayStrength, homeStrength);

        match.setHomeGoals(homeGoals);
        match.setAwayGoals(awayGoals);
        matchService.save(match);

        updateMorale(homeTeamStats, awayTeamStats, homeGoals, awayGoals);

        registerMoraleChangelog(homeTeamStats, match, homeTeamStats.getMorale() - homeMorale, homeMorale);
        registerMoraleChangelog(awayTeamStats, match, awayTeamStats.getMorale() - awayMorale, awayMorale);
    }

    private double calculateTeamStrength(double skill, double morale) {
        double randomChanceFactor = random.nextDouble();
        return (skill * 0.7d) + (morale * 0.2d * skill) + (randomChanceFactor * 0.1d * skill);
    }

    private int calculateGoals(double teamStrength, double opponentStrength) {
        double randomChanceFactor = random.nextDouble();
        double randomMultiplier = 5 + (random.nextDouble() * 5); // Random number between 5 and 10

        double goals = (teamStrength + 0.1d) * (1.1d - opponentStrength) * randomChanceFactor * randomMultiplier;
        return (int) Math.round(goals);
    }

    private void updateMorale(TeamStats homeStats, TeamStats awayStats, int homeGoals, int awayGoals) {
        double homeSkill = homeStats.getSkill() / 100.0d;
        double awaySkill = awayStats.getSkill() / 100.0d;

        // Override skill to test
        // homeSkill = 1.0d;
        // awaySkill = 1.0d;

        double strengthGapEffect;
        if (homeGoals > awayGoals) { // Home won
            strengthGapEffect = 0.1 * Math.pow(10, -(homeSkill - awaySkill));
        } else { // Away won or draw
            strengthGapEffect = 0.1 * Math.pow(10, (homeSkill - awaySkill));
        }

        double totalGoals = homeGoals + awayGoals;
        double moraleEffectHome = 0;
        if (totalGoals > 0) {
            moraleEffectHome = ((double) (homeGoals - awayGoals) / totalGoals) * strengthGapEffect;
        }

        double moraleEffectAway = -moraleEffectHome;

        double newHomeMorale = Math.max(0, Math.min(1, homeStats.getMorale() + moraleEffectHome));
        double newAwayMorale = Math.max(0, Math.min(1, awayStats.getMorale() + moraleEffectAway));

        homeStats.setMorale(newHomeMorale);
        awayStats.setMorale(newAwayMorale);

        teamStatsService.save(homeStats);
        teamStatsService.save(awayStats);
    }

    private void registerMoraleChangelog(TeamStats teamStats, Match match, double moraleEffect, double originalMorale){
        MoraleChangelog moraleChangelog = new MoraleChangelog();
        moraleChangelog.setTeamStats(teamStats);
        moraleChangelog.setMatch(match);
        moraleChangelog.setMoraleChange(moraleEffect);
        moraleChangelog.setMoraleBefore( originalMorale);
        moraleChangelogService.save(moraleChangelog);
    }
}
