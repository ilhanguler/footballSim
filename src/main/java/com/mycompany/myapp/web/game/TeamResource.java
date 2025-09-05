package com.mycompany.myapp.web.game;

import com.mycompany.myapp.domain.game.Match;
import com.mycompany.myapp.domain.game.Team;
import com.mycompany.myapp.service.game.MatchService;
import com.mycompany.myapp.service.game.TeamService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/game")
@RequiredArgsConstructor
public class TeamResource {

    private final TeamService teamService;
    private final MatchService matchService;

    @GetMapping("/teams")
    public List<Team> getAllTeams() {
        return teamService.findAll();
    }

    @GetMapping("/teams/{id}")
    public ResponseEntity<Team> getTeam(@PathVariable Long id) {
        Optional<Team> team = teamService.findOne(id);
        return team.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/teams/{id}/matches")
    public List<Match> getMatchesByTeam(@PathVariable Long id){
        return matchService.findMatchesByTeamId(id);
    }
}
