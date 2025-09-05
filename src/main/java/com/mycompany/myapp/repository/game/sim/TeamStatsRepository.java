package com.mycompany.myapp.repository.game.sim;

import com.mycompany.myapp.domain.game.Team;
import com.mycompany.myapp.domain.game.sim.TeamStats;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeamStatsRepository extends JpaRepository<TeamStats, Long> {
    Optional<TeamStats> findByTeam(Team team);

    Optional<TeamStats> findByTeamId(Long teamId);
}
