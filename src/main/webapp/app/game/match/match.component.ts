import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GameService } from '../game.service';
import { IMatch } from 'app/admin/game-management/match/match.model';
import FormatMediumDatetimePipe from '../../shared/date/format-medium-datetime.pipe';
import { AccountService } from 'app/core/auth/account.service';
import { IMoraleChangelog } from 'app/admin/game-management/sim/morale-changelog/morale-changelog.model';
import { ITeamStats } from 'app/admin/game-management/sim/team-stats/team-stats.model';
import { Authority } from 'app/config/authority.constants';
import { SimManagementService } from 'app/admin/game-management/sim/sim-management.service';

@Component({
  selector: 'jhi-match-view',
  standalone: true,
  imports: [CommonModule, RouterModule, FormatMediumDatetimePipe],
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss'],
})
export class MatchComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private gameService = inject(GameService);
  private accountService = inject(AccountService);
  private simManagementService = inject(SimManagementService);

  match: IMatch | null = null;
  isAdmin = false;
  moraleChangelog: IMoraleChangelog[] | null = null;
  homeTeamStats: ITeamStats | null = null;
  awayTeamStats: ITeamStats | null = null;

  ngOnInit(): void {
    this.accountService.getAuthenticationState().subscribe(account => {
      this.isAdmin = account?.authorities.includes(Authority.ADMIN) ?? false;
    });

    const matchId = this.route.snapshot.paramMap.get('matchId');
    if (matchId) {
      this.gameService.queryMatch(+matchId).subscribe(res => {
        this.match = res.body;
        // After getting the match, check for admin status
        this.accountService.getAuthenticationState().subscribe(account => {
          this.isAdmin = account?.authorities.includes(Authority.ADMIN) ?? false;
          // If we have a match and the user is an admin, load the extra data
          if (this.match && this.isAdmin) {
            this.loadAdminData(this.match);
          }
        });
      });
    }
  }

  private loadAdminData(match: IMatch): void {
    this.simManagementService.queryMoraleChangelogForMatch(match.id).subscribe(mcRes => {
      this.moraleChangelog = mcRes.body;
    });
    if (match.homeTeam?.id) {
      this.simManagementService.queryTeamStatsForTeam(match.homeTeam.id).subscribe(tsRes => {
        this.homeTeamStats = tsRes.body;
      });
    }
    if (match.awayTeam?.id) {
      this.simManagementService.queryTeamStatsForTeam(match.awayTeam.id).subscribe(tsRes => {
        this.awayTeamStats = tsRes.body;
      });
    }
  }

  getMoraleBefore(teamId: number | undefined): number {
    if (!teamId || !this.moraleChangelog) {
      return 0;
    }
    const log = this.moraleChangelog.find(l => l.teamStats?.team?.id === teamId);
    return log?.moraleBefore ?? 0;
  }

  getMoraleChange(teamId: number | undefined): number {
    if (!teamId || !this.moraleChangelog) {
      return 0;
    }
    const log = this.moraleChangelog.find(l => l.teamStats?.team?.id === teamId);
    return log?.moraleChange ?? 0;
  }
}
