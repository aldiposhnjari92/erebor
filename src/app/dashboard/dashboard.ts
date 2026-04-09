import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { switchMap, of, Subscription as RxSubscription } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { AppLogo } from '../shared/logo/logo';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../auth/auth.service';
import { SubscriptionService } from '../core/services/subscription.service';
import { Onboarding } from '../onboarding/onboarding';
import { AddSubscription, AddSubscriptionData } from './add-subscription/add-subscription';
import {
  Subscription,
  CATEGORY_META,
  SubscriptionCategory,
} from '../core/models/subscription.model';

export interface Widget {
  id: string;
  label: string;
  icon: string;
  visible: boolean;
  adminOnly: boolean;
}

@Component({
  selector: 'app-dashboard',
  imports: [
    DatePipe,
    RouterLink,
    AppLogo,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatChipsModule,
    MatProgressBarModule,
    MatDividerModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit, OnDestroy {
  auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  private subService = inject(SubscriptionService);
  private bp = inject(BreakpointObserver);

  readonly CATEGORY_META = CATEGORY_META;

  subscriptions = signal<Subscription[]>([]);
  subsLoading = signal(true);
  sidebarCollapsed = signal(false);
  mobileSidebarOpen = signal(false);
  activeSection = signal<string>('overview');

  private subsSub?: RxSubscription;

  widgets = signal<Widget[]>([
    { id: 'overview', label: 'Spending Overview', icon: 'insights', visible: true, adminOnly: false },
    { id: 'subscriptions', label: 'My Subscriptions', icon: 'subscriptions', visible: true, adminOnly: false },
    { id: 'renewals', label: 'Upcoming Renewals', icon: 'schedule', visible: true, adminOnly: false },
    { id: 'budget', label: 'Budget Tracker', icon: 'account_balance_wallet', visible: true, adminOnly: false },
    { id: 'users', label: 'User Management', icon: 'manage_accounts', visible: true, adminOnly: true },
    { id: 'analytics', label: 'Global Analytics', icon: 'bar_chart', visible: true, adminOnly: true },
  ]);

  visibleWidgets = computed(() => {
    const isAdmin = this.auth.isAdmin();
    return this.widgets().filter((w) => w.visible && (isAdmin || !w.adminOnly));
  });

  activeSubscriptions = computed(() =>
    this.subscriptions().filter((s) => s.status === 'active'),
  );

  monthlySpend = computed(() =>
    this.activeSubscriptions().reduce((sum, s) => {
      const monthly =
        s.billingCycle === 'annual' ? s.amount / 12
        : s.billingCycle === 'weekly' ? s.amount * 4.33
        : s.amount;
      return sum + monthly;
    }, 0),
  );

  upcomingRenewals = computed(() =>
    this.activeSubscriptions()
      .filter((s) => {
        const daysUntil = Math.ceil((s.nextRenewal.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        return daysUntil <= 30;
      })
      .sort((a, b) => a.nextRenewal.getTime() - b.nextRenewal.getTime()),
  );

  spendByCategory = computed(() => {
    const map = new Map<SubscriptionCategory, number>();
    for (const s of this.activeSubscriptions()) {
      const monthly =
        s.billingCycle === 'annual' ? s.amount / 12
        : s.billingCycle === 'weekly' ? s.amount * 4.33
        : s.amount;
      map.set(s.category, (map.get(s.category) ?? 0) + monthly);
    }
    return Array.from(map.entries())
      .map(([cat, amount]) => ({ category: cat, amount, meta: CATEGORY_META[cat] }))
      .sort((a, b) => b.amount - a.amount);
  });

  monthlyBudget = signal(75);
  budgetUsedPercent = computed(() =>
    Math.min(100, Math.round((this.monthlySpend() / this.monthlyBudget()) * 100)),
  );

  // Billing — driven by real user profile from Firestore via auth service
  trialDaysLeft = this.auth.trialDaysLeft;

  readonly planMeta: Record<string, { label: string; color: string }> = {
    starter: { label: 'Starter', color: '#6b7280' },
    pro:     { label: 'Pro',     color: '#1652f0' },
    team:    { label: 'Team',    color: '#7c3aed' },
    enterprise: { label: 'Enterprise', color: '#059669' },
  };

  currentPlan = computed(() => {
    const id = this.auth.user()?.plan ?? 'starter';
    return this.planMeta[id] ?? this.planMeta['starter'];
  });

  constructor() {
    // Sync activeSection with URL param
    this.route.params.subscribe((p) => this.activeSection.set(p['section'] ?? 'overview'));

    // Auto-collapse sidebar on tablet, keep open on desktop
    this.bp.observe(['(max-width: 1199px)']).subscribe((state) => {
      if (state.matches) this.sidebarCollapsed.set(true);
      else this.sidebarCollapsed.set(false);
    });

    // Stream subscriptions from Firestore
    this.subsSub = toObservable(this.auth.user).pipe(
      switchMap((user) => (user ? this.subService.list$(user.uid) : of([]))),
    ).subscribe({
      next: (subs) => {
        this.subscriptions.set(subs);
        this.subsLoading.set(false);
      },
      error: () => this.subsLoading.set(false),
    });
  }

  ngOnInit(): void {
    if (this.auth.needsOnboarding()) {
      this.openOnboarding();
    }
  }

  openAddSubscription(): void {
    const ref = this.dialog.open(AddSubscription, {
      width: '680px',
      maxWidth: '95vw',
      panelClass: 'add-sub-dialog',
    });
    ref.afterClosed().subscribe((result: Omit<Subscription, 'id'> | null) => {
      const uid = this.auth.user()?.uid;
      if (!result || !uid) return;
      this.subService.add(uid, { ...result, userId: uid }).catch(console.error);
    });
  }

  openEditSubscription(sub: Subscription): void {
    const data: AddSubscriptionData = { subscription: sub };
    const ref = this.dialog.open(AddSubscription, {
      width: '680px',
      maxWidth: '95vw',
      panelClass: 'add-sub-dialog',
      data,
    });
    ref.afterClosed().subscribe((result: Subscription | null) => {
      const uid = this.auth.user()?.uid;
      if (!result || !uid) return;
      const { id, userId, startedAt, ...changes } = result;
      this.subService.update(uid, id, changes).catch(console.error);
    });
  }

  ngOnDestroy(): void {
    this.subsSub?.unsubscribe();
  }

  openOnboarding(): void {
    const ref = this.dialog.open(Onboarding, {
      width: '680px',
      maxWidth: '95vw',
      disableClose: true,
      panelClass: 'onboarding-dialog',
    });
    ref.afterClosed().subscribe(() => {
      this.auth.completeOnboarding();
    });
  }

  toggleWidget(id: string): void {
    this.widgets.update((list) =>
      list.map((w) => (w.id === id ? { ...w, visible: !w.visible } : w)),
    );
  }

  toggleSidebar(): void {
    this.sidebarCollapsed.update((v) => !v);
  }

  toggleMobileSidebar(): void {
    this.mobileSidebarOpen.update((v) => !v);
  }

  setSection(section: string): void {
    this.router.navigate(['/dashboard', section]);
    this.mobileSidebarOpen.set(false); // close mobile drawer on nav
  }

  daysUntil(date: Date): number {
    return Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  }

  formatAmount(amount: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }

  pauseSubscription(sub: Subscription): void {
    const uid = this.auth.user()?.uid;
    if (!uid) return;
    const newStatus = sub.status === 'paused' ? 'active' : 'paused';
    this.subService.update(uid, sub.id, { status: newStatus }).catch(console.error);
  }

  cancelSubscription(sub: Subscription): void {
    const uid = this.auth.user()?.uid;
    if (!uid) return;
    this.subService.update(uid, sub.id, { status: 'cancelled' }).catch(console.error);
  }

  deleteSubscription(sub: Subscription): void {
    const uid = this.auth.user()?.uid;
    if (!uid) return;
    if (!confirm(`Delete "${sub.name}"? This cannot be undone.`)) return;
    this.subService.remove(uid, sub.id).catch(console.error);
  }

  signOut(): void {
    this.auth.signOut();
  }
}
