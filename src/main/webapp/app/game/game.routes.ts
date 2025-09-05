import { Routes } from '@angular/router';
import { LeagueListComponent } from './league-list/league-list.component';
import { LeagueComponent } from './league/league.component';
import { SeasonComponent } from './season/season.component';
import { MatchComponent } from './match/match.component';
import { TeamComponent } from './team/team.component';

const gameRoutes: Routes = [
  {
    path: 'leagues',
    component: LeagueListComponent,
    data: {
      pageTitle: 'Leagues',
    },
  },
  {
    path: 'league/:leagueId',
    component: LeagueComponent,
    data: {
      pageTitle: 'League',
    },
  },
  {
    path: 'season/:seasonId',
    component: SeasonComponent,
    data: {
      pageTitle: 'Season',
    },
  },
  {
    path: 'match/:matchId',
    component: MatchComponent,
    data: {
      pageTitle: 'Match',
    },
  },
  {
    path: 'team/:teamId',
    component: TeamComponent,
    data: {
      pageTitle: 'Team',
    },
  },
  {
    path: '',
    redirectTo: 'leagues',
    pathMatch: 'full',
  }
];

export default gameRoutes;
