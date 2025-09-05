import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router, ResolveFn } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IScore } from '../score.model';
import { GameManagementService } from '../../game-management.service';

export const ScoreResolve: ResolveFn<IScore | null> = (route: ActivatedRouteSnapshot): Observable<IScore | null> => {
  const id = route.params['id'];
  if (id) {
    const gameManagementService = inject(GameManagementService);
    const router = inject(Router);
    return gameManagementService.findScore(id).pipe(
      mergeMap((score: HttpResponse<IScore>) => {
        if (score.body) {
          return of(score.body);
        }

        router.navigate(['404']);
        return EMPTY;
      })
    );
  }
  return of(null);
};
