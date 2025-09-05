import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ITurn, NewTurn } from '../turn.model';
import { GameManagementService } from '../../game-management.service';
import { ISeason } from 'app/admin/game-management/season/season.model';
import SharedModule from 'app/shared/shared.module';

@Component({
  selector: 'jhi-turn-update',
  templateUrl: './turn-update.component.html',
  standalone: true,
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class TurnUpdateComponent implements OnInit {
  isSaving = false;
  turn: ITurn | null = null;

  seasonsSharedCollection: ISeason[] = [];

  editForm = this.fb.group({
    id: [null as number | null],
    name: [null as string | null],
    turnNumber: [null as number | null],
    eliminationEnabled: [null as boolean | null],
    startDate: [null as import('dayjs/esm').Dayjs | null],
    endDate: [null as import('dayjs/esm').Dayjs | null],
    season: [null as (Pick<ISeason, 'id'> | ISeason | null)],
  });

  constructor(
    protected gameManagementService: GameManagementService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ turn }) => {
      this.turn = turn;
      if (turn) {
        this.updateForm(turn);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const turn = this.createFromForm();
    if (turn.id !== null) {
      this.subscribeToSaveResponse(this.gameManagementService.updateTurn(turn));
    } else {
      this.subscribeToSaveResponse(this.gameManagementService.createTurn(turn as unknown as NewTurn));
    }
  }

  // Comparator for Angular [compareWith]
  compareSeason = (o1: Pick<ISeason, 'id'> | null, o2: Pick<ISeason, 'id'> | null): boolean =>
    this.gameManagementService.compareSeason(o1, o2);

  trackSeasonById(index: number, item: ISeason): number {
    return item.id;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITurn>>): void {
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

  protected updateForm(turn: ITurn): void {
    this.editForm.patchValue({
      id: turn.id,
      name: turn.name,
      turnNumber: turn.turnNumber,
      eliminationEnabled: turn.eliminationEnabled,
      startDate: turn.startDate,
      endDate: turn.endDate,
      season: turn.season,
    });

    this.seasonsSharedCollection = this.gameManagementService.addSeasonToCollectionIfMissing<ISeason>(this.seasonsSharedCollection, turn.season);
  }

  protected loadRelationshipsOptions(): void {
    this.gameManagementService
      .querySeasons()
      .pipe(map((res: HttpResponse<ISeason[]>) => res.body ?? []))
      .pipe(map((seasons: ISeason[]) => this.gameManagementService.addSeasonToCollectionIfMissing<ISeason>(seasons, this.turn?.season)))
      .subscribe((seasons: ISeason[]) => (this.seasonsSharedCollection = seasons));
  }

  protected createFromForm(): ITurn {
    return {
      ...new Object(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      turnNumber: this.editForm.get(['turnNumber'])!.value,
      eliminationEnabled: this.editForm.get(['eliminationEnabled'])!.value,
      startDate: this.editForm.get(['startDate'])!.value,
      endDate: this.editForm.get(['endDate'])!.value,
      season: this.editForm.get(['season'])!.value,
    };
  }
}
