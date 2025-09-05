package com.mycompany.myapp.domain.game.sim;

import com.mycompany.myapp.domain.game.Match;
import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;

@Data
@Entity
@Table(name = "morale_changelog")
public class MoraleChangelog {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator", sequenceName = "sequence_generator", allocationSize = 1)
    private Long id;

    private Double moraleChange;

    private Double moraleBefore;

    @ManyToOne
    private TeamStats teamStats;

    @ManyToOne
    private Match match;
}
