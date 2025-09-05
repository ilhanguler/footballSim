import {Routes} from '@angular/router';
import {SimulationComponent} from './simulation.component';
import {UserRouteAccessService} from "../../../../core/auth/user-route-access.service";

const simulationRoute: Routes = [
  {
    path: '',
    component: SimulationComponent,
    canActivate: [UserRouteAccessService],
  }
];

export default simulationRoute;
