import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { GameManagementService } from '../../game-management.service';
import { IMatch } from '../match.model';
import { MatchDeleteDialogComponent } from '../delete/match-delete-dialog.component';
import SharedModule from '../../../../shared/shared.module';
import FormatMediumDatetimePipe from '../../../../shared/date/format-medium-datetime.pipe';

@Component({
  selector: 'jhi-match',
  templateUrl: './match-list.component.html',
  standalone: true,
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class MatchListComponent implements OnInit {
  matches?: IMatch[];
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

    this.gameManagementService.queryMatches().subscribe({
      next: (res: HttpResponse<IMatch[]>) => {
        this.isLoading = false;
        this.matches = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  trackId(index: number, item: IMatch): number {
    return item.id;
  }

  delete(match: IMatch): void {
    const modalRef = this.modalService.open(MatchDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.match = match;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
