import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ILeague } from '../../admin/game-management/league/league.model';
import { GameService } from '../game.service';

@Component({
  selector: 'jhi-league-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './league-list.component.html',
  styleUrls: ['./league-list.component.scss'],
})
export class LeagueListComponent implements OnInit {
  leagues: ILeague[] = [];
  private gameService = inject(GameService);

  ngOnInit(): void {
    this.gameService.queryLeagues().subscribe(res => {
      if (res.body) {
        this.leagues = res.body;
      }
    });
  }
}
