import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router, ResolveFn } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISeason } from '../season.model';
import { GameManagementService } from '../../game-management.service';

export const SeasonResolve: ResolveFn<ISeason | null> = (route: ActivatedRouteSnapshot): Observable<ISeason | null> => {
  const id = route.params['id'];
  if (id) {
    const gameManagementService = inject(GameManagementService);
    const router = inject(Router);
    return gameManagementService.findSeason(id).pipe(
      mergeMap((season: HttpResponse<ISeason>) => {
        if (season.body) {
          return of(season.body);
        }

        router.navigate(['404']);
        return EMPTY;
      })
    );
  }
  return of(null);
};
