import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { IMatch } from '../match.model';
import SharedModule from "../../../../shared/shared.module";
import FormatMediumDatetimePipe from "../../../../shared/date/format-medium-datetime.pipe";

@Component({
  selector: 'jhi-match-detail',
  templateUrl: './match-detail.component.html',
  standalone: true,
  imports: [
    SharedModule,
    RouterModule,
    FormatMediumDatetimePipe,
  ]
})
export class MatchDetailComponent implements OnInit {
  match: IMatch | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ match }) => {
      this.match = match;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
