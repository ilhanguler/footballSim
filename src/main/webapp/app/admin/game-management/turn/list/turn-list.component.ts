import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { GameManagementService } from '../../game-management.service';
import { ITurn } from '../turn.model';
import SharedModule from '../../../../shared/shared.module';
import FormatMediumDatetimePipe from "../../../../shared/date/format-medium-datetime.pipe";

@Component({
  selector: 'jhi-turn',
  templateUrl: './turn-list.component.html',
  standalone: true,
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class TurnListComponent implements OnInit {
  turns?: ITurn[];
  isLoading = false;

  constructor(
    protected gameManagementService: GameManagementService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.isLoading = true;

    this.gameManagementService.queryTurns().subscribe({
      next: (res: HttpResponse<ITurn[]>) => {
        this.isLoading = false;
        this.turns = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  trackId(index: number, item: ITurn): number {
    return item.id;
  }

  delete(turn: ITurn): void {
    if (turn.id) {
      this.gameManagementService.deleteTurn(turn.id).subscribe(() => {
        this.loadAll();
      });
    }
  }
}
