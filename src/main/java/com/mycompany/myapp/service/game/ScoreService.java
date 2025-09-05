package com.mycompany.myapp.service.game;

import com.mycompany.myapp.domain.game.Score;
import com.mycompany.myapp.repository.game.ScoreRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class ScoreService {

    private final ScoreRepository scoreRepository;

    public Score save(Score score) {
        return scoreRepository.save(score);
    }

    @Transactional(readOnly = true)
    public List<Score> findAll() {
        return scoreRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Score> findOne(Long id) {
        return scoreRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public Optional<Score> findOneByTeamIdAndSeasonId(Long teamId, Long seasonId) {
        return scoreRepository.findOneByTeamIdAndSeasonId(teamId, seasonId);
    }

    @Transactional(readOnly = true)
    public List<Score> findScoresBySeason(Long seasonId) {
        return scoreRepository.findBySeasonId(seasonId);
    }

    public void delete(Long id) {
        scoreRepository.deleteById(id);
    }

    public void deleteAllBySeason(Long seasonId) {
        scoreRepository.deleteAllBySeasonId(seasonId);
    }
}
