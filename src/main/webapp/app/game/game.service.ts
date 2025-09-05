import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ITeam } from '../admin/game-management/team/team.model';
import { ILeague } from '../admin/game-management/league/league.model';
import { IMatch, RestMatch } from '../admin/game-management/match/match.model';
import { ISeason, RestSeason } from '../admin/game-management/season/season.model';
import { ITurn, RestTurn } from '../admin/game-management/turn/turn.model';
import { IScore } from '../admin/game-management/score/score.model';

@Injectable({ providedIn: 'root' })
export class GameService {
  private http = inject(HttpClient);
  private applicationConfigService = inject(ApplicationConfigService);

  private resourceUrl = this.applicationConfigService.getEndpointFor('api/game');

  queryTeams(): Observable<HttpResponse<ITeam[]>> {
    return this.http.get<ITeam[]>(`${this.resourceUrl}/teams`, { observe: 'response' });
  }

  queryTeam(id: number): Observable<HttpResponse<ITeam>> {
    return this.http.get<ITeam>(`${this.resourceUrl}/teams/${id}`, { observe: 'response' });
  }

  queryTeamsBySeason(seasonId: number): Observable<HttpResponse<ITeam[]>> {
    return this.http.get<ITeam[]>(`${this.resourceUrl}/seasons/${seasonId}/teams`, { observe: 'response' });
  }

  queryLeagues(): Observable<HttpResponse<ILeague[]>> {
    return this.http.get<ILeague[]>(`${this.resourceUrl}/leagues`, { observe: 'response' });
  }

  queryLeague(id: number): Observable<HttpResponse<ILeague>> {
    return this.http.get<ILeague>(`${this.resourceUrl}/leagues/${id}`, { observe: 'response' });
  }

  queryMatch(id: number): Observable<HttpResponse<IMatch>> {
    return this.http
      .get<RestMatch>(`${this.resourceUrl}/matches/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertMatchResponseFromServer(res)));
  }

  queryMatches(): Observable<HttpResponse<IMatch[]>> {
    return this.http
      .get<RestMatch[]>(`${this.resourceUrl}/matches`, { observe: 'response' })
      .pipe(map(res => this.convertMatchResponseArrayFromServer(res)));
  }

  queryMatchesByDate(date: string): Observable<HttpResponse<IMatch[]>> {
    return this.http
      .get<RestMatch[]>(`${this.resourceUrl}/matches/by-date`, { params: { date }, observe: 'response' })
      .pipe(map(res => this.convertMatchResponseArrayFromServer(res)));
  }

  queryMatchesByTurn(turnId: number): Observable<HttpResponse<IMatch[]>> {
    return this.http
      .get<RestMatch[]>(`${this.resourceUrl}/turns/${turnId}/matches`, { observe: 'response' })
      .pipe(map(res => this.convertMatchResponseArrayFromServer(res)));
  }

  queryMatchesByTeam(teamId: number): Observable<HttpResponse<IMatch[]>> {
    return this.http
      .get<RestMatch[]>(`${this.resourceUrl}/teams/${teamId}/matches`, { observe: 'response' })
      .pipe(map(res => this.convertMatchResponseArrayFromServer(res)));
  }

  querySeason(id: number): Observable<HttpResponse<ISeason>> {
    return this.http
      .get<RestSeason>(`${this.resourceUrl}/seasons/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertSeasonResponseFromServer(res)));
  }

  querySeasonsByLeague(leagueId: number): Observable<HttpResponse<ISeason[]>> {
    return this.http
      .get<RestSeason[]>(`${this.resourceUrl}/leagues/${leagueId}/seasons`, { observe: 'response' })
      .pipe(map(res => this.convertSeasonResponseArrayFromServer(res)));
  }

  queryTurnsBySeason(seasonId: number): Observable<HttpResponse<ITurn[]>> {
    return this.http
      .get<RestTurn[]>(`${this.resourceUrl}/seasons/${seasonId}/turns`, { observe: 'response' })
      .pipe(map(res => this.convertTurnResponseArrayFromServer(res)));
  }

  queryScoresBySeason(seasonId: number): Observable<HttpResponse<IScore[]>> {
    return this.http.get<IScore[]>(`${this.resourceUrl}/seasons/${seasonId}/scores`, { observe: 'response' });
  }

  protected convertDatePropertiesForMatch(restMatch: RestMatch): IMatch {
    return {
      ...restMatch,
      matchDate: restMatch.matchDate ? dayjs(restMatch.matchDate) : undefined,
    };
  }

  protected convertMatchResponseFromServer(res: HttpResponse<RestMatch>): HttpResponse<IMatch> {
    return res.clone({
      body: res.body ? this.convertDatePropertiesForMatch(res.body) : null,
    });
  }

  protected convertMatchResponseArrayFromServer(res: HttpResponse<RestMatch[]>): HttpResponse<IMatch[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDatePropertiesForMatch(item)) : null,
    });
  }

  protected convertDatePropertiesForSeason(restSeason: RestSeason): ISeason {
    return {
      ...restSeason,
      startDate: restSeason.startDate ? dayjs(restSeason.startDate) : undefined,
      endDate: restSeason.endDate ? dayjs(restSeason.endDate) : undefined,
    };
  }

  protected convertSeasonResponseFromServer(res: HttpResponse<RestSeason>): HttpResponse<ISeason> {
    return res.clone({
      body: res.body ? this.convertDatePropertiesForSeason(res.body) : null,
    });
  }

  protected convertSeasonResponseArrayFromServer(res: HttpResponse<RestSeason[]>): HttpResponse<ISeason[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDatePropertiesForSeason(item)) : null,
    });
  }

  protected convertDatePropertiesForTurn(restTurn: RestTurn): ITurn {
    return {
      ...restTurn,
      startDate: restTurn.startDate ? dayjs(restTurn.startDate) : undefined,
      endDate: restTurn.endDate ? dayjs(restTurn.endDate) : undefined,
    };
  }

  protected convertTurnResponseArrayFromServer(res: HttpResponse<RestTurn[]>): HttpResponse<ITurn[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDatePropertiesForTurn(item)) : null,
    });
  }
}
