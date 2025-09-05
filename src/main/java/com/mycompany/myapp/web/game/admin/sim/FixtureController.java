package com.mycompany.myapp.web.game.admin.sim;

import com.mycompany.myapp.service.game.sim.FixtureService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for managing fixtures.
 */
@RestController
@RequestMapping("/api/admin/fixture")
@RequiredArgsConstructor
public class FixtureController {

    private final Logger log = LoggerFactory.getLogger(FixtureController.class);

    private final FixtureService fixtureService;

    /**
     * {@code POST  /season/{seasonId}} : Creates a new, clean fixture for a full season.
     * Deletes any existing turns and matches for the season before generating new ones.
     *
     * @param seasonId the id of the season to create the fixture for.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} if the fixture was created,
     * or with status {@code 404 (Not Found)} if the season does not exist.
     */
    @PostMapping("/season/{seasonId}")
    public ResponseEntity<Void> createFixtureForSeason(@PathVariable Long seasonId) {
        log.debug("REST request to create Fixture for Season : {}", seasonId);

        boolean success = fixtureService.generateNewFixtureForSeason(seasonId);

        if (success) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
