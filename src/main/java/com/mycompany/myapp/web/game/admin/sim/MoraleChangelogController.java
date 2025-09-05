package com.mycompany.myapp.web.game.admin.sim;

import com.mycompany.myapp.domain.game.sim.MoraleChangelog;
import com.mycompany.myapp.service.game.sim.MoraleChangelogService;
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
@RequestMapping("/api/admin/morale-changelogs")
@RequiredArgsConstructor
public class MoraleChangelogController {

    private final MoraleChangelogService moraleChangelogService;

    @PostMapping("")
    public ResponseEntity<MoraleChangelog> createMoraleChangelog(@RequestBody MoraleChangelog moraleChangelog) throws URISyntaxException {
        MoraleChangelog result = moraleChangelogService.save(moraleChangelog);
        return ResponseEntity.created(new URI("/api/admin/morale-changelogs/" + result.getId()))
            .body(result);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MoraleChangelog> updateMoraleChangelog(@PathVariable Long id, @RequestBody MoraleChangelog moraleChangelog) {
        MoraleChangelog result = moraleChangelogService.save(moraleChangelog);
        return ResponseEntity.ok()
            .body(result);
    }

    @GetMapping("")
    public List<MoraleChangelog> getAllMoraleChangelogs() {
        return moraleChangelogService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MoraleChangelog> getMoraleChangelog(@PathVariable Long id) {
        Optional<MoraleChangelog> moraleChangelog = moraleChangelogService.findOne(id);
        return ResponseUtil.wrapOrNotFound(moraleChangelog);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMoraleChangelog(@PathVariable Long id) {
        moraleChangelogService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
