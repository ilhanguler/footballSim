package com.mycompany.myapp.repository.game;

import com.mycompany.myapp.domain.game.Turn;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TurnRepository extends JpaRepository<Turn, Long> {
    List<Turn> findBySeasonId(Long seasonId);

    void deleteAllBySeasonId(Long seasonId);
}
