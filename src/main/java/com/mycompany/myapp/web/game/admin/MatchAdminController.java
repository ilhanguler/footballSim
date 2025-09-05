package com.mycompany.myapp.web.game.admin;

import com.mycompany.myapp.domain.game.Match;
import com.mycompany.myapp.domain.game.sim.MoraleChangelog;
import com.mycompany.myapp.service.game.MatchService;

import com.mycompany.myapp.service.game.sim.MoraleChangelogService;
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
public class MatchAdminController {

    private final MatchService matchService;
    private final MoraleChangelogService moraleChangelogService;

    @PostMapping("/matches")
    public ResponseEntity<Match> createMatch(@RequestBody Match match) throws URISyntaxException {
        Match result = matchService.save(match);
        return ResponseEntity.created(new URI("/api/admin/game/matches/" + result.getId()))
            .body(result);
    }

    @PutMapping("/matches/{id}")
    public ResponseEntity<Match> updateMatch(@PathVariable Long id, @RequestBody Match match) {
        match.setId(id);
        Match result = matchService.save(match);
        return ResponseEntity.ok().body(result);
    }

    @GetMapping("/matches")
    public List<Match> getAllMatches() {
        return matchService.findAll();
    }

    @GetMapping("/matches/{id}")
    public ResponseEntity<Match> getMatch(@PathVariable Long id) {
        Optional<Match> match = matchService.findOne(id);
        return match.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/matches/{id}/morale-changelogs")
    public List<MoraleChangelog> getMoraleChangelogsByMatch(@PathVariable Long id){
        return moraleChangelogService.findByMatchId(id);
    }

    @DeleteMapping("/matches/{id}")
    public ResponseEntity<Void> deleteMatch(@PathVariable Long id) {
        matchService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
