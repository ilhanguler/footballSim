package com.mycompany.myapp.domain.game;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.Instant;
import lombok.Data;

@Data
@Entity
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator", sequenceName = "sequence_generator", allocationSize = 1)
    private Long id;

    @ManyToOne
    @JsonIgnoreProperties("matches")
    private Turn turn;

    @ManyToOne
    private Team homeTeam;

    @ManyToOne
    private Team awayTeam;

    private int homeGoals;
    private int awayGoals;

    private String status; // e.g., Scheduled, Completed, Postponed

    private Instant matchDate;
}
