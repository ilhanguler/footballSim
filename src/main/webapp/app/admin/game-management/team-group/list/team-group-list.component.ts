import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { GameManagementService } from '../../game-management.service';
import { ITeamGroup } from '../team-group.model';
import { TeamGroupDeleteDialogComponent } from '../delete/team-group-delete-dialog.component';
import SharedModule from "../../../../shared/shared.module";

@Component({
  selector: 'jhi-team-group',
  templateUrl: './team-group-list.component.html',
  standalone: true,
  imports: [
    SharedModule,
    RouterModule
  ]
})
export class TeamGroupListComponent implements OnInit {
  teamGroups?: ITeamGroup[];
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

    this.gameManagementService.queryTeamGroups().subscribe({
      next: (res: HttpResponse<ITeamGroup[]>) => {
        this.isLoading = false;
        this.teamGroups = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  trackId(index: number, item: ITeamGroup): number {
    return item.id;
  }

  delete(teamGroup: ITeamGroup): void {
    const modalRef = this.modalService.open(TeamGroupDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.teamGroup = teamGroup;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
