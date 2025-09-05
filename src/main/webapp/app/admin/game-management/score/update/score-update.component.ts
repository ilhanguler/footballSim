import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IScore, NewScore } from '../score.model';
import { GameManagementService } from '../../game-management.service';
import { ISeason } from 'app/admin/game-management/season/season.model';
import { ITeam } from 'app/admin/game-management/team/team.model';
import SharedModule from 'app/shared/shared.module';

@Component({
  selector: 'jhi-score-update',
  templateUrl: './score-update.component.html',
  standalone: true,
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ScoreUpdateComponent implements OnInit {
  isSaving = false;
  score: IScore | null = null;

  seasonsSharedCollection: ISeason[] = [];
  teamsSharedCollection: ITeam[] = [];

  editForm = this.fb.group({
    id: [null as number | null],
    points: [null as number | null],
    wins: [null as number | null],
    losses: [null as number | null],
    draws: [null as number | null],
    goalsFor: [null as number | null],
    goalsAgainst: [null as number | null],
    goalDifference: [null as number | null],
    season: [null as (Pick<ISeason, 'id'> | ISeason | null)],
    team: [null as (Pick<ITeam, 'id'> | ITeam | null)],
  });

  constructor(
    protected gameManagementService: GameManagementService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ score }) => {
      this.score = score;
      if (score) {
        this.updateForm(score);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const score = this.createFromForm();
    if (score.id !== null) {
      this.subscribeToSaveResponse(this.gameManagementService.updateScore(score));
    } else {
      this.subscribeToSaveResponse(this.gameManagementService.createScore(score as unknown as NewScore));
    }
  }

  compareSeason = (o1: Pick<ISeason, 'id'> | null, o2: Pick<ISeason, 'id'> | null): boolean =>
    this.gameManagementService.compareSeason(o1, o2);

  compareTeam = (o1: Pick<ITeam, 'id'> | null, o2: Pick<ITeam, 'id'> | null): boolean =>
    this.gameManagementService.compareTeam(o1, o2);

  trackSeasonById(index: number, item: ISeason): number {
    return item.id;
  }

  trackTeamById(index: number, item: ITeam): number {
    return item.id;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IScore>>): void {
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

  protected updateForm(score: IScore): void {
    this.editForm.patchValue({
      id: score.id,
      points: score.points,
      wins: score.wins,
      losses: score.losses,
      draws: score.draws,
      goalsFor: score.goalsFor,
      goalsAgainst: score.goalsAgainst,
      goalDifference: score.goalDifference,
      season: score.season,
      team: score.team,
    });

    this.seasonsSharedCollection = this.gameManagementService.addSeasonToCollectionIfMissing<ISeason>(
      this.seasonsSharedCollection,
      score.season
    );
    this.teamsSharedCollection = this.gameManagementService.addTeamToCollectionIfMissing<ITeam>(this.teamsSharedCollection, score.team);
  }

  protected loadRelationshipsOptions(): void {
    this.gameManagementService
      .querySeasons()
      .pipe(map((res: HttpResponse<ISeason[]>) => res.body ?? []))
      .pipe(map((seasons: ISeason[]) => this.gameManagementService.addSeasonToCollectionIfMissing<ISeason>(seasons, this.score?.season)))
      .subscribe((seasons: ISeason[]) => (this.seasonsSharedCollection = seasons));

    this.gameManagementService
      .queryTeams()
      .pipe(map((res: HttpResponse<ITeam[]>) => res.body ?? []))
      .pipe(map((teams: ITeam[]) => this.gameManagementService.addTeamToCollectionIfMissing<ITeam>(teams, this.score?.team)))
      .subscribe((teams: ITeam[]) => (this.teamsSharedCollection = teams));
  }

  protected createFromForm(): IScore {
    return {
      ...new Object(),
      id: this.editForm.get(['id'])!.value,
      points: this.editForm.get(['points'])!.value,
      wins: this.editForm.get(['wins'])!.value,
      losses: this.editForm.get(['losses'])!.value,
      draws: this.editForm.get(['draws'])!.value,
      goalsFor: this.editForm.get(['goalsFor'])!.value,
      goalsAgainst: this.editForm.get(['goalsAgainst'])!.value,
      goalDifference: this.editForm.get(['goalDifference'])!.value,
      season: this.editForm.get(['season'])!.value,
      team: this.editForm.get(['team'])!.value,
    };
  }
}
