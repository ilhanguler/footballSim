package com.mycompany.myapp.service.game.sim;

import com.mycompany.myapp.domain.game.sim.MoraleChangelog;
import com.mycompany.myapp.repository.game.sim.MoraleChangelogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class MoraleChangelogService {

    private final MoraleChangelogRepository moraleChangelogRepository;

    public MoraleChangelog save(MoraleChangelog moraleChangelog) { return moraleChangelogRepository.save(moraleChangelog); }

    @Transactional(readOnly = true)
    public List<MoraleChangelog> findAll() { return moraleChangelogRepository.findAll(); }

    @Transactional(readOnly = true)
    public Optional<MoraleChangelog> findOne(Long id) { return moraleChangelogRepository.findById(id); }

    @Transactional(readOnly = true)
    public List<MoraleChangelog> findByMatchId(Long id){ return moraleChangelogRepository.findByMatchId(id); }

    @Transactional(readOnly = true)
    public List<MoraleChangelog> findByTeamId(Long id){ return moraleChangelogRepository.findByTeamStatsTeamId(id); }

    public void delete(Long id) { moraleChangelogRepository.deleteById(id); }

    public void deleteAllBySeason(Long id){
        moraleChangelogRepository.deleteAllByMatchTurnSeasonId(id);
    }
}
