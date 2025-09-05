import { ITeam } from 'app/admin/game-management/team/team.model';

export interface ITeamStats {
  id: number;
  skill?: number | null;
  morale?: number | null;
  team?: ITeam | null;
}
