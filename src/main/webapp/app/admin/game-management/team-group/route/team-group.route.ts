import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TeamGroupListComponent } from '../list/team-group-list.component';
import { TeamGroupDetailComponent } from '../detail/team-group-detail.component';
import { TeamGroupUpdateComponent } from '../update/team-group-update.component';
import { TeamGroupResolve } from './team-group-routing-resolve.service';

const teamGroupRoute: Routes = [
  {
    path: '',
    component: TeamGroupListComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TeamGroupDetailComponent,
    resolve: {
      teamGroup: TeamGroupResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TeamGroupUpdateComponent,
    resolve: {
      teamGroup: TeamGroupResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TeamGroupUpdateComponent,
    resolve: {
      teamGroup: TeamGroupResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default teamGroupRoute;
