import { Component, inject, signal } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';

export interface OnboardingStep {
  icon: string;
  iconColor: string;
  title: string;
  description: string;
  tip?: string;
}

@Component({
  selector: 'app-onboarding',
  imports: [MatDialogModule, MatButtonModule, MatIconModule, MatStepperModule],
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.scss',
})
export class Onboarding {
  private dialogRef = inject(MatDialogRef<Onboarding>);

  currentStep = signal(0);

  readonly steps: OnboardingStep[] = [
    {
      icon: 'waving_hand',
      iconColor: '#f97316',
      title: 'Welcome to Overpay!',
      description:
        'Your personal subscription command center. We help you see everything you\'re paying for — in one clean dashboard.',
      tip: 'Most people discover they\'re paying for 2–3 subscriptions they forgot about.',
    },
    {
      icon: 'subscriptions',
      iconColor: '#1652f0',
      title: 'Track all your subscriptions',
      description:
        'Add any recurring service — Netflix, Spotify, SaaS tools, gym memberships, anything. Overpay keeps them organized by category and billing cycle.',
      tip: 'You can import subscriptions manually or let us detect them from your email (coming soon).',
    },
    {
      icon: 'notifications_active',
      iconColor: '#10b981',
      title: 'Never miss a renewal',
      description:
        'Get notified before every renewal so you can decide whether to keep, pause, or cancel a subscription — before the charge hits.',
      tip: 'Set your reminder window (1 day, 3 days, 1 week) per subscription.',
    },
    {
      icon: 'savings',
      iconColor: '#8b5cf6',
      title: 'Set a monthly budget',
      description:
        'Define how much you want to spend on subscriptions each month. Overpay will alert you when you\'re approaching or exceeding your limit.',
      tip: 'The average person spends $237/month on subscriptions without realizing it.',
    },
    {
      icon: 'insights',
      iconColor: '#ec4899',
      title: 'Understand your spending',
      description:
        'See trends over time, spending by category, and which services cost you the most. Make smarter decisions about where your money goes.',
      tip: 'Analytics update in real time as you add and manage subscriptions.',
    },
    {
      icon: 'rocket_launch',
      iconColor: '#1652f0',
      title: 'You\'re all set!',
      description:
        'Your dashboard is ready. Start by adding your first subscription — it only takes a few seconds.',
      tip: undefined,
    },
  ];

  get isLastStep(): boolean {
    return this.currentStep() === this.steps.length - 1;
  }

  get isFirstStep(): boolean {
    return this.currentStep() === 0;
  }

  next(): void {
    if (!this.isLastStep) {
      this.currentStep.update((s) => s + 1);
    }
  }

  prev(): void {
    if (!this.isFirstStep) {
      this.currentStep.update((s) => s - 1);
    }
  }

  finish(): void {
    this.dialogRef.close(true);
  }

  skip(): void {
    this.dialogRef.close(false);
  }
}
