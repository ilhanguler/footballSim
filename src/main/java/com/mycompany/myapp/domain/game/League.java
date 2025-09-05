package com.mycompany.myapp.domain.game;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.HashSet;
import java.util.Set;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Data
@Entity
public class League {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator", sequenceName = "sequence_generator", allocationSize = 1)
    private Long id;

    @NotNull
    @Size(min = 1, max = 50)
    @Column(length = 50, nullable = false, unique = true)
    private String name;

    @OneToMany(mappedBy = "league")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Season> seasons = new HashSet<>();
}
