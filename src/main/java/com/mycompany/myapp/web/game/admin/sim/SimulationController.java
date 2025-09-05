package com.mycompany.myapp.web.game.admin.sim;

import com.mycompany.myapp.service.game.SeasonService;
import com.mycompany.myapp.service.game.TurnService;
import com.mycompany.myapp.service.game.sim.SimulationService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for managing simulations.
 */
@RestController
@RequestMapping("/api/admin/simulation")
@RequiredArgsConstructor
public class SimulationController {

    private final Logger log = LoggerFactory.getLogger(SimulationController.class);

    private final SimulationService simulationService;
    private final SeasonService seasonService;
    private final TurnService turnService;

    /**
     * {@code POST  /season/{seasonId}} : Simulates a full season.
     *
     * @param seasonId the id of the season to simulate.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} or with status {@code 404 (Not Found)} if the season does not exist.
     */
    @PostMapping("/season/{seasonId}")
    public ResponseEntity<Void> simulateSeason(@PathVariable Long seasonId) {
        log.debug("REST request to simulate Season : {}", seasonId);
        return seasonService
            .findOne(seasonId)
            .map(
                season -> {
                    simulationService.simulateSeason(season);
                    return ResponseEntity.ok().<Void>build();
                }
            )
            .orElse(ResponseEntity.notFound().build());
    }

    /**
     * {@code POST  /turn/{turnId}} : Simulates a single turn.
     *
     * @param turnId the id of the turn to simulate.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} or with status {@code 404 (Not Found)} if the turn does not exist.
     */
    @PostMapping("/turn/{turnId}")
    public ResponseEntity<Void> simulateTurn(@PathVariable Long turnId) {
        log.debug("REST request to simulate Turn : {}", turnId);
        return turnService
            .findOne(turnId)
            .map(
                turn -> {
                    simulationService.simulateTurn(turn);
                    return ResponseEntity.ok().<Void>build();
                }
            )
            .orElse(ResponseEntity.notFound().build());
    }
}
