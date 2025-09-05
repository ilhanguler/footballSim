import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { GameService } from '../game.service';
import { ILeague } from 'app/admin/game-management/league/league.model';
import { ISeason } from 'app/admin/game-management/season/season.model';

@Component({
  selector: 'jhi-league-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './league.component.html',
  styleUrls: ['./league.component.scss'],
})
export class LeagueComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private gameService = inject(GameService);

  league: ILeague | null = null;
  seasons: ISeason[] = [];

  ngOnInit(): void {
    const leagueId = this.route.snapshot.paramMap.get('leagueId');
    if (leagueId) {
      const numericLeagueId = +leagueId;
      forkJoin({
        league: this.gameService.queryLeague(numericLeagueId),
        seasons: this.gameService.querySeasonsByLeague(numericLeagueId)
      }).subscribe(({ league, seasons }) => {
        this.league = league.body;
        this.seasons = seasons.body ?? [];
      });
    }
  }
}
