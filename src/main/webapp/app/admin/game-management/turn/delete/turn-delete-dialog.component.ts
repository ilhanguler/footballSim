import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITurn } from '../turn.model';
import { GameManagementService } from '../../game-management.service';
import {AlertErrorComponent} from "../../../../shared/alert/alert-error.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FormsModule} from "@angular/forms";
import { NgIf } from '@angular/common';
import TranslateDirective from "../../../../shared/language/translate.directive";

@Component({
  templateUrl: './turn-delete-dialog.component.html',
  standalone: true,
  imports: [
    AlertErrorComponent,
    FaIconComponent,
    FormsModule,
    NgIf,
    TranslateDirective
  ]
})
export class TurnDeleteDialogComponent {
  turn?: ITurn;

  constructor(protected gameManagementService: GameManagementService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.gameManagementService.deleteTurn(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
