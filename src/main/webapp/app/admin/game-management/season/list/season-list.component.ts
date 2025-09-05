import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { GameManagementService } from '../../game-management.service';
import { ISeason } from '../season.model';
import SharedModule from "../../../../shared/shared.module";
import FormatMediumDatetimePipe from "../../../../shared/date/format-medium-datetime.pipe";

@Component({
  selector: 'jhi-season',
  templateUrl: './season-list.component.html',
  standalone: true,
  imports: [
    SharedModule,
    RouterModule,
    FormatMediumDatetimePipe,
  ]
})
export class SeasonListComponent implements OnInit {
  seasons?: ISeason[];
  isLoading = false;

  constructor(protected gameManagementService: GameManagementService, protected activatedRoute: ActivatedRoute, protected router: Router) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.isLoading = true;

    this.gameManagementService.querySeasons().subscribe({
      next: (res: HttpResponse<ISeason[]>) => {
        this.isLoading = false;
        this.seasons = res. body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  trackId(index: number, item: ISeason): number {
    return item.id;
  }

  delete(season: ISeason): void {
    if (season.id) {
      this.gameManagementService.deleteSeason(season.id).subscribe(() => {
        this.loadAll();
      });
    }
  }
}
