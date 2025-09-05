import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITeamGroup } from '../team-group.model';
import { GameManagementService } from '../../game-management.service';
import SharedModule from 'app/shared/shared.module';

@Component({
  templateUrl: './team-group-delete-dialog.component.html',
  standalone: true,
  imports: [SharedModule],
})
export class TeamGroupDeleteDialogComponent {
  teamGroup?: ITeamGroup;

  constructor(
    protected gameManagementService: GameManagementService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.gameManagementService.deleteTeamGroup(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
