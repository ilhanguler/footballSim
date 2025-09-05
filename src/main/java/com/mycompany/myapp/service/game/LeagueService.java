package com.mycompany.myapp.service.game;

import com.mycompany.myapp.domain.game.League;
import com.mycompany.myapp.repository.game.LeagueRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class LeagueService {

    private final LeagueRepository leagueRepository;

    public League save(League league) {
        return leagueRepository.save(league);
    }

    @Transactional(readOnly = true)
    public List<League> findAll() {
        return leagueRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<League> findOne(Long id) {
        return leagueRepository.findById(id);
    }

    public void delete(Long id) {
        leagueRepository.deleteById(id);
    }
}
