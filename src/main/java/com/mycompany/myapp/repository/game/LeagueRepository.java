package com.mycompany.myapp.repository.game;

import com.mycompany.myapp.domain.game.League;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LeagueRepository extends JpaRepository<League, Long> {
    // Additional query methods can be defined here if needed

}
    