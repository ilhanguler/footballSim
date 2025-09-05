import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router, ResolveFn } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITeamGroup } from '../team-group.model';
import { GameManagementService } from '../../game-management.service';

export const TeamGroupResolve: ResolveFn<ITeamGroup | null> = (route: ActivatedRouteSnapshot): Observable<ITeamGroup | null> => {
  const id = route.params['id'];
  if (id) {
    const gameManagementService = inject(GameManagementService);
    const router = inject(Router);
    return gameManagementService.findTeamGroup(id).pipe(
      mergeMap((teamGroup: HttpResponse<ITeamGroup>) => {
        if (teamGroup.body) {
          return of(teamGroup.body);
        }

        router.navigate(['404']);
        return EMPTY;
      })
    );
  }
  return of(null);
};
