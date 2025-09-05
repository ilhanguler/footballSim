import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, RouterModule} from '@angular/router';

import { ITeamGroup } from '../team-group.model';
import SharedModule from "../../../../shared/shared.module";

@Component({
  selector: 'jhi-team-group-detail',
  templateUrl: './team-group-detail.component.html',
  standalone: true,
  imports: [
    SharedModule,
    RouterModule
  ]
})
export class TeamGroupDetailComponent implements OnInit {
  teamGroup: ITeamGroup | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ teamGroup }) => {
      this.teamGroup = teamGroup;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
