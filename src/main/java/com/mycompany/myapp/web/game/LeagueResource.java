package com.mycompany.myapp.web.game;

import com.mycompany.myapp.domain.game.League;
import com.mycompany.myapp.domain.game.Season;
import com.mycompany.myapp.service.game.LeagueService;
import com.mycompany.myapp.service.game.SeasonService;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/game")
@RequiredArgsConstructor
public class LeagueResource {

    private final LeagueService leagueService;
    private final SeasonService seasonService;

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
}
