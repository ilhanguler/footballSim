package com.mycompany.myapp.service.game.sim;

import com.mycompany.myapp.domain.game.Team;
import com.mycompany.myapp.domain.game.sim.TeamStats;
import com.mycompany.myapp.repository.game.sim.TeamStatsRepository;
import java.util.List;
import java.util.Optional;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class TeamStatsService {

    private final Logger log = LoggerFactory.getLogger(TeamStatsService.class);

    private final TeamStatsRepository teamStatsRepository;

    public TeamStats save(TeamStats teamStats) {
        log.debug("Request to save Stats : {}", teamStats);
        return teamStatsRepository.save(teamStats);
    }

    public Optional<TeamStats> partialUpdate(TeamStats teamStats) {
        log.debug("Request to partially update Stats : {}", teamStats);

        return teamStatsRepository
            .findById(teamStats.getId())
            .map(
                existingTeamStats -> {
                    if (teamStats.getSkill() != null) {
                        existingTeamStats.setSkill(teamStats.getSkill());
                    }
                    if (teamStats.getMorale() != null) {
                        existingTeamStats.setMorale(teamStats.getMorale());
                    }

                    return existingTeamStats;
                }
            )
            .map(teamStatsRepository::save);
    }

    @Transactional(readOnly = true)
    public List<TeamStats> findAll() {
        log.debug("Request to get all Stats");
        return teamStatsRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<TeamStats> findOne(Long id) {
        log.debug("Request to get Stats : {}", id);
        return teamStatsRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public Optional<TeamStats> findByTeam(Team team) {
        log.debug("Request to get Stats by Team : {}", team);
        return teamStatsRepository.findByTeam(team);
    }

    @Transactional(readOnly = true)
    public Optional<TeamStats> findByTeamId(Long teamId) {
        log.debug("Request to get Stats by Team : {}", teamId);
        return teamStatsRepository.findByTeamId(teamId);
    }

    public void delete(Long id) {
        log.debug("Request to delete Stats : {}", id);
        teamStatsRepository.deleteById(id);
    }

}
