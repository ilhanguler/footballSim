import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IMatch, NewMatch } from '../match.model';
import { GameManagementService } from '../../game-management.service';
import { ITeam } from 'app/admin/game-management/team/team.model';
import { ITurn } from 'app/admin/game-management/turn/turn.model';
import SharedModule from 'app/shared/shared.module';

@Component({
  selector: 'jhi-match-update',
  templateUrl: './match-update.component.html',
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule, FormsModule],
})
export class MatchUpdateComponent implements OnInit {
  isSaving = false;
  match: IMatch | null = null;

  teamsSharedCollection: ITeam[] = [];
  turnsSharedCollection: ITurn[] = [];

  editForm = this.fb.group({
    id: [null as number | null],
    homeGoals: [null as number | null],
    awayGoals: [null as number | null],
    status: [null as string | null],
    matchDate: [null as import('dayjs/esm').Dayjs | null],
    homeTeam: [null as (Pick<ITeam, 'id'> | ITeam | null)],
    awayTeam: [null as (Pick<ITeam, 'id'> | ITeam | null)],
    turn: [null as (Pick<ITurn, 'id'> | ITurn | null)],
  });

  constructor(
    protected gameManagementService: GameManagementService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ match }) => {
      this.match = match;
      if (match) {
        this.updateForm(match);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const match = this.createFromForm();
    if (match.id !== null) {
      this.subscribeToSaveResponse(this.gameManagementService.updateMatch(match));
    } else {
      this.subscribeToSaveResponse(this.gameManagementService.createMatch(match as unknown as NewMatch));
    }
  }

  // Comparators for Angular [compareWith] bindings
  compareTeam = (o1: Pick<ITeam, 'id'> | null, o2: Pick<ITeam, 'id'> | null): boolean =>
    this.gameManagementService.compareTeam(o1, o2);

  compareTurn = (o1: Pick<ITurn, 'id'> | null, o2: Pick<ITurn, 'id'> | null): boolean =>
    this.gameManagementService.compareTurn(o1, o2);

  trackTeamById(index: number, item: ITeam): number {
    return item.id;
  }

  trackTurnById(index: number, item: ITurn): number {
    return item.id;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMatch>>): void {
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

  protected updateForm(match: IMatch): void {
    this.editForm.patchValue({
      id: match.id,
      homeGoals: match.homeGoals,
      awayGoals: match.awayGoals,
      status: match.status,
      matchDate: match.matchDate,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      turn: match.turn,
    });

    this.teamsSharedCollection = this.gameManagementService.addTeamToCollectionIfMissing<ITeam>(
      this.teamsSharedCollection,
      match.homeTeam,
      match.awayTeam
    );
    this.turnsSharedCollection = this.gameManagementService.addTurnToCollectionIfMissing<ITurn>(this.turnsSharedCollection, match.turn);
  }

  protected loadRelationshipsOptions(): void {
    this.gameManagementService
      .queryTeams()
      .pipe(map((res: HttpResponse<ITeam[]>) => res.body ?? []))
      .pipe(map((teams: ITeam[]) => this.gameManagementService.addTeamToCollectionIfMissing<ITeam>(teams, this.match?.homeTeam, this.match?.awayTeam)))
      .subscribe((teams: ITeam[]) => (this.teamsSharedCollection = teams));

    this.gameManagementService
      .queryTurns()
      .pipe(map((res: HttpResponse<ITurn[]>) => res.body ?? []))
      .pipe(map((turns: ITurn[]) => this.gameManagementService.addTurnToCollectionIfMissing<ITurn>(turns, this.match?.turn)))
      .subscribe((turns: ITurn[]) => (this.turnsSharedCollection = turns));
  }

  protected createFromForm(): IMatch {
    return {
      ...new Object(),
      id: this.editForm.get(['id'])!.value,
      homeGoals: this.editForm.get(['homeGoals'])!.value,
      awayGoals: this.editForm.get(['awayGoals'])!.value,
      status: this.editForm.get(['status'])!.value,
      matchDate: this.editForm.get(['matchDate'])!.value,
      homeTeam: this.editForm.get(['homeTeam'])!.value,
      awayTeam: this.editForm.get(['awayTeam'])!.value,
      turn: this.editForm.get(['turn'])!.value,
    };
  }
}
