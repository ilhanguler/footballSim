import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router, ResolveFn } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMatch } from '../match.model';
import { GameManagementService } from '../../game-management.service';

export const MatchResolve: ResolveFn<IMatch | null> = (route: ActivatedRouteSnapshot): Observable<IMatch | null> => {
  const id = route.params['id'];
  if (id) {
    const gameManagementService = inject(GameManagementService);
    const router = inject(Router);
    return gameManagementService.findMatch(id).pipe(
      mergeMap((match: HttpResponse<IMatch>) => {
        if (match.body) {
          return of(match.body);
        }

        router.navigate(['404']);
        return EMPTY;
      })
    );
  }
  return of(null);
};
