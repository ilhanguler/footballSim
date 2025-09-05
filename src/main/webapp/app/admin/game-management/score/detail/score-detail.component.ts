import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, RouterModule} from '@angular/router';

import { IScore } from '../score.model';
import SharedModule from "../../../../shared/shared.module";

@Component({
  selector: 'jhi-score-detail',
  templateUrl: './score-detail.component.html',
  standalone: true,
  imports: [
    SharedModule,
    RouterModule
  ]
})
export class ScoreDetailComponent implements OnInit {
  score: IScore | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ score }) => {
      this.score = score;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
