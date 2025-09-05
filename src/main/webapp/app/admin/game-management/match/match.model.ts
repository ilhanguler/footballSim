import { ITeam } from 'app/admin/game-management/team/team.model';
import { ITurn } from 'app/admin/game-management/turn/turn.model';
import { Dayjs } from 'dayjs/esm';

export interface IMatch {
  id: number;
  homeGoals?: number | null;
  awayGoals?: number | null;
  status?: string | null;
  matchDate?: Dayjs | null;
  homeTeam?: Pick<ITeam, 'id' | 'name'> | null;
  awayTeam?: Pick<ITeam, 'id' | 'name'> | null;
  turn?: Pick<ITurn, 'id' | 'name'> | null;
}

export type NewMatch = Omit<IMatch, 'id'> & { id: null };

export type RestMatch = Omit<IMatch, 'matchDate'> & {
  matchDate?: string | null;
};
