import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SeasonListComponent } from '../list/season-list.component';
import { SeasonDetailComponent } from '../detail/season-detail.component';
import { SeasonUpdateComponent } from '../update/season-update.component';
import { SeasonResolve } from './season-routing-resolve.service';

const seasonRoute: Routes = [
  {
    path: '',
    component: SeasonListComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SeasonDetailComponent,
    resolve: {
      season: SeasonResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SeasonUpdateComponent,
    resolve: {
      season: SeasonResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SeasonUpdateComponent,
    resolve: {
      season: SeasonResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default seasonRoute;
