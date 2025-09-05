import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ITeamGroup, NewTeamGroup } from '../team-group.model';
import { GameManagementService } from '../../game-management.service';
import { ITurn } from 'app/admin/game-management/turn/turn.model';
import { ITeam } from 'app/admin/game-management/team/team.model';
import SharedModule from 'app/shared/shared.module';

@Component({
  selector: 'jhi-team-group-update',
  templateUrl: './team-group-update.component.html',
  standalone: true,
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class TeamGroupUpdateComponent implements OnInit {
  isSaving = false;
  teamGroup: ITeamGroup | null = null;

  // Comparators for Angular [compareWith] bindings
  compareTurn = (o1: Pick<ITurn, 'id'> | null, o2: Pick<ITurn, 'id'> | null): boolean =>
    this.gameManagementService.compareTurn(o1, o2);

  compareTeam = (o1: Pick<ITeam, 'id'> | null, o2: Pick<ITeam, 'id'> | null): boolean =>
    this.gameManagementService.compareTeam(o1, o2);

  turnsSharedCollection: ITurn[] = [];
  teamsSharedCollection: ITeam[] = [];

  editForm = this.fb.group({
    id: [null as number | null],
    name: [null as string | null],
    turn: [null as (Pick<ITurn, 'id'> | null)],
    teams: [[] as (Pick<ITeam, 'id'>)[]],
  });

  constructor(
    protected gameManagementService: GameManagementService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ teamGroup }) => {
      this.teamGroup = teamGroup;
      if (teamGroup) {
        this.updateForm(teamGroup);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const teamGroup = this.createFromForm();
    if (teamGroup.id !== null) {
      this.subscribeToSaveResponse(this.gameManagementService.updateTeamGroup(teamGroup));
    } else {
      this.subscribeToSaveResponse(this.gameManagementService.createTeamGroup(teamGroup as unknown as NewTeamGroup));
    }
  }

  trackTurnById(index: number, item: ITurn): number {
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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITeamGroup>>): void {
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

  protected updateForm(teamGroup: ITeamGroup): void {
    this.editForm.patchValue({
      id: teamGroup.id,
      name: teamGroup.name,
      turn: teamGroup.turn,
      teams: teamGroup.teams,
    });

    this.turnsSharedCollection = this.gameManagementService.addTurnToCollectionIfMissing<ITurn>(this.turnsSharedCollection, teamGroup.turn);
    this.teamsSharedCollection = this.gameManagementService.addTeamToCollectionIfMissing<ITeam>(this.teamsSharedCollection, ...(teamGroup.teams ?? []));
  }

  protected loadRelationshipsOptions(): void {
    this.gameManagementService
      .queryTurns()
      .pipe(map((res: HttpResponse<ITurn[]>) => res.body ?? []))
      .pipe(map((turns: ITurn[]) => this.gameManagementService.addTurnToCollectionIfMissing<ITurn>(turns, this.teamGroup?.turn)))
      .subscribe((turns: ITurn[]) => (this.turnsSharedCollection = turns));

    this.gameManagementService
      .queryTeams()
      .pipe(map((res: HttpResponse<ITeam[]>) => res.body ?? []))
      .pipe(map((teams: ITeam[]) => this.gameManagementService.addTeamToCollectionIfMissing<ITeam>(teams, ...(this.teamGroup?.teams ?? []))))
      .subscribe((teams: ITeam[]) => (this.teamsSharedCollection = teams));
  }

  protected createFromForm(): ITeamGroup {
    return {
      ...new Object(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      turn: this.editForm.get(['turn'])!.value,
      teams: this.editForm.get(['teams'])!.value,
    };
  }
}
