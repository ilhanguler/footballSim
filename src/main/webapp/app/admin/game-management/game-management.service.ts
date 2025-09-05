import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';

import { ILeague, NewLeague } from './league/league.model';
import { ISeason, NewSeason, RestSeason } from './season/season.model';
import { ITurn, NewTurn, RestTurn } from './turn/turn.model';
import { ITeam, NewTeam } from './team/team.model';
import { ITeamGroup, NewTeamGroup } from './team-group/team-group.model';
import { IScore, NewScore } from './score/score.model';
import { IMatch, NewMatch, RestMatch } from './match/match.model';

export type EntityResponseType<T> = HttpResponse<T>;
export type EntityArrayResponseType<T> = HttpResponse<T[]>;

@Injectable({ providedIn: 'root' })
export class GameManagementService {
  protected leaguesUrl = this.applicationConfigService.getEndpointFor('api/admin/game/leagues');
  protected seasonsUrl = this.applicationConfigService.getEndpointFor('api/admin/game/seasons');
  protected turnsUrl = this.applicationConfigService.getEndpointFor('api/admin/game/turns');
  protected teamsUrl = this.applicationConfigService.getEndpointFor('api/admin/game/teams');
  protected teamGroupsUrl = this.applicationConfigService.getEndpointFor('api/admin/game/team-groups');
  protected scoresUrl = this.applicationConfigService.getEndpointFor('api/admin/game/scores');
  protected matchesUrl = this.applicationConfigService.getEndpointFor('api/admin/game/matches');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  // League Methods
  createLeague(league: NewLeague): Observable<EntityResponseType<ILeague>> {
    return this.http.post<ILeague>(this.leaguesUrl, league, { observe: 'response' });
  }

  updateLeague(league: ILeague): Observable<EntityResponseType<ILeague>> {
    return this.http.put<ILeague>(`${this.leaguesUrl}/${league.id}`, league, { observe: 'response' });
  }

  findLeague(id: number): Observable<EntityResponseType<ILeague>> {
    return this.http.get<ILeague>(`${this.leaguesUrl}/${id}`, { observe: 'response' });
  }

  queryLeagues(req?: any): Observable<EntityArrayResponseType<ILeague>> {
    const options = createRequestOption(req);
    return this.http.get<ILeague[]>(this.leaguesUrl, { params: options, observe: 'response' });
  }

