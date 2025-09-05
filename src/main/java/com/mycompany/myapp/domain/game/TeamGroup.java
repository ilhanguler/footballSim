package com.mycompany.myapp.domain.game;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Data
@Entity
public class TeamGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator", sequenceName = "sequence_generator", allocationSize = 1)
    private Long id;

    private String name;

    @ManyToOne
    @JsonIgnoreProperties("teamGroups")
    private Turn turn;

    @ManyToMany
    @JoinTable(
        name = "team_group_team",
        joinColumns = @JoinColumn(name = "team_group_id"),
        inverseJoinColumns = @JoinColumn(name = "team_id")
    )
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Team> teams = new HashSet<>();
}
