package com.mycompany.myapp.web.game;

import com.mycompany.myapp.domain.game.Score;
import com.mycompany.myapp.service.game.ScoreService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/game")
@RequiredArgsConstructor
public class ScoreResource {

    private final ScoreService scoreService;

    @GetMapping("/scores")
    public List<Score> getAllScores() {
        return scoreService.findAll();
    }

    @GetMapping("/scores/{id}")
    public ResponseEntity<Score> getScore(@PathVariable Long id) {
        Optional<Score> score = scoreService.findOne(id);
        return score.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
}
