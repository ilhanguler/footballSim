package com.mycompany.myapp.domain.game;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Data
@Entity
public class Season {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator", sequenceName = "sequence_generator", allocationSize = 1)
    private Long id;

    private String name;

    private Instant startDate;

    private Instant endDate;

    private int currentTurn;

    @ManyToOne
    @JsonIgnoreProperties("seasons")
    private League league;

    @OneToMany(mappedBy = "season")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Turn> turns = new HashSet<>();

    @OneToMany(mappedBy = "season")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Score> scores = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "season_team",
        joinColumns = @JoinColumn(name = "season_id"),
        inverseJoinColumns = @JoinColumn(name = "team_id")
    )
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Team> teams = new HashSet<>();
}
