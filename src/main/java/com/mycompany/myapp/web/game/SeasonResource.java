package com.mycompany.myapp.web.game;

import com.mycompany.myapp.domain.game.Score;
import com.mycompany.myapp.domain.game.Season;
import com.mycompany.myapp.domain.game.Team;
import com.mycompany.myapp.domain.game.Turn;
import com.mycompany.myapp.service.game.ScoreService;
import com.mycompany.myapp.service.game.SeasonService;
import com.mycompany.myapp.service.game.TeamService;
import com.mycompany.myapp.service.game.TurnService;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/game")
@RequiredArgsConstructor
public class SeasonResource {

    private final SeasonService seasonService;
    private final TurnService turnService;
    private final ScoreService scoreService;
    private final TeamService teamService;

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

    @GetMapping("/seasons/{id}/scores")
    public List<Score> getScoresBySeason(@PathVariable Long id) {
        return scoreService.findScoresBySeason(id);
    }

    @GetMapping("/seasons/{id}/teams")
    public List<Team> getTeamsBySeason(@PathVariable Long id) {
        return teamService.findTeamsBySeason(id);
    }

}
