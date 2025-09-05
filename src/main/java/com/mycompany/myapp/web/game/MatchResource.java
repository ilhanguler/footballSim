package com.mycompany.myapp.web.game;

import com.mycompany.myapp.domain.game.Match;
import com.mycompany.myapp.service.game.MatchService;

import lombok.RequiredArgsConstructor;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/game")
@RequiredArgsConstructor
public class MatchResource {

    private final MatchService matchService;

    @GetMapping("/matches")
    public List<Match> getAllMatches() {
        return matchService.findAll();
    }

    @GetMapping("/matches/{id}")
    public ResponseEntity<Match> getMatch(@PathVariable Long id) {
        Optional<Match> match = matchService.findOne(id);
        return match.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/matches/by-date")
    public List<Match> getMatchesByDate(@RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return matchService.findAllByDate(date);
    }

}
