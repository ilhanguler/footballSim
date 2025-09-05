import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TeamListComponent } from '../list/team-list.component';
import { TeamDetailComponent } from '../detail/team-detail.component';
import { TeamUpdateComponent } from '../update/team-update.component';
import { TeamResolve } from './team-routing-resolve.service';

const teamRoute: Routes = [
  {
    path: '',
    component: TeamListComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TeamDetailComponent,
    resolve: {
      team: TeamResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TeamUpdateComponent,
    resolve: {
      team: TeamResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TeamUpdateComponent,
    resolve: {
      team: TeamResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default teamRoute;
