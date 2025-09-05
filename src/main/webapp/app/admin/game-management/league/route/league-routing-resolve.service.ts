import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router, ResolveFn } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILeague } from '../league.model';
import { GameManagementService } from '../../game-management.service';

export const LeagueResolve: ResolveFn<ILeague | null> = (route: ActivatedRouteSnapshot): Observable<ILeague | null> => {
  const id = route.params['id'];
  if (id) {
    const gameManagementService = inject(GameManagementService);
    const router = inject(Router);
    return gameManagementService.findLeague(id).pipe(
      mergeMap((league: HttpResponse<ILeague>) => {
        if (league.body) {
          return of(league.body);
        }

        router.navigate(['404']);
        return EMPTY;
      })
    );
  }
  return of(null);
};
