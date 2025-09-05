import { ITurn } from 'app/admin/game-management/turn/turn.model';
import { ITeam } from 'app/admin/game-management/team/team.model';

export interface ITeamGroup {
  id: number;
  name?: string | null;
  turn?: Pick<ITurn, 'id' | 'name'> | null;
  teams?: Pick<ITeam, 'id' | 'name'>[] | null;
}

export type NewTeamGroup = Omit<ITeamGroup, 'id'> & { id: null };
