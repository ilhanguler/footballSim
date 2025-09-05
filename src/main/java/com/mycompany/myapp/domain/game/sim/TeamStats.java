package com.mycompany.myapp.domain.game.sim;

import com.mycompany.myapp.domain.game.Team;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
@Entity
@Table(name = "team_stats")
public class TeamStats {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator", sequenceName = "sequence_generator", allocationSize = 1)
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(unique = true, nullable = false)
    private Team team;

    @Min(value = 0)
    @Max(value = 100)
    private Integer skill;

    @Min(value = 0)
    @Max(value = 1)
    private Double morale;
}
