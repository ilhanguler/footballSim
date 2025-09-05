import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MatchListComponent } from '../list/match-list.component';
import { MatchDetailComponent } from '../detail/match-detail.component';
import { MatchUpdateComponent } from '../update/match-update.component';
import { MatchResolve } from './match-routing-resolve.service';

const matchRoute: Routes = [
  {
    path: '',
    component: MatchListComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MatchDetailComponent,
    resolve: {
      match: MatchResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MatchUpdateComponent,
    resolve: {
      match: MatchResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MatchUpdateComponent,
    resolve: {
      match: MatchResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default matchRoute;
