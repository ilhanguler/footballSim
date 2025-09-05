import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ITeam, NewTeam } from '../team.model';
import { GameManagementService } from '../../game-management.service';
import SharedModule from '../../../../shared/shared.module';

@Component({
  selector: 'jhi-team-update',
  templateUrl: './team-update.component.html',
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule],
})
export class TeamUpdateComponent implements OnInit {
  isSaving = false;
  team: ITeam | null = null;

  editForm = this.fb.group({
    id: [null as number | null],
    name: [null as string | null],
  });

  constructor(protected gameManagementService: GameManagementService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ team }) => {
      this.team = team;
      if (team) {
        this.updateForm(team);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const team = this.createFromForm();
    if (team.id !== null) {
      this.subscribeToSaveResponse(this.gameManagementService.updateTeam(team));
    } else {
      this.subscribeToSaveResponse(this.gameManagementService.createTeam(team as unknown as NewTeam));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITeam>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(team: ITeam): void {
    this.editForm.patchValue({
      id: team.id,
      name: team.name,
    });
  }

  protected createFromForm(): ITeam {
    return {
      ...new Object(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
    };
  }
}
