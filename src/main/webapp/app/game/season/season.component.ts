import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { GameService } from '../game.service';
import { ISeason } from 'app/admin/game-management/season/season.model';
import { ITurn } from 'app/admin/game-management/turn/turn.model';
import { IMatch } from 'app/admin/game-management/match/match.model';
import { IScore } from 'app/admin/game-management/score/score.model';
import { ITeam } from 'app/admin/game-management/team/team.model';

interface TurnViewModel {
  turn: ITurn;
  matches: IMatch[];
}

@Component({
  selector: 'jhi-season-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './season.component.html',
  styleUrls: ['./season.component.scss'],
})
export class SeasonComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private gameService = inject(GameService);

  season: ISeason | null = null;
  turnViewModels: TurnViewModel[] = [];
  scores: IScore[] = [];
  teams: ITeam[] = [];
  activeTab: 'matches' | 'teams' | 'scores' = 'matches';

  ngOnInit(): void {
    const seasonId = this.route.snapshot.paramMap.get('seasonId');
    if (seasonId) {
      const numericSeasonId = +seasonId;
      forkJoin({
        season: this.gameService.querySeason(numericSeasonId),
        turns: this.gameService.queryTurnsBySeason(numericSeasonId),
        scores: this.gameService.queryScoresBySeason(numericSeasonId),
        teams: this.gameService.queryTeamsBySeason(numericSeasonId)
      }).pipe(
        switchMap(({ season, turns, scores, teams }) => {
          this.season = season.body;
          this.scores = scores.body ?? [];
          this.teams = teams.body ?? [];

          const turnList = turns.body ?? [];
          if (turnList.length === 0) {
            this.turnViewModels = [];
            return of([]);
          }

          const matchRequests = turnList.map(turn => this.gameService.queryMatchesByTurn(turn.id!));
          return forkJoin(matchRequests).pipe(
            map(matchesPerTurnResponses => {
              this.turnViewModels = turnList.map((turn, index) => ({
                turn,
                matches: matchesPerTurnResponses[index].body ?? []
              }));
            })
          );
        })
      ).subscribe();
    }
  }

  setActiveTab(tab: 'matches' | 'teams' | 'scores'): void {
    this.activeTab = tab;
  }
}
