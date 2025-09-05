import { ILeague } from 'app/admin/game-management/league/league.model';
import { ITeam } from 'app/admin/game-management/team/team.model';
import { IScore } from 'app/admin/game-management/score/score.model';
import { Dayjs } from 'dayjs/esm';

export interface ISeason {
  id: number;
  name?: string | null;
  startDate?: Dayjs | null;
  endDate?: Dayjs | null;
  currentTurn?: number | null;
  league?: Pick<ILeague, 'id' | 'name'> | null;
  teams?: Pick<ITeam, 'id' | 'name'>[] | null;
  scores?: Pick<IScore, 'id'>[] | null;
}

export type NewSeason = Omit<ISeason, 'id'> & { id: null };

export type RestSeason = Omit<ISeason, 'startDate' | 'endDate'> & {
  startDate?: string | null;
  endDate?: string | null;
};
