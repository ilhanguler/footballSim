import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { ITeam } from '../team.model';
import SharedModule from '../../../../shared/shared.module';

@Component({
  selector: 'jhi-team-detail',
  templateUrl: './team-detail.component.html',
  standalone: true,
  imports: [SharedModule, RouterModule],
})
export class TeamDetailComponent implements OnInit {
  team: ITeam | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ team }) => {
      this.team = team;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
