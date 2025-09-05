package com.mycompany.myapp.repository.game;

import com.mycompany.myapp.domain.game.Season;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SeasonRepository extends JpaRepository<Season, Long> {
    List<Season> findByLeagueId(Long leagueId);
}
