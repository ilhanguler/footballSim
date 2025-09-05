import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { ILeague } from '../league.model';
import SharedModule from '../../../../shared/shared.module';

@Component({
  selector: 'jhi-league-detail',
  templateUrl: './league-detail.component.html',
  standalone: true,
  imports: [SharedModule, RouterModule],
})
export class LeagueDetailComponent implements OnInit {
  league: ILeague | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ league }) => {
      this.league = league;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
