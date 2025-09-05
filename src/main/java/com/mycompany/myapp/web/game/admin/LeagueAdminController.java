package com.mycompany.myapp.web.game.admin;

import com.mycompany.myapp.domain.game.League;
import com.mycompany.myapp.domain.game.Season;
import com.mycompany.myapp.service.game.LeagueService;

import com.mycompany.myapp.service.game.SeasonService;
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
public class LeagueAdminController {

    private final LeagueService leagueService;
    private final SeasonService seasonService;

    @PostMapping("/leagues")
    public ResponseEntity<League> createLeague(@RequestBody League league) throws URISyntaxException {
        League result = leagueService.save(league);
        return ResponseEntity.created(new URI("/api/admin/game/leagues/" + result.getId()))
            .body(result);
    }

    @PutMapping("/leagues/{id}")
    public ResponseEntity<League> updateLeague(@PathVariable Long id, @RequestBody League league) {
        league.setId(id);
        League result = leagueService.save(league);
        return ResponseEntity.ok().body(result);
    }

    @GetMapping("/leagues")
    public List<League> getAllLeagues() {
        return leagueService.findAll();
    }

    @GetMapping("/leagues/{id}")
    public ResponseEntity<League> getLeague(@PathVariable Long id) {
        Optional<League> league = leagueService.findOne(id);
        return league.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/leagues/{id}/seasons")
    public List<Season> getSeasonsByLeague(@PathVariable Long id) {
        return seasonService.findSeasonsByLeague(id);
    }

    @DeleteMapping("/leagues/{id}")
    public ResponseEntity<Void> deleteLeague(@PathVariable Long id) {
        leagueService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
