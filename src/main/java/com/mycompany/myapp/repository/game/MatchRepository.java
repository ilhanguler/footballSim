package com.mycompany.myapp.repository.game;

import com.mycompany.myapp.domain.game.Match;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {
    List<Match> findByTurnId(Long turnId);

    List<Match> findByTurnIdOrderByMatchDateAsc(Long turnId);

    @Query("select m from Match m where function('date', m.matchDate) = :date")
    List<Match> findByMatchDate(@Param("date") LocalDate date);

    List<Match> findByHomeTeamIdOrAwayTeamId(Long homeTeamId, Long awayTeamId);

    void deleteAllByTurnSeasonId(Long seasonId);
}
