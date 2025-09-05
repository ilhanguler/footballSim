package com.mycompany.myapp.service.game;

import com.mycompany.myapp.domain.game.Season;
import com.mycompany.myapp.repository.game.SeasonRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class SeasonService {

    private final SeasonRepository seasonRepository;

    public Season save(Season season) {
        return seasonRepository.save(season);
    }

    @Transactional(readOnly = true)
    public List<Season> findAll() {
        return seasonRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Season> findOne(Long id) {
        return seasonRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Season> findSeasonsByLeague(Long leagueId) {
        return seasonRepository.findByLeagueId(leagueId);
    }

    public void delete(Long id) {
        seasonRepository.deleteById(id);
    }
}
