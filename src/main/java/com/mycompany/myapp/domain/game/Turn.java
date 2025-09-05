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
public class Turn {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator", sequenceName = "sequence_generator", allocationSize = 1)
    private Long id;

    private String name;

    private Integer turnNumber;

    private boolean eliminationEnabled;

    private Instant startDate;

    private Instant endDate;

    @ManyToOne
    @JsonIgnoreProperties("turns")
    private Season season;

    @OneToMany(mappedBy = "turn")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Match> matches = new HashSet<>();

    @OneToMany(mappedBy = "turn")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<TeamGroup> teamGroups = new HashSet<>();
}
