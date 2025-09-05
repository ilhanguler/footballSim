import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LeagueListComponent } from '../list/league-list.component';
import { LeagueDetailComponent } from '../detail/league-detail.component';
import { LeagueUpdateComponent } from '../update/league-update.component';
import { LeagueResolve } from './league-routing-resolve.service';

const leagueRoute: Routes = [
  {
    path: '',
    component: LeagueListComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LeagueDetailComponent,
    resolve: {
      league: LeagueResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LeagueUpdateComponent,
    resolve: {
      league: LeagueResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LeagueUpdateComponent,
    resolve: {
      league: LeagueResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default leagueRoute;
