package com.mycompany.myapp.web.game.admin;

import com.mycompany.myapp.domain.game.Season;
import com.mycompany.myapp.domain.game.Turn;
import com.mycompany.myapp.service.game.MatchService;
import com.mycompany.myapp.service.game.SeasonService;

import com.mycompany.myapp.service.game.TurnService;
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
public class SeasonAdminController {

    private final SeasonService seasonService;
    private final TurnService turnService;
    private final MoraleChangelogService moraleChangelogService;
    private final MatchService matchService;

    @PostMapping("/seasons")
    public ResponseEntity<Season> createSeason(@RequestBody Season season) throws URISyntaxException {
        Season result = seasonService.save(season);
        return ResponseEntity.created(new URI("/api/admin/game/seasons/" + result.getId()))
            .body(result);
    }

    @PutMapping("/seasons/{id}")
    public ResponseEntity<Season> updateSeason(@PathVariable Long id, @RequestBody Season season) {
        season.setId(id);
        Season result = seasonService.save(season);
        return ResponseEntity.ok().body(result);
    }

    @GetMapping("/seasons")
    public List<Season> getAllSeasons() {
        return seasonService.findAll();
    }

    @GetMapping("/seasons/{id}")
    public ResponseEntity<Season> getSeason(@PathVariable Long id) {
        Optional<Season> season = seasonService.findOne(id);
        return season.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/seasons/{id}/turns")
    public List<Turn> getTurnsBySeason(@PathVariable Long id) {
        return turnService.findTurnsBySeason(id);
    }

    @DeleteMapping("/seasons/{id}")
    public ResponseEntity<Void> deleteSeason(@PathVariable Long id) {
        seasonService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/seasons/{id}/morale-changelogs")
    public ResponseEntity<Void> deleteMoraleChangelogsBySeason(@PathVariable Long id){
        moraleChangelogService.deleteAllBySeason(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/seasons/{id}/matches")
    public ResponseEntity<Void> deleteMatchesBySeason(@PathVariable Long id){
        matchService.deleteAllBySeason(id);
        return ResponseEntity.noContent().build();
    }
}
