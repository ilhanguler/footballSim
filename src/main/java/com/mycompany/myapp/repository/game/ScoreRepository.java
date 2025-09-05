package com.mycompany.myapp.repository.game;

import com.mycompany.myapp.domain.game.Score;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ScoreRepository extends JpaRepository<Score, Long> {
    Optional<Score> findOneByTeamIdAndSeasonId(Long teamId, Long seasonId);

    List<Score> findBySeasonId(Long seasonId);

    @Modifying
    void deleteAllBySeasonId(Long seasonId);
}
