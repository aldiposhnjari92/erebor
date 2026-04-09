import { Component, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { Navbar } from '../web-client/components/navbar/navbar';

export interface Plan {
  id: string;
  name: string;
  monthlyPrice: number | null;
  annualPrice: number | null;
  description: string;
  badge: string | null;
  badgeColor: string;
  color: string;
  cta: string;
  ctaStyle: 'primary' | 'outline' | 'secondary';
  trial: boolean;
  features: string[];
  limits: string[];
}

@Component({
  selector: 'app-pricing',
  imports: [RouterLink, MatButtonModule, MatIconModule, MatExpansionModule, MatDividerModule, Navbar],
  templateUrl: './pricing.html',
  styleUrl: './pricing.scss',
})
export class Pricing {
  billing = signal<'monthly' | 'annual'>('monthly');

  isAnnual = computed(() => this.billing() === 'annual');

  toggleBilling(): void {
    this.billing.update((b) => (b === 'monthly' ? 'annual' : 'monthly'));
  }

  readonly plans: Plan[] = [
    {
      id: 'starter',
      name: 'Starter',
      monthlyPrice: 0,
      annualPrice: 0,
      description: 'For individuals who want to keep tabs on personal subscriptions.',
      badge: null,
      badgeColor: '',
      color: '#6b7280',
      cta: 'Get started free',
      ctaStyle: 'outline',
      trial: false,
      features: [
        '1 user',
        'Up to 10 subscriptions',
        '20 app integrations',
        'Basic renewal reminders',
        'Community support',
      ],
      limits: [
        'Spending analytics',
        'Budget tracking',
        'Team features',
        'Priority support',
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      monthlyPrice: 9,
      annualPrice: 7,
      description: 'For power users who want full visibility over their spending.',
      badge: 'Most popular',
      badgeColor: '#1652f0',
      color: '#1652f0',
      cta: 'Start free trial',
      ctaStyle: 'primary',
      trial: true,
      features: [
        '1 user',
        'Unlimited subscriptions',
        '500+ integrations',
        'Smart renewal alerts',
        'Spending analytics & insights',
        'Budget tracking',
        'Priority email support',
      ],
      limits: ['Team features', 'SSO / SAML'],
    },
    {
      id: 'team',
      name: 'Team',
      monthlyPrice: 49,
      annualPrice: 39,
      description: 'For teams that need full control over their entire SaaS stack.',
      badge: null,
      badgeColor: '',
      color: '#8b5cf6',
      cta: 'Start free trial',
      ctaStyle: 'outline',
      trial: true,
      features: [
        'Up to 25 users',
        'Everything in Pro',
        'Team spending dashboard',
        'User roles & permissions',
        'Shared subscription tracking',
        'Slack & Teams notifications',
        'Priority support',
      ],
      limits: ['SSO / SAML', 'Custom integrations'],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      monthlyPrice: null,
      annualPrice: null,
      description: 'For large organisations with custom compliance and scale requirements.',
      badge: null,
      badgeColor: '',
      color: '#10b981',
      cta: 'Contact sales',
      ctaStyle: 'secondary',
      trial: false,
      features: [
        'Unlimited users',
        'Everything in Team',
        'SSO / SAML',
        'Audit logs',
        'Custom integrations',
        'Dedicated success manager',
        'SLA guarantee',
        '24/7 phone support',
      ],
      limits: [],
    },
  ];

  price(plan: Plan): string {
    if (plan.monthlyPrice === null) return 'Custom';
    if (plan.monthlyPrice === 0) return 'Free';
    const p = this.isAnnual() ? (plan.annualPrice ?? plan.monthlyPrice) : plan.monthlyPrice;
    return `$${p}`;
  }

  annualSavings(plan: Plan): number {
    if (!plan.monthlyPrice || !plan.annualPrice) return 0;
    return (plan.monthlyPrice - plan.annualPrice) * 12;
  }

  readonly faqs = [
    {
      q: 'How does the 14-day free trial work?',
      a: 'Start any paid plan completely free for 14 days — no credit card required. You get full access to every feature in your chosen plan. After 14 days, you\'ll be prompted to add a payment method to continue. If you don\'t, your account reverts to the Starter plan.',
    },
    {
      q: 'What happens when my trial expires?',
      a: 'You\'ll receive reminders at 7 days and 1 day before your trial ends. Once expired, your account moves to the free Starter plan. Your data is fully preserved — you just lose access to Pro/Team features until you subscribe.',
    },
    {
      q: 'Can I change or cancel my plan at any time?',
      a: 'Yes. You can upgrade, downgrade or cancel at any time from your dashboard billing settings. Upgrades take effect immediately. Downgrades and cancellations take effect at the end of your current billing period.',
    },
    {
      q: 'What payment methods will you accept?',
      a: 'We\'re adding payment support soon. We\'ll accept major credit cards (Visa, Mastercard, Amex), and SEPA direct debit for European customers. We\'ll notify all trial users when payment goes live.',
    },
    {
      q: 'Is my subscription data private and secure?',
      a: 'Absolutely. Your data is encrypted in transit and at rest. We never share or sell your subscription data. You own your data and can export or delete it at any time.',
    },
    {
      q: 'Does the Team plan price change based on seats?',
      a: 'The Team plan covers up to 25 users at a flat rate. Need more? Our Enterprise plan offers unlimited users with custom pricing — contact sales for a quote.',
    },
  ];
}
