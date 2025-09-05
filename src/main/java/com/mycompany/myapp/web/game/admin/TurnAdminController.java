package com.mycompany.myapp.web.game.admin;

import com.mycompany.myapp.domain.game.Turn;
import com.mycompany.myapp.service.game.TurnService;

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
public class TurnAdminController {

    private final TurnService turnService;

    @PostMapping("/turns")
    public ResponseEntity<Turn> createTurn(@RequestBody Turn turn) throws URISyntaxException {
        Turn result = turnService.save(turn);
        return ResponseEntity.created(new URI("/api/admin/game/turns/" + result.getId()))
            .body(result);
    }

    @PutMapping("/turns/{id}")
    public ResponseEntity<Turn> updateTurn(@PathVariable Long id, @RequestBody Turn turn) {
        turn.setId(id);
        Turn result = turnService.save(turn);
        return ResponseEntity.ok().body(result);
    }

    @GetMapping("/turns")
    public List<Turn> getAllTurns() {
        return turnService.findAll();
    }

    @GetMapping("/turns/{id}")
    public ResponseEntity<Turn> getTurn(@PathVariable Long id) {
        Optional<Turn> turn = turnService.findOne(id);
        return turn.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/turns/{id}")
    public ResponseEntity<Void> deleteTurn(@PathVariable Long id) {
        turnService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
