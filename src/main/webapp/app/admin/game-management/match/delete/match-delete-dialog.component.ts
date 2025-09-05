import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMatch } from '../match.model';
import { GameManagementService } from '../../game-management.service';
import SharedModule from 'app/shared/shared.module';
import {FormsModule} from "@angular/forms";

@Component({
  templateUrl: './match-delete-dialog.component.html',
  standalone: true,
  imports: [SharedModule, FormsModule],
})
export class MatchDeleteDialogComponent {
  match?: IMatch;

  constructor(
    protected gameManagementService: GameManagementService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.gameManagementService.deleteMatch(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
