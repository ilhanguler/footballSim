import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, RouterModule} from '@angular/router';

import { ITurn } from '../turn.model';
import SharedModule from "../../../../shared/shared.module";
import FormatMediumDatetimePipe from "../../../../shared/date/format-medium-datetime.pipe";

@Component({
  selector: 'jhi-turn-detail',
  templateUrl: './turn-detail.component.html',
  standalone: true,
  imports: [
    SharedModule,
    RouterModule,
    FormatMediumDatetimePipe
  ]
})
export class TurnDetailComponent implements OnInit {
  turn: ITurn | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ turn }) => {
      this.turn = turn;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
