package com.mycompany.myapp.web.game;

import com.mycompany.myapp.domain.game.TeamGroup;
import com.mycompany.myapp.service.game.TeamGroupService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/game")
@RequiredArgsConstructor
public class TeamGroupResource {

    private final TeamGroupService teamGroupService;

    @GetMapping("/team-groups")
    public List<TeamGroup> getAllTeamGroups() {
        return teamGroupService.findAll();
    }

    @GetMapping("/team-groups/{id}")
    public ResponseEntity<TeamGroup> getTeamGroup(@PathVariable Long id) {
        Optional<TeamGroup> teamGroup = teamGroupService.findOne(id);
        return teamGroup.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
}
