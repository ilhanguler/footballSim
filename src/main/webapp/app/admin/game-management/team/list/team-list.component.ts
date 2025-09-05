import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { GameManagementService } from '../../game-management.service';
import { ITeam } from '../team.model';
import SharedModule from '../../../../shared/shared.module';

@Component({
  selector: 'jhi-team',
  templateUrl: './team-list.component.html',
  standalone: true,
  imports: [SharedModule, RouterModule],
})
export class TeamListComponent implements OnInit {
  teams?: ITeam[];
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

    this.gameManagementService.queryTeams().subscribe({
      next: (res: HttpResponse<ITeam[]>) => {
        this.isLoading = false;
        this.teams = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  trackId(index: number, item: ITeam): number {
    return item.id;
  }

  delete(team: ITeam): void {
    if (team.id) {
      this.gameManagementService.deleteTeam(team.id).subscribe(() => {
        this.loadAll();
      });
    }
  }
}
