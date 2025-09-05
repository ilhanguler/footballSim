import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { GameService } from '../game/game.service';
import { ILeague } from '../admin/game-management/league/league.model';
import { ISeason } from '../admin/game-management/season/season.model';
import { IMatch } from '../admin/game-management/match/match.model';
import { ITurn } from '../admin/game-management/turn/turn.model';

interface MatchGroup {
  league: ILeague;
  season: ISeason;
  turn: ITurn;
  matches: IMatch[];
}

interface MatchViewModel {
  match: IMatch;
  league: ILeague;
  season: ISeason;
  turn: ITurn;
}

@Component({
  selector: 'jhi-home-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  private gameService = inject(GameService);

  selectedDate: string = new Date().toISOString().split('T')[0];
  viewMode: 'league' | 'date' = 'league';

  matchesByLeague: MatchGroup[] = [];
  matchesForDate: MatchViewModel[] = [];

  private leaguesMap: Map<number, ILeague> = new Map();
  private seasonsMap: Map<number, ISeason> = new Map();
  private turnsMap: Map<number, ITurn> = new Map();

  ngOnInit(): void {
    this.loadMetadata();
  }

  loadMetadata(): void {
    this.gameService.queryLeagues().pipe(
      switchMap(leaguesRes => {
        const leagues = leaguesRes.body ?? [];
        this.leaguesMap = new Map(leagues.map(l => [l.id, l]));
        if (leagues.length === 0) {
          return of({ seasons: [] });
        }
        const seasonRequests = leagues.map(league => this.gameService.querySeasonsByLeague(league.id!));
        return forkJoin(seasonRequests).pipe(
          map(seasonsResArray => ({ seasons: seasonsResArray.flatMap(res => res.body ?? []) }))
        );
      }),
      switchMap(({ seasons }) => {
        this.seasonsMap = new Map(seasons.map(s => [s.id, s]));
        if (seasons.length === 0) {
          return of({ turns: [] });
        }
        const turnRequests = seasons.map(season => this.gameService.queryTurnsBySeason(season.id!));
        return forkJoin(turnRequests).pipe(
          map(turnsResArray => ({ turns: turnsResArray.flatMap(res => res.body ?? []) }))
        );
      }),
      switchMap(({ turns }) => {
        this.turnsMap = new Map(turns.map(t => [t.id, t]));
        return of(null); // End of metadata loading
      })
    ).subscribe(() => {
      this.loadMatchesForDate();
    });
  }

  loadMatchesForDate(): void {
    this.gameService.queryMatchesByDate(this.selectedDate).subscribe(res => {
      const matches = res.body ?? [];
      this.processMatches(matches);
    });
  }

  processMatches(matches: IMatch[]): void {
    const newMatchesForDate: MatchViewModel[] = [];
    const groups: { [key: string]: MatchGroup } = {};

    matches.forEach(match => {
      if (!match.turn?.id) return;
      const turn = this.turnsMap.get(match.turn.id);
      if (!turn?.season?.id) return;
      const season = this.seasonsMap.get(turn.season.id);
      if (!season?.league?.id) return;
      const league = this.leaguesMap.get(season.league.id);
      if (!league) return;

      newMatchesForDate.push({ match, league, season, turn });

      const key = `${league.id}-${season.id}-${turn.id}`;
      if (!groups[key]) {
        groups[key] = {
          league,
          season,
          turn,
          matches: [],
        };
      }
      groups[key].matches.push(match);
    });

    this.matchesForDate = newMatchesForDate;
    this.matchesByLeague = Object.values(groups);
  }

  onDateChange(): void {
    this.loadMatchesForDate();
  }

  changeDate(days: number): void {
    const currentDate = dayjs(this.selectedDate);
    this.selectedDate = currentDate.add(days, 'day').format('YYYY-MM-DD');
    this.loadMatchesForDate();
  }

  goToToday(): void {
    this.selectedDate = new Date().toISOString().split('T')[0];
    this.loadMatchesForDate();
  }

  setViewMode(mode: 'league' | 'date'): void {
    this.viewMode = mode;
  }
}
