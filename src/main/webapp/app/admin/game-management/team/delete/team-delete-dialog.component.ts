import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITeam } from '../team.model';
import { GameManagementService } from '../../game-management.service';
import {AlertErrorComponent} from "../../../../shared/alert/alert-error.component";
import {FormsModule} from "@angular/forms";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {NgIf} from "@angular/common";
import TranslateDirective from "../../../../shared/language/translate.directive";

@Component({
  templateUrl: './team-delete-dialog.component.html',
  standalone: true,
  imports: [
    AlertErrorComponent,
    FormsModule,
    FaIconComponent,
    NgIf,
    TranslateDirective
  ]
})
export class TeamDeleteDialogComponent {
  team?: ITeam;

  constructor(protected gameManagementService: GameManagementService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.gameManagementService.deleteTeam(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
