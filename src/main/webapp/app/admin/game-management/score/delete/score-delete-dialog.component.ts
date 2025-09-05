import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IScore } from '../score.model';
import { GameManagementService } from '../../game-management.service';
import SharedModule from 'app/shared/shared.module';

@Component({
  templateUrl: './score-delete-dialog.component.html',
  standalone: true,
  imports: [SharedModule],
})
export class ScoreDeleteDialogComponent {
  score?: IScore;

  constructor(protected gameManagementService: GameManagementService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.gameManagementService.deleteScore(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
