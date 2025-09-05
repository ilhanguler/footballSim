package com.mycompany.myapp.domain.game;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Score {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator", sequenceName = "sequence_generator", allocationSize = 1)
    private Long id;

    private Integer points;
    private Integer wins;
    private Integer losses;
    private Integer draws;
    private Integer goalsFor;
    private Integer goalsAgainst;
    private Integer goalDifference;

    @ManyToOne(optional = false)
    @JsonIgnoreProperties("scores")
    private Season season;

    @ManyToOne(optional = false)
    private Team team;
}
