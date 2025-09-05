import { ITeamStats } from 'app/admin/game-management/sim/team-stats/team-stats.model';
import { IMatch } from 'app/admin/game-management/match/match.model';

export interface IMoraleChangelog {
  id: number;
  moraleChange?: number | null;
  moraleBefore?: number | null;
  teamStats?: ITeamStats | null;
  match?: IMatch | null;
}
