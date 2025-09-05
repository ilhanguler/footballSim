import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { GameManagementService } from '../../game-management.service';
import { ILeague } from '../league.model';
import SharedModule from '../../../../shared/shared.module';

@Component({
  selector: 'jhi-league',
  templateUrl: './league-list.component.html',
  standalone: true,
  imports: [SharedModule, RouterModule],
})
export class LeagueListComponent implements OnInit {
  leagues?: ILeague[];
  isLoading = false;

  constructor(
    protected gameManagementService: GameManagementService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.isLoading = true;

    this.gameManagementService.queryLeagues().subscribe({
      next: (res: HttpResponse<ILeague[]>) => {
        this.isLoading = false;
        this.leagues = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  trackId(index: number, item: ILeague): number {
    return item.id;
  }

  delete(league: ILeague): void {
    if (league.id) {
      this.gameManagementService.deleteLeague(league.id).subscribe(() => {
        this.loadAll();
      });
    }
  }
}
