import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ISeason, NewSeason } from '../season.model';
import { GameManagementService } from '../../game-management.service';
import { ILeague } from 'app/admin/game-management/league/league.model';
import { ITeam } from 'app/admin/game-management/team/team.model';
import SharedModule from "../../../../shared/shared.module";

@Component({
  selector: 'jhi-season-update',
  templateUrl: './season-update.component.html',
  standalone: true,
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class SeasonUpdateComponent implements OnInit {
  isSaving = false;
  season: ISeason | null = null;

  // Comparators for Angular [compareWith] bindings
  compareLeague = (o1: Pick<ILeague, 'id'> | null, o2: Pick<ILeague, 'id'> | null): boolean =>
    this.gameManagementService.compareLeague(o1, o2);

  compareTeam = (o1: Pick<ITeam, 'id'> | null, o2: Pick<ITeam, 'id'> | null): boolean =>
    this.gameManagementService.compareTeam(o1, o2);

  leaguesSharedCollection: ILeague[] = [];
  teamsSharedCollection: ITeam[] = [];

  editForm = this.fb.group({
    id: [null as number | null],
    name: [null as string | null],
    startDate: [null as import('dayjs/esm').Dayjs | null],
    endDate: [null as import('dayjs/esm').Dayjs | null],
    currentTurn: [null as number | null],
    league: [null as (Pick<ILeague, 'id'> | ILeague | null)],
    teams: [[] as (Pick<ITeam, 'id'> | null)[] ],
  });

  constructor(
    protected gameManagementService: GameManagementService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ season }) => {
      this.season = season;
      if (season) {
        this.updateForm(season);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const season = this.createFromForm();
    if (season.id !== null) {
      this.subscribeToSaveResponse(this.gameManagementService.updateSeason(season));
    } else {
      this.subscribeToSaveResponse(this.gameManagementService.createSeason(season as unknown as NewSeason));
    }
  }

  trackLeagueById(index: number, item: ILeague): number {
    return item.id;
  }

  trackTeamById(index: number, item: ITeam): number {
    return item.id;
  }

  getSelectedTeam(option: ITeam, selectedVals?: ((ITeam | Pick<ITeam, 'id'> | null)[]) | null): ITeam {
    if (selectedVals && selectedVals.length) {
      for (const selectedVal of selectedVals) {
        if (selectedVal && option.id === selectedVal.id) {
          return selectedVal as ITeam;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISeason>>): void {
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

  protected updateForm(season: ISeason): void {
    this.editForm.patchValue({
      id: season.id,
      name: season.name,
      startDate: season.startDate,
      endDate: season.endDate,
      currentTurn: season.currentTurn,
      league: season.league,
      teams: season.teams,
    });

    this.leaguesSharedCollection = this.gameManagementService.addLeagueToCollectionIfMissing<ILeague>(this.leaguesSharedCollection, season.league);
    this.teamsSharedCollection = this.gameManagementService.addTeamToCollectionIfMissing<ITeam>(this.teamsSharedCollection, ...(season.teams ?? []));
  }

  protected loadRelationshipsOptions(): void {
    this.gameManagementService
      .queryLeagues()
      .pipe(map((res: HttpResponse<ILeague[]>) => res.body ?? []))
      .pipe(map((leagues: ILeague[]) => this.gameManagementService.addLeagueToCollectionIfMissing<ILeague>(leagues, this.season?.league)))
      .subscribe((leagues: ILeague[]) => (this.leaguesSharedCollection = leagues));

    this.gameManagementService
      .queryTeams()
      .pipe(map((res: HttpResponse<ITeam[]>) => res.body ?? []))
      .pipe(map((teams: ITeam[]) => this.gameManagementService.addTeamToCollectionIfMissing<ITeam>(teams, ...(this.season?.teams ?? []))))
      .subscribe((teams: ITeam[]) => (this.teamsSharedCollection = teams));
  }

  protected createFromForm(): ISeason {
    return {
      ...{},
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      startDate: this.editForm.get(['startDate'])!.value,
      endDate: this.editForm.get(['endDate'])!.value,
      currentTurn: this.editForm.get(['currentTurn'])!.value,
      league: this.editForm.get(['league'])!.value,
      teams: this.editForm.get(['teams'])!.value,
    };
  }
}
