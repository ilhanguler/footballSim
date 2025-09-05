package com.mycompany.myapp.repository.game;

import com.mycompany.myapp.domain.game.TeamGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeamGroupRepository extends JpaRepository<TeamGroup, Long> {
}
