import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TurnListComponent } from '../list/turn-list.component';
import { TurnDetailComponent } from '../detail/turn-detail.component';
import { TurnUpdateComponent } from '../update/turn-update.component';
import { TurnResolve } from './turn-routing-resolve.service';

const turnRoute: Routes = [
  {
    path: '',
    component: TurnListComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TurnDetailComponent,
    resolve: {
      turn: TurnResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TurnUpdateComponent,
    resolve: {
      turn: TurnResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TurnUpdateComponent,
    resolve: {
      turn: TurnResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default turnRoute;
