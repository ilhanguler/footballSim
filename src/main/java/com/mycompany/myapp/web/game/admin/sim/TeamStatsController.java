package com.mycompany.myapp.web.game.admin.sim;

import com.mycompany.myapp.domain.game.sim.TeamStats;
import com.mycompany.myapp.service.game.sim.TeamStatsService;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/team-stats")
@RequiredArgsConstructor
public class TeamStatsController {

    private final TeamStatsService teamStatsService;

    @PostMapping("")
    public ResponseEntity<TeamStats> createTeamStats(@RequestBody TeamStats teamStats) throws URISyntaxException {
        TeamStats result = teamStatsService.save(teamStats);
        return ResponseEntity.created(new URI("/api/admin/team-stats/" + result.getId()))
            .body(result);
    }

    @PutMapping("")
    public ResponseEntity<TeamStats> updateTeamStats(@PathVariable Long id, @RequestBody TeamStats teamStats) {
        TeamStats result = teamStatsService.save(teamStats);
        return ResponseEntity.ok()
            .body(result);
    }

    @GetMapping("")
    public List<TeamStats> getAllTeamStats() {
        return teamStatsService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeamStats> getTeamStats(@PathVariable Long id) {
        Optional<TeamStats> teamStats = teamStatsService.findOne(id);
        return ResponseUtil.wrapOrNotFound(teamStats);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeamStats(@PathVariable Long id) {
        teamStatsService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
