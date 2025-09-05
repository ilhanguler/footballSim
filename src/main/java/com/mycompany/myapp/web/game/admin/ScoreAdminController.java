package com.mycompany.myapp.web.game.admin;

import com.mycompany.myapp.domain.game.Score;
import com.mycompany.myapp.service.game.ScoreService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/game")
@RequiredArgsConstructor
public class ScoreAdminController {

    private final ScoreService scoreService;

    @PostMapping("/scores")
    public ResponseEntity<Score> createScore(@RequestBody Score score) throws URISyntaxException {
        Score result = scoreService.save(score);
        return ResponseEntity.created(new URI("/api/admin/game/scores/" + result.getId()))
            .body(result);
    }

    @PutMapping("/scores/{id}")
    public ResponseEntity<Score> updateScore(@PathVariable Long id, @RequestBody Score score) {
        score.setId(id);
        Score result = scoreService.save(score);
        return ResponseEntity.ok().body(result);
    }

    @GetMapping("/scores")
    public List<Score> getAllScores() {
        return scoreService.findAll();
    }

    @GetMapping("/scores/{id}")
    public ResponseEntity<Score> getScore(@PathVariable Long id) {
        Optional<Score> score = scoreService.findOne(id);
        return score.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/scores/{id}")
    public ResponseEntity<Void> deleteScore(@PathVariable Long id) {
        scoreService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
