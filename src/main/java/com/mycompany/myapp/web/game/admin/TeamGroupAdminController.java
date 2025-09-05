package com.mycompany.myapp.web.game.admin;

import com.mycompany.myapp.domain.game.TeamGroup;
import com.mycompany.myapp.service.game.TeamGroupService;

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
public class TeamGroupAdminController {

    private final TeamGroupService teamGroupService;

    @PostMapping("/team-groups")
    public ResponseEntity<TeamGroup> createTeamGroup(@RequestBody TeamGroup teamGroup) throws URISyntaxException {
        TeamGroup result = teamGroupService.save(teamGroup);
        return ResponseEntity.created(new URI("/api/admin/game/team-groups/" + result.getId()))
            .body(result);
    }

    @PutMapping("/team-groups/{id}")
    public ResponseEntity<TeamGroup> updateTeamGroup(@PathVariable Long id, @RequestBody TeamGroup teamGroup) {
        teamGroup.setId(id);
        TeamGroup result = teamGroupService.save(teamGroup);
        return ResponseEntity.ok().body(result);
    }

    @GetMapping("/team-groups")
    public List<TeamGroup> getAllTeamGroups() {
        return teamGroupService.findAll();
    }

    @GetMapping("/team-groups/{id}")
    public ResponseEntity<TeamGroup> getTeamGroup(@PathVariable Long id) {
        Optional<TeamGroup> teamGroup = teamGroupService.findOne(id);
        return teamGroup.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/team-groups/{id}")
    public ResponseEntity<Void> deleteTeamGroup(@PathVariable Long id) {
        teamGroupService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
