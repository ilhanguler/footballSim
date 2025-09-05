import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router, ResolveFn } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITeam } from '../team.model';
import { GameManagementService } from '../../game-management.service';

export const TeamResolve: ResolveFn<ITeam | null> = (route: ActivatedRouteSnapshot): Observable<ITeam | null> => {
  const id = route.params['id'];
  if (id) {
    const gameManagementService = inject(GameManagementService);
    const router = inject(Router);
    return gameManagementService.findTeam(id).pipe(
      mergeMap((team: HttpResponse<ITeam>) => {
        if (team.body) {
          return of(team.body);
        }

        router.navigate(['404']);
        return EMPTY;
      })
    );
  }
  return of(null);
};
