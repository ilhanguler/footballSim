package com.mycompany.myapp.repository.game.sim;

import com.mycompany.myapp.domain.game.sim.MoraleChangelog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MoraleChangelogRepository extends JpaRepository<MoraleChangelog, Long> {
    List<MoraleChangelog> findByMatchId(Long matchId);

    List<MoraleChangelog> findByTeamStatsTeamId(Long teamId);

    void deleteAllByMatchTurnSeasonId(Long seasonId);
}
