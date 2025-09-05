import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router, ResolveFn } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITurn } from '../turn.model';
import { GameManagementService } from '../../game-management.service';

export const TurnResolve: ResolveFn<ITurn | null> = (route: ActivatedRouteSnapshot): Observable<ITurn | null> => {
  const id = route.params['id'];
  if (id) {
    const gameManagementService = inject(GameManagementService);
    const router = inject(Router);
    return gameManagementService.findTurn(id).pipe(
      mergeMap((turn: HttpResponse<ITurn>) => {
        if (turn.body) {
          return of(turn.body);
        }

        router.navigate(['404']);
        return EMPTY;
      })
    );
  }
  return of(null);
};
