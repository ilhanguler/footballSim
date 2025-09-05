import { Dayjs } from 'dayjs/esm';
import { ISeason } from 'app/admin/game-management/season/season.model';

export interface ITurn {
  id: number;
  name?: string | null;
  turnNumber?: number | null;
  eliminationEnabled?: boolean | null;
  startDate?: Dayjs | null;
  endDate?: Dayjs | null;
  season?: Pick<ISeason, 'id' | 'name'> | null;
}

export type NewTurn = Omit<ITurn, 'id'> & { id: null };

export type RestTurn = Omit<ITurn, 'startDate' | 'endDate'> & {
  startDate?: string | null;
  endDate?: string | null;
};
