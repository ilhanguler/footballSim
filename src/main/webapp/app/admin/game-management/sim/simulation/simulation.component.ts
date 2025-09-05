import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import SharedModule from 'app/shared/shared.module';
import { SimManagementService } from '../sim-management.service';
import { GameManagementService } from '../../game-management.service';
import { ILeague } from '../../league/league.model';
import { ISeason } from '../../season/season.model';
import { ITurn } from '../../turn/turn.model';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-simulation',
  templateUrl: './simulation.component.html',
  standalone: true,
  imports: [SharedModule, FormsModule, CommonModule],
})
export class SimulationComponent implements OnInit {
  activeTab = 'simulation';

  leagues: ILeague[] = [];
  seasons: ISeason[] = [];
  turns: ITurn[] = [];

  selectedLeague: ILeague | null = null;
  selectedSeason: ISeason | null = null;
  selectedTurn: ITurn | null = null;

  isGeneratingFixture = false;
  fixtureSuccess = false;
  fixtureError = false;

  isSimulatingTurn = false;
  turnSuccess = false;
  turnError = false;

  isSimulatingSeason = false;
  seasonSuccess = false;
  seasonError = false;

  constructor(
    private simulationService: SimManagementService,
    private gameManagementService: GameManagementService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.gameManagementService.queryLeagues().subscribe((res: HttpResponse<ILeague[]>) => {
      this.leagues = res.body ?? [];
    });
  }

  onLeagueSelect(): void {
    this.selectedSeason = null;
    this.selectedTurn = null;
    this.seasons = [];
    this.turns = [];
    if (this.selectedLeague && this.selectedLeague.id) {
      this.gameManagementService.querySeasonsByLeague(this.selectedLeague.id).subscribe((res: HttpResponse<ISeason[]>) => {
        this.seasons = res.body ?? [];
      });
    }
  }

  onSeasonSelect(): void {
    this.selectedTurn = null;
    this.turns = [];
    if (this.selectedSeason && this.selectedSeason.id) {
      this.gameManagementService.queryTurnsBySeason(this.selectedSeason.id).subscribe((res: HttpResponse<ITurn[]>) => {
        this.turns = res.body ?? [];
      });
    }
  }

  simulateTurn(): void {
    if (this.selectedTurn && this.selectedTurn.id) {
      this.isSimulatingTurn = true;
      this.turnSuccess = false;
      this.turnError = false;
      const turnId = this.selectedTurn.id;
      const seasonId = this.selectedSeason?.id ?? 0;
      this.simulationService.simulateTurn(turnId).subscribe({
        next: () => {
          this.isSimulatingTurn = false;
          this.turnSuccess = true;
          setTimeout(() => {
            this.router.navigate(['/game/season', seasonId]);
          }, 2000);
        },
        error: () => {
          this.isSimulatingTurn = false;
          this.turnError = true;
        },
      });
    }
  }

  simulateSeason(): void {
    if (this.selectedSeason && this.selectedSeason.id) {
      this.isSimulatingSeason = true;
      this.seasonSuccess = false;
      this.seasonError = false;
      const seasonId = this.selectedSeason.id;
      this.simulationService.simulateSeason(seasonId).subscribe({
        next: () => {
          this.isSimulatingSeason = false;
          this.seasonSuccess = true;
          setTimeout(() => {
            this.router.navigate(['/game/season', seasonId]);
          }, 2000);
        },
        error: () => {
          this.isSimulatingSeason = false;
          this.seasonError = true;
        },
      });
    }
  }

  doFixture(): void {
    if (this.selectedSeason && this.selectedSeason.id) {
      this.isGeneratingFixture = true;
      this.fixtureSuccess = false;
      this.fixtureError = false;
      const seasonId = this.selectedSeason.id;
      this.simulationService.createFixtureForSeason(seasonId).subscribe({
        next: () => {
          this.isGeneratingFixture = false;
          this.fixtureSuccess = true;
          setTimeout(() => {
            this.router.navigate(['/game/season', seasonId]);
          }, 2000);
        },
        error: () => {
          this.isGeneratingFixture = false;
          this.fixtureError = true;
        },
      });
    }
  }
}
