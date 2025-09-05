package com.mycompany.myapp.service.game;

import com.mycompany.myapp.domain.game.Season;
import com.mycompany.myapp.domain.game.Turn;
import com.mycompany.myapp.repository.game.TurnRepository;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class TurnService {

    private final TurnRepository turnRepository;

    public Turn save(Turn turn) {
        return turnRepository.save(turn);
    }

    @Transactional(readOnly = true)
    public List<Turn> findAll() {
        return turnRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Turn> findOne(Long id) {
        return turnRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Turn> findTurnsBySeason(Long seasonId) {
        return turnRepository.findBySeasonId(seasonId);
    }

    public void delete(Long id) {
        turnRepository.deleteById(id);
    }

    public void deleteAllBySeason(Long seasonId) {
        turnRepository.deleteAllBySeasonId(seasonId);
    }

    /**
     * Generates and saves the turns for a full double round-robin season.
     *
     * @param season the season for which to generate turns.
     * @return a list of the generated and saved turns.
     */
    public List<Turn> generateTurnsForSeason(Season season) {
        int numTeams = season.getTeams().size();
        if (numTeams < 2) {
            return new ArrayList<>();
        }

        int roundsPerLeg = (numTeams % 2 == 0) ? numTeams - 1 : numTeams;
        int numTurns = roundsPerLeg * 2; // Double round-robin

        List<Turn> turns = new ArrayList<>();
        Instant turnStartDate = season.getStartDate();

        for (int i = 0; i < numTurns; i++) {
            Turn turn = new Turn();
            turn.setName("Turn " + (i + 1));
            turn.setTurnNumber(i + 1);
            turn.setSeason(season);
            turn.setEliminationEnabled(false);

            if (turnStartDate != null) {
                turn.setStartDate(turnStartDate);
                turn.setEndDate(turnStartDate.plus(Duration.ofDays(7)));
                turnStartDate = turn.getEndDate();
            }

            turns.add(turnRepository.save(turn));
        }

        return turns;
    }
}
