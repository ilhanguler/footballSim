package com.mycompany.myapp.service.game;

import com.mycompany.myapp.domain.game.Team;
import com.mycompany.myapp.repository.game.TeamRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;

    public Team save(Team team) {
        return teamRepository.save(team);
    }

    @Transactional(readOnly = true)
    public List<Team> findAll() {
        return teamRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Team> findTeamsBySeason(Long seasonId) {
        return teamRepository.findBySeasonsId(seasonId);
    }

    @Transactional(readOnly = true)
    public Optional<Team> findOne(Long id) {
        return teamRepository.findById(id);
    }

    public void delete(Long id) {
        teamRepository.deleteById(id);
    }
}
