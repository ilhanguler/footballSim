package com.mycompany.myapp.service.game;

import com.mycompany.myapp.domain.game.TeamGroup;
import com.mycompany.myapp.repository.game.TeamGroupRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class TeamGroupService {

    private final TeamGroupRepository teamGroupRepository;

    public TeamGroup save(TeamGroup teamGroup) {
        return teamGroupRepository.save(teamGroup);
    }

    @Transactional(readOnly = true)
    public List<TeamGroup> findAll() {
        return teamGroupRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<TeamGroup> findOne(Long id) {
        return teamGroupRepository.findById(id);
    }

    public void delete(Long id) {
        teamGroupRepository.deleteById(id);
    }
}
