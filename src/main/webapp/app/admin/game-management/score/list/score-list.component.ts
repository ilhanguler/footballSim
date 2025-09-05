import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { GameManagementService } from '../../game-management.service';
import { IScore } from '../score.model';
import { ScoreDeleteDialogComponent } from '../delete/score-delete-dialog.component';
import SharedModule from "../../../../shared/shared.module";

@Component({
  selector: 'jhi-score',
  templateUrl: './score-list.component.html',
  standalone: true,
  imports: [
    SharedModule,
    RouterModule
  ]
})
export class ScoreListComponent implements OnInit {
  scores?: IScore[];
  isLoading = false;

  constructor(
    protected gameManagementService: GameManagementService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.isLoading = true;

    this.gameManagementService.queryScores().subscribe({
      next: (res: HttpResponse<IScore[]>) => {
        this.isLoading = false;
        this.scores = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  trackId(index: number, item: IScore): number {
    return item.id;
  }

  delete(score: IScore): void {
    const modalRef = this.modalService.open(ScoreDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.score = score;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
