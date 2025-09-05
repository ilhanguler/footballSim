import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import {IMoraleChangelog} from "./morale-changelog/morale-changelog.model";
import {ITeamStats} from "./team-stats/team-stats.model";

@Injectable({ providedIn: 'root' })
export class SimManagementService {
  protected simulationUrl = '/api/admin/simulation';
  protected fixtureUrl = '/api/admin/fixture';

  constructor(private http: HttpClient) {}

  simulateTurn(turnId: number): Observable<{}> {
    return this.http.post(`${this.simulationUrl}/turn/${turnId}`, {});
  }

  simulateSeason(seasonId: number): Observable<{}> {
    return this.http.post(`${this.simulationUrl}/season/${seasonId}`, {});
  }

  createFixtureForSeason(seasonId: number): Observable<{}> {
    return this.http.post(`${this.fixtureUrl}/season/${seasonId}`, {});
  }

  queryTeamStatsForTeam(teamId: number): Observable<HttpResponse<ITeamStats>> {
    return this.http.get<ITeamStats>(`api/admin/game/teams/${teamId}/team-stats`, { observe: 'response' });
  }

  queryMoraleChangelogForMatch(matchId: number): Observable<HttpResponse<IMoraleChangelog[]>> {
    return this.http.get<IMoraleChangelog[]>(`api/admin/game/matches/${matchId}/morale-changelogs`, { observe: 'response' });
  }

  queryMoraleChangelogForTeam(teamId: number): Observable<HttpResponse<IMoraleChangelog[]>> {
    return this.http.get<IMoraleChangelog[]>(`api/admin/game/teams/${teamId}/morale-changelogs`, { observe: 'response' });
  }
}
