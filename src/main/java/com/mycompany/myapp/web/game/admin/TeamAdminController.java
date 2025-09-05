package com.mycompany.myapp.web.game.admin;

import com.mycompany.myapp.domain.game.Team;
import com.mycompany.myapp.domain.game.sim.MoraleChangelog;
import com.mycompany.myapp.domain.game.sim.TeamStats;
import com.mycompany.myapp.repository.game.sim.TeamStatsRepository;
import com.mycompany.myapp.service.game.TeamService;

import com.mycompany.myapp.service.game.sim.MoraleChangelogService;
import com.mycompany.myapp.service.game.sim.TeamStatsService;
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
public class TeamAdminController {

    private final TeamService teamService;
    private final TeamStatsService teamStatsService;
    private final MoraleChangelogService moraleChangelogService;

    @PostMapping("/teams")
    public ResponseEntity<Team> createTeam(@RequestBody Team team) throws URISyntaxException {
        Team result = teamService.save(team);
        return ResponseEntity.created(new URI("/api/admin/game/teams/" + result.getId()))
            .body(result);
    }

    @PutMapping("/teams/{id}")
    public ResponseEntity<Team> updateTeam(@PathVariable Long id, @RequestBody Team team) {
        team.setId(id);
        Team result = teamService.save(team);
        return ResponseEntity.ok().body(result);
    }

    @GetMapping("/teams")
    public List<Team> getAllTeams() {
        return teamService.findAll();
    }

    @GetMapping("/teams/{id}")
    public ResponseEntity<Team> getTeam(@PathVariable Long id) {
        Optional<Team> team = teamService.findOne(id);
        return team.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/teams/{id}/team-stats")
    public Optional<TeamStats> getTeamStatsByTeam(@PathVariable Long id) {
        return teamStatsService.findByTeamId(id);
    }

    @GetMapping("/teams/{id}/morale-changelogs")
    public List<MoraleChangelog> getMoraleChangelogsByTeam(@PathVariable Long id){
        return moraleChangelogService.findByTeamId(id);
    }

    @DeleteMapping("/teams/{id}")
    public ResponseEntity<Void> deleteTeam(@PathVariable Long id) {
        teamService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
