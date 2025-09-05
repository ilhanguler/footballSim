import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ILeague, NewLeague } from '../league.model';
import { GameManagementService } from '../../game-management.service';
import SharedModule from '../../../../shared/shared.module';

@Component({
  selector: 'jhi-league-update',
  templateUrl: './league-update.component.html',
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule],
})
export class LeagueUpdateComponent implements OnInit {
  isSaving = false;
  league: ILeague | null = null;

  editForm = this.fb.group({
    id: [null as number | null],
    name: [null as string | null],
  });

  constructor(
    protected gameManagementService: GameManagementService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ league }) => {
      this.league = league;
      if (league) {
        this.updateForm(league);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const league = this.createFromForm();
    if (league.id != null) {
      this.subscribeToSaveResponse(this.gameManagementService.updateLeague(league as ILeague));
    } else {
      this.subscribeToSaveResponse(this.gameManagementService.createLeague(league as NewLeague));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILeague>>): void {
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

  protected updateForm(league: ILeague): void {
    this.editForm.patchValue({
      id: league.id,
      name: league.name,
    });
  }

  protected createFromForm(): ILeague | NewLeague {
    const raw = this.editForm.getRawValue();
    return {
      ...new Object(),
      id: raw.id,
      name: raw.name,
    };
  }
}
