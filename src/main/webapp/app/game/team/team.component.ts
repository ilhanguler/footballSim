import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GameService } from '../game.service';
import { ITeam } from 'app/admin/game-management/team/team.model';
import { IMatch } from 'app/admin/game-management/match/match.model';
import { forkJoin, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import FormatMediumDatePipe from '../../shared/date/format-medium-date.pipe';
import { AccountService } from 'app/core/auth/account.service';
import { SimManagementService } from 'app/admin/game-management/sim/sim-management.service';
import { Authority } from 'app/config/authority.constants';

interface MoraleData {
  moraleBefore: number | null;
  moraleChange: number | null;
}

@Component({
  selector: 'jhi-team',
  standalone: true,
  imports: [CommonModule, RouterModule, FormatMediumDatePipe],
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
})
export class TeamComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private gameService = inject(GameService);
  private accountService = inject(AccountService);
  private simManagementService = inject(SimManagementService);

  team: ITeam | null = null;
  sortedMatches: IMatch[] = [];
  isAdmin = false;
  moraleChangelogs = new Map<string, MoraleData>();

  ngOnInit(): void {
    const teamId = this.route.snapshot.paramMap.get('teamId');
    if (!teamId) return;

    const numericTeamId = +teamId;

    this.accountService.getAuthenticationState().pipe(
      tap(account => (this.isAdmin = account?.authorities.includes(Authority.ADMIN) ?? false)),
      switchMap(() =>
        forkJoin({
          team: this.gameService.queryTeam(numericTeamId),
          matches: this.gameService.queryMatchesByTeam(numericTeamId),
        })
      ),
      tap(({ team, matches }) => {
        this.team = team.body;
        const filteredMatches =
          matches.body?.filter(match => match.homeTeam?.id === numericTeamId || match.awayTeam?.id === numericTeamId) ?? [];
        this.sortedMatches = filteredMatches.sort((a, b) => {
          if (a.matchDate && b.matchDate) {
            return b.matchDate.diff(a.matchDate);
          }
          if (a.matchDate) return -1;
          if (b.matchDate) return 1;
          return 0;
        });
      }),
      switchMap(() => {
        if (this.isAdmin && this.sortedMatches.length > 0) {
          const moraleRequests = this.sortedMatches.map(match => this.simManagementService.queryMoraleChangelogForMatch(match.id));
          return forkJoin(moraleRequests);
        }
        return of(null);
      })
    ).subscribe(moraleResponses => {
      if (moraleResponses) {
        const allChangelogs = moraleResponses.flatMap(res => res.body ?? []);
        const changelogMap = new Map<string, MoraleData>();
        for (const log of allChangelogs) {
          if (log.match?.id && log.teamStats?.team?.id) {
            const key = `${log.match.id}-${log.teamStats.team.id}`;
            changelogMap.set(key, { moraleBefore: log.moraleBefore ?? null, moraleChange: log.moraleChange ?? null });
          }
        }
        this.moraleChangelogs = changelogMap;
      }
    });
  }

  getMoraleBeforeForMatchAndTeam(matchId: number | undefined, teamId: number | undefined): number {
    if (matchId === undefined || teamId === undefined) {
      return 0;
    }
    const key = `${matchId}-${teamId}`;
    return this.moraleChangelogs.get(key)?.moraleBefore ?? 0;
  }

  getMoraleChangeForMatchAndTeam(matchId: number | undefined, teamId: number | undefined): number {
    if (matchId === undefined || teamId === undefined) {
      return 0;
    }
    const key = `${matchId}-${teamId}`;
    return this.moraleChangelogs.get(key)?.moraleChange ?? 0;
  }

  getRivalTeamId(match: IMatch): number | undefined {
    if (!this.team) {
      return undefined;
    }
    return match.homeTeam?.id === this.team.id ? match.awayTeam?.id : match.homeTeam?.id;
  }
}
