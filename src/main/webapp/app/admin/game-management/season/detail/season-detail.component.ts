import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { ISeason } from '../season.model';
import SharedModule from "../../../../shared/shared.module";
import FormatMediumDatetimePipe from "../../../../shared/date/format-medium-datetime.pipe";

@Component({
  selector: 'jhi-season-detail',
  templateUrl: './season-detail.component.html',
  standalone: true,
  imports: [
    SharedModule,
    RouterModule,
    FormatMediumDatetimePipe,
  ]
})
export class SeasonDetailComponent implements OnInit {
  season: ISeason | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ season }) => {
      this.season = season;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
