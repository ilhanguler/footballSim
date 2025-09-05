import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ScoreListComponent } from '../list/score-list.component';
import { ScoreDetailComponent } from '../detail/score-detail.component';
import { ScoreUpdateComponent } from '../update/score-update.component';
import { ScoreResolve } from './score-routing-resolve.service';

const scoreRoute: Routes = [
  {
    path: '',
    component: ScoreListComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ScoreDetailComponent,
    resolve: {
      score: ScoreResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ScoreUpdateComponent,
    resolve: {
      score: ScoreResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ScoreUpdateComponent,
    resolve: {
      score: ScoreResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default scoreRoute;
