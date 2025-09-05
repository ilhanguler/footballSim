package com.mycompany.myapp.web.game;

import com.mycompany.myapp.domain.game.Match;
import com.mycompany.myapp.domain.game.Turn;
import com.mycompany.myapp.service.game.MatchService;
import com.mycompany.myapp.service.game.TurnService;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/game")
@RequiredArgsConstructor
public class TurnResource {

    private final TurnService turnService;
    private final MatchService matchService;

    @GetMapping("/turns")
    public List<Turn> getAllTurns() {
        return turnService.findAll();
    }

    @GetMapping("/turns/{id}")
    public ResponseEntity<Turn> getTurn(@PathVariable Long id) {
        Optional<Turn> turn = turnService.findOne(id);
        return turn.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/turns/{id}/matches")
    public List<Match> getMatchesByTurn(@PathVariable Long id) {
        return matchService.findMatchesByTurn(id);
    }
}