  deleteLeague(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.leaguesUrl}/${id}`, { observe: 'response' });
  }

  // Season Methods
  createSeason(season: NewSeason): Observable<EntityResponseType<ISeason>> {
    const copy = this.convertSeasonDateFromClient(season);
    return this.http
      .post<RestSeason>(this.seasonsUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertSeasonResponseFromServer(res)));
  }

  updateSeason(season: ISeason): Observable<EntityResponseType<ISeason>> {
    const copy = this.convertSeasonDateFromClient(season);
    return this.http
      .put<RestSeason>(`${this.seasonsUrl}/${season.id}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertSeasonResponseFromServer(res)));
  }

  findSeason(id: number): Observable<EntityResponseType<ISeason>> {
    return this.http
      .get<RestSeason>(`${this.seasonsUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertSeasonResponseFromServer(res)));
  }

  querySeasons(req?: any): Observable<EntityArrayResponseType<ISeason>> {
    const options = createRequestOption(req);
    return this.http
      .get<RestSeason[]>(this.seasonsUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertSeasonResponseArrayFromServer(res)));
  }

  querySeasonsByLeague(leagueId: number): Observable<HttpResponse<ISeason[]>> {
    return this.http
      .get<RestSeason[]>(`${this.leaguesUrl}/${leagueId}/seasons`, { observe: 'response' })
      .pipe(map(res => this.convertSeasonResponseArrayFromServer(res)));
  }

  deleteSeason(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.seasonsUrl}/${id}`, { observe: 'response' });
  }

  // Turn Methods
  createTurn(turn: NewTurn): Observable<EntityResponseType<ITurn>> {
    const copy = this.convertTurnDateFromClient(turn);
    return this.http.post<RestTurn>(this.turnsUrl, copy, { observe: 'response' }).pipe(map(res => this.convertTurnResponseFromServer(res)));
  }

  updateTurn(turn: ITurn): Observable<EntityResponseType<ITurn>> {
    const copy = this.convertTurnDateFromClient(turn);
    return this.http
      .put<RestTurn>(`${this.turnsUrl}/${turn.id}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertTurnResponseFromServer(res)));
  }

  findTurn(id: number): Observable<EntityResponseType<ITurn>> {
    return this.http.get<RestTurn>(`${this.turnsUrl}/${id}`, { observe: 'response' }).pipe(map(res => this.convertTurnResponseFromServer(res)));
  }

  queryTurns(req?: any): Observable<EntityArrayResponseType<ITurn>> {
    const options = createRequestOption(req);
    return this.http
      .get<RestTurn[]>(this.turnsUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertTurnResponseArrayFromServer(res)));
  }

  queryTurnsBySeason(seasonId: number): Observable<HttpResponse<ITurn[]>> {
    return this.http
      .get<RestTurn[]>(`${this.seasonsUrl}/${seasonId}/turns`, { observe: 'response' })
      .pipe(map(res => this.convertTurnResponseArrayFromServer(res)));
  }


  deleteTurn(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.turnsUrl}/${id}`, { observe: 'response' });
  }

  // Team Methods
  createTeam(team: NewTeam): Observable<EntityResponseType<ITeam>> {
    return this.http.post<ITeam>(this.teamsUrl, team, { observe: 'response' });
  }

  updateTeam(team: ITeam): Observable<EntityResponseType<ITeam>> {
    return this.http.put<ITeam>(`${this.teamsUrl}/${team.id}`, team, { observe: 'response' });
  }

  findTeam(id: number): Observable<EntityResponseType<ITeam>> {
    return this.http.get<ITeam>(`${this.teamsUrl}/${id}`, { observe: 'response' });
  }

  queryTeams(req?: any): Observable<EntityArrayResponseType<ITeam>> {
    const options = createRequestOption(req);
    return this.http.get<ITeam[]>(this.teamsUrl, { params: options, observe: 'response' });
  }

  deleteTeam(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.teamsUrl}/${id}`, { observe: 'response' });
  }

  // TeamGroup Methods
  createTeamGroup(teamGroup: NewTeamGroup): Observable<EntityResponseType<ITeamGroup>> {
    return this.http.post<ITeamGroup>(this.teamGroupsUrl, teamGroup, { observe: 'response' });
  }

  updateTeamGroup(teamGroup: ITeamGroup): Observable<EntityResponseType<ITeamGroup>> {
    return this.http.put<ITeamGroup>(`${this.teamGroupsUrl}/${teamGroup.id}`, teamGroup, { observe: 'response' });
  }

  findTeamGroup(id: number): Observable<EntityResponseType<ITeamGroup>> {
    return this.http.get<ITeamGroup>(`${this.teamGroupsUrl}/${id}`, { observe: 'response' });
  }

  queryTeamGroups(req?: any): Observable<EntityArrayResponseType<ITeamGroup>> {
    const options = createRequestOption(req);
    return this.http.get<ITeamGroup[]>(this.teamGroupsUrl, { params: options, observe: 'response' });
  }

  deleteTeamGroup(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.teamGroupsUrl}/${id}`, { observe: 'response' });
  }

  // Score Methods
  createScore(score: NewScore): Observable<EntityResponseType<IScore>> {
    return this.http.post<IScore>(this.scoresUrl, score, { observe: 'response' });
  }

  updateScore(score: IScore): Observable<EntityResponseType<IScore>> {
    return this.http.put<IScore>(`${this.scoresUrl}/${score.id}`, score, { observe: 'response' });
  }

  findScore(id: number): Observable<EntityResponseType<IScore>> {
    return this.http.get<IScore>(`${this.scoresUrl}/${id}`, { observe: 'response' });
  }

  queryScores(req?: any): Observable<EntityArrayResponseType<IScore>> {
    const options = createRequestOption(req);
    return this.http.get<IScore[]>(this.scoresUrl, { params: options, observe: 'response' });
  }

  deleteScore(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.scoresUrl}/${id}`, { observe: 'response' });
  }

  // Match Methods
  createMatch(match: NewMatch): Observable<EntityResponseType<IMatch>> {
    const copy = this.convertMatchDateFromClient(match);
    return this.http.post<RestMatch>(this.matchesUrl, copy, { observe: 'response' }).pipe(map(res => this.convertMatchResponseFromServer(res)));
  }

  updateMatch(match: IMatch): Observable<EntityResponseType<IMatch>> {
    const copy = this.convertMatchDateFromClient(match);
    return this.http
      .put<RestMatch>(`${this.matchesUrl}/${match.id}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertMatchResponseFromServer(res)));
  }

  findMatch(id: number): Observable<EntityResponseType<IMatch>> {
    return this.http.get<RestMatch>(`${this.matchesUrl}/${id}`, { observe: 'response' }).pipe(map(res => this.convertMatchResponseFromServer(res)));
  }

  queryMatches(req?: any): Observable<EntityArrayResponseType<IMatch>> {
    const options = createRequestOption(req);
    return this.http
      .get<RestMatch[]>(this.matchesUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertMatchResponseArrayFromServer(res)));
  }

  deleteMatch(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.matchesUrl}/${id}`, { observe: 'response' });
  }

  // Utility Methods
  compareLeague(o1: Pick<ILeague, 'id'> | null, o2: Pick<ILeague, 'id'> | null): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  compareSeason(o1: Pick<ISeason, 'id'> | null, o2: Pick<ISeason, 'id'> | null): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  compareTurn(o1: Pick<ITurn, 'id'> | null, o2: Pick<ITurn, 'id'> | null): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  compareTeam(o1: Pick<ITeam, 'id'> | null, o2: Pick<ITeam, 'id'> | null): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  compareTeamGroup(o1: Pick<ITeamGroup, 'id'> | null, o2: Pick<ITeamGroup, 'id'> | null): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  compareScore(o1: Pick<IScore, 'id'> | null, o2: Pick<IScore, 'id'> | null): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  compareMatch(o1: Pick<IMatch, 'id'> | null, o2: Pick<IMatch, 'id'> | null): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  // Collection Add Helpers
  addTeamToCollectionIfMissing<Type extends Pick<ITeam, 'id'>>(
    teamCollection: Type[],
    ...teamsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const teams: Type[] = teamsToCheck.filter(isPresent);
    if (teams.length > 0) {
      const teamCollectionIdentifiers = teamCollection.map(teamItem => teamItem.id);
      const teamsToAdd = teams.filter(teamItem => {
        const teamIdentifier = teamItem.id;
        if (teamCollectionIdentifiers.includes(teamIdentifier)) {
          return false;
        }
        teamCollectionIdentifiers.push(teamIdentifier);
        return true;
      });
      return [...teamsToAdd, ...teamCollection];
    }
    return teamCollection;
  }

  addLeagueToCollectionIfMissing<Type extends Pick<ILeague, 'id'>>(
    leagueCollection: Type[],
    ...leaguesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const leagues: Type[] = leaguesToCheck.filter(isPresent);
    if (leagues.length > 0) {
      const leagueCollectionIdentifiers = leagueCollection.map(leagueItem => leagueItem.id);
      const leaguesToAdd = leagues.filter(leagueItem => {
        const leagueIdentifier = leagueItem.id;
        if (leagueCollectionIdentifiers.includes(leagueIdentifier)) {
          return false;
        }
        leagueCollectionIdentifiers.push(leagueIdentifier);
        return true;
      });
      return [...leaguesToAdd, ...leagueCollection];
    }
    return leagueCollection;
  }

  addSeasonToCollectionIfMissing<Type extends Pick<ISeason, 'id'>>(
    seasonCollection: Type[],
    ...seasonsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const seasons: Type[] = seasonsToCheck.filter(isPresent);
    if (seasons.length > 0) {
      const seasonCollectionIdentifiers = seasonCollection.map(seasonItem => seasonItem.id);
      const seasonsToAdd = seasons.filter(seasonItem => {
        const seasonIdentifier = seasonItem.id;
        if (seasonCollectionIdentifiers.includes(seasonIdentifier)) {
          return false;
        }
        seasonCollectionIdentifiers.push(seasonIdentifier);
        return true;
      });
      return [...seasonsToAdd, ...seasonCollection];
    }
    return seasonCollection;
  }

  addTurnToCollectionIfMissing<Type extends Pick<ITurn, 'id'>>(
    turnCollection: Type[],
    ...turnsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const turns: Type[] = turnsToCheck.filter(isPresent);
    if (turns.length > 0) {
      const turnCollectionIdentifiers = turnCollection.map(turnItem => turnItem.id);
      const turnsToAdd = turns.filter(turnItem => {
        const turnIdentifier = turnItem.id;
        if (turnCollectionIdentifiers.includes(turnIdentifier)) {
          return false;
        }
        turnCollectionIdentifiers.push(turnIdentifier);
        return true;
      });
      return [...turnsToAdd, ...turnCollection];
    }
    return turnCollection;
  }



  // Date Conversion Helpers
  protected convertSeasonDateFromClient<T extends ISeason | NewSeason>(season: T): Omit<T, 'startDate' | 'endDate'> & { startDate?: string | null; endDate?: string | null; } {
    return {
      ...season,
      startDate: season.startDate?.toJSON() ?? null,
      endDate: season.endDate?.toJSON() ?? null,
    };
  }

  protected convertTurnDateFromClient<T extends ITurn | NewTurn>(turn: T): Omit<T, 'startDate' | 'endDate'> & { startDate?: string | null; endDate?: string | null; } {
    return {
      ...turn,
      startDate: turn.startDate?.toJSON() ?? null,
      endDate: turn.endDate?.toJSON() ?? null,
    };
  }

  protected convertMatchDateFromClient<T extends IMatch | NewMatch>(match: T): Omit<T, 'matchDate'> & { matchDate?: string | null; } {
    return {
      ...match,
      matchDate: match.matchDate?.toJSON() ?? null,
    };
  }

  protected convertSeasonResponseFromServer(res: EntityResponseType<RestSeason>): EntityResponseType<ISeason> {
    return res.clone({ body: res.body ? this.convertSeasonDateProperties(res.body) : null });
  }

  protected convertTurnResponseFromServer(res: EntityResponseType<RestTurn>): EntityResponseType<ITurn> {
    return res.clone({ body: res.body ? this.convertTurnDateProperties(res.body) : null });
  }

  protected convertMatchResponseFromServer(res: EntityResponseType<RestMatch>): EntityResponseType<IMatch> {
    return res.clone({ body: res.body ? this.convertMatchDateProperties(res.body) : null });
  }

  protected convertSeasonResponseArrayFromServer(res: EntityArrayResponseType<RestSeason>): EntityArrayResponseType<ISeason> {
    return res.clone({ body: res.body ? res.body.map(item => this.convertSeasonDateProperties(item)) : null });
  }

  protected convertTurnResponseArrayFromServer(res: EntityArrayResponseType<RestTurn>): EntityArrayResponseType<ITurn> {
    return res.clone({ body: res.body ? res.body.map(item => this.convertTurnDateProperties(item)) : null });
  }

  protected convertMatchResponseArrayFromServer(res: EntityArrayResponseType<RestMatch>): EntityArrayResponseType<IMatch> {
    return res.clone({ body: res.body ? res.body.map(item => this.convertMatchDateProperties(item)) : null });
  }

  protected convertSeasonDateProperties(restSeason: RestSeason): ISeason {
    return { ...restSeason, startDate: restSeason.startDate ? dayjs(restSeason.startDate) : undefined, endDate: restSeason.endDate ? dayjs(restSeason.endDate) : undefined };
  }

  protected convertTurnDateProperties(restTurn: RestTurn): ITurn {
    return { ...restTurn, startDate: restTurn.startDate ? dayjs(restTurn.startDate) : undefined, endDate: restTurn.endDate ? dayjs(restTurn.endDate) : undefined };
  }

  protected convertMatchDateProperties(restMatch: RestMatch): IMatch {
    return { ...restMatch, matchDate: restMatch.matchDate ? dayjs(restMatch.matchDate) : undefined };
  }
}
