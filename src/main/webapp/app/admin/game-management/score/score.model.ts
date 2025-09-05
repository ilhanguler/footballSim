import { ISeason } from 'app/admin/game-management/season/season.model';
import { ITeam } from 'app/admin/game-management/team/team.model';

export interface IScore {
  id: number;
  points?: number | null;
  wins?: number | null;
  losses?: number | null;
  draws?: number | null;
  goalsFor?: number | null;
  goalsAgainst?: number | null;
  goalDifference?: number | null;
  season?: Pick<ISeason, 'id' | 'name'> | null;
  team?: Pick<ITeam, 'id' | 'name'> | null;
}

export type NewScore = Omit<IScore, 'id'> & { id: null };
