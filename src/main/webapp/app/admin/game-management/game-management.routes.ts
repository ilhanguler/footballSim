import { Routes } from '@angular/router';

const gameManagementRoutes: Routes = [
  {
    path: 'league',
    data: { pageTitle: 'Leagues' },
    loadChildren: () => import('./league/route/league.route'),
  },
  {
    path: 'team',
    data: { pageTitle: 'Teams' },
    loadChildren: () => import('./team/route/team.route'),
  },
  {
    path: 'match',
    data: { pageTitle: 'Matches' },
    loadChildren: () => import('./match/route/match.route'),
  },
  {
    path: 'season',
    data: { pageTitle: 'Seasons' },
    loadChildren: () => import('./season/route/season.route'),
  },
  {
    path: 'turn',
    data: { pageTitle: 'Turns' },
    loadChildren: () => import('./turn/route/turn.route'),
  },
  {
    path: 'score',
    data: { pageTitle: 'Scores' },
    loadChildren: () => import('./score/route/score.route'),
  },
  {
    path: 'team-group',
    data: { pageTitle: 'TeamGroups' },
    loadChildren: () => import('./team-group/route/team-group.route'),
  },
  {
    path: 'simulation',
    data: { pageTitle: 'Simulation' },
    loadChildren: () => import('./sim/simulation/simulation.route'),
  },
];

export default gameManagementRoutes;
