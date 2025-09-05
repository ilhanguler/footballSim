package com.mycompany.myapp.service.game;

import com.mycompany.myapp.domain.game.Match;
import com.mycompany.myapp.repository.game.MatchRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class MatchService {

    private final MatchRepository matchRepository;

    public Match save(Match match) {
        return matchRepository.save(match);
    }

    @Transactional(readOnly = true)
    public List<Match> findAll() {
        return matchRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Match> findOne(Long id) {
        return matchRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Match> findMatchesByTurn(Long turnId) {
        return matchRepository.findByTurnId(turnId);
    }

    @Transactional(readOnly = true)
    public List<Match> findMatchesByTurnOrderByMatchDateAsc(Long turnId) {
        return matchRepository.findByTurnIdOrderByMatchDateAsc(turnId);
    }

    @Transactional(readOnly = true)
    public List<Match> findAllByDate(LocalDate date) {
        return matchRepository.findByMatchDate(date);
    }

    @Transactional(readOnly = true)
    public List<Match> findMatchesByTeamId(Long teamId){
        return matchRepository.findByHomeTeamIdOrAwayTeamId(teamId, teamId);
    }

    public void delete(Long id) {
        matchRepository.deleteById(id);
    }

    public void deleteAllBySeason(Long seasonId) {
        matchRepository.deleteAllByTurnSeasonId(seasonId);
    }
}
