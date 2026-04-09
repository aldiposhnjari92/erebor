import { Component, inject, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  Subscription,
  SubscriptionCategory,
  BillingCycle,
  CATEGORY_META,
} from '../../core/models/subscription.model';

export interface AddSubscriptionData {
  subscription?: Subscription;
}

export interface ServiceTemplate {
  name: string;
  category: SubscriptionCategory;
  color: string;
  icon: string;
  defaultAmount: number;
  billingCycle: BillingCycle;
  website?: string;
}

export const SERVICE_CATALOG: ServiceTemplate[] = [
  { name: 'Netflix',              category: 'streaming',    color: '#e50914', icon: 'play_circle',       defaultAmount: 15.99, billingCycle: 'monthly' },
  { name: 'Spotify',              category: 'music',        color: '#1db954', icon: 'music_note',        defaultAmount: 9.99,  billingCycle: 'monthly' },
  { name: 'YouTube Premium',      category: 'streaming',    color: '#ff0000', icon: 'smart_display',     defaultAmount: 13.99, billingCycle: 'monthly' },
  { name: 'Disney+',              category: 'streaming',    color: '#0063e5', icon: 'movie',             defaultAmount: 7.99,  billingCycle: 'monthly' },
  { name: 'Hulu',                 category: 'streaming',    color: '#1ce783', icon: 'tv',                defaultAmount: 7.99,  billingCycle: 'monthly' },
  { name: 'Apple Music',          category: 'music',        color: '#fc3c44', icon: 'headphones',        defaultAmount: 10.99, billingCycle: 'monthly' },
  { name: 'Slack',                category: 'productivity', color: '#4a154b', icon: 'chat',              defaultAmount: 7.25,  billingCycle: 'monthly' },
  { name: 'Notion',               category: 'productivity', color: '#1a1f36', icon: 'article',           defaultAmount: 8.00,  billingCycle: 'monthly' },
  { name: 'Google Workspace',     category: 'productivity', color: '#4285f4', icon: 'work',              defaultAmount: 6.00,  billingCycle: 'monthly' },
  { name: 'Microsoft 365',        category: 'productivity', color: '#d83b01', icon: 'apps',              defaultAmount: 6.99,  billingCycle: 'monthly' },
  { name: 'GitHub Copilot',       category: 'productivity', color: '#1652f0', icon: 'code',              defaultAmount: 10.00, billingCycle: 'monthly' },
  { name: 'Figma',                category: 'productivity', color: '#f24e1e', icon: 'design_services',   defaultAmount: 15.00, billingCycle: 'monthly' },
  { name: 'Adobe Creative Cloud', category: 'productivity', color: '#ff0000', icon: 'palette',           defaultAmount: 54.99, billingCycle: 'monthly' },
  { name: 'Zoom',                 category: 'productivity', color: '#2d8cff', icon: 'videocam',          defaultAmount: 14.99, billingCycle: 'monthly' },
  { name: 'Jira',                 category: 'productivity', color: '#0052cc', icon: 'bug_report',        defaultAmount: 8.15,  billingCycle: 'monthly' },
  { name: 'Linear',               category: 'productivity', color: '#5e6ad2', icon: 'linear_scale',      defaultAmount: 8.00,  billingCycle: 'monthly' },
  { name: 'Loom',                 category: 'productivity', color: '#625df5', icon: 'play_circle_filled', defaultAmount: 12.50, billingCycle: 'monthly' },
  { name: 'Dropbox',              category: 'cloud',        color: '#0061ff', icon: 'cloud',             defaultAmount: 11.99, billingCycle: 'monthly' },
  { name: 'Google One',           category: 'cloud',        color: '#4285f4', icon: 'cloud_queue',       defaultAmount: 2.99,  billingCycle: 'monthly' },
  { name: 'iCloud+',              category: 'cloud',        color: '#3a7bd5', icon: 'cloud_done',        defaultAmount: 0.99,  billingCycle: 'monthly' },
  { name: 'Xbox Game Pass',       category: 'gaming',       color: '#107c10', icon: 'sports_esports',    defaultAmount: 14.99, billingCycle: 'monthly' },
  { name: 'PlayStation Plus',     category: 'gaming',       color: '#003087', icon: 'sports_esports',    defaultAmount: 9.99,  billingCycle: 'monthly' },
  { name: 'LinkedIn Premium',     category: 'productivity', color: '#0a66c2', icon: 'person_search',     defaultAmount: 39.99, billingCycle: 'monthly' },
  { name: 'Headspace',            category: 'fitness',      color: '#f47d31', icon: 'self_improvement',  defaultAmount: 12.99, billingCycle: 'monthly' },
  { name: 'Duolingo Plus',        category: 'other',        color: '#58cc02', icon: 'school',            defaultAmount: 6.99,  billingCycle: 'monthly' },
  { name: 'Custom',               category: 'other',        color: '#6b7280', icon: 'apps',              defaultAmount: 0,     billingCycle: 'monthly' },
];

const CATEGORY_FILTERS: Array<{ id: SubscriptionCategory | 'all'; label: string }> = [
  { id: 'all',          label: 'All' },
  { id: 'productivity', label: 'Productivity' },
  { id: 'streaming',    label: 'Streaming' },
  { id: 'music',        label: 'Music' },
  { id: 'cloud',        label: 'Cloud' },
  { id: 'gaming',       label: 'Gaming' },
  { id: 'fitness',      label: 'Fitness' },
  { id: 'other',        label: 'Other' },
];

@Component({
  selector: 'app-add-subscription',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatDatepickerModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './add-subscription.html',
  styleUrl: './add-subscription.scss',
})
export class AddSubscription {
  private dialogRef = inject(MatDialogRef<AddSubscription>);
  private fb = inject(FormBuilder);
  private dialogData: AddSubscriptionData | null = inject(MAT_DIALOG_DATA, { optional: true });

  readonly CATEGORY_META = CATEGORY_META;
  readonly categoryFilters = CATEGORY_FILTERS;
  readonly catalog = SERVICE_CATALOG;

  readonly CURRENCY_SYMBOLS: Record<string, string> = {
    USD: '$', EUR: '€', GBP: '£', CAD: 'CA$', AUD: 'A$',
  };

  get isEditMode(): boolean {
    return !!this.dialogData?.subscription;
  }

  get currencySymbol(): string {
    return this.CURRENCY_SYMBOLS[this.form.get('currency')?.value ?? 'USD'] ?? '$';
  }

  step = signal<'pick' | 'configure'>(this.dialogData?.subscription ? 'configure' : 'pick');
  selectedService = signal<ServiceTemplate | null>(null);
  searchQuery = signal('');
  activeCategory = signal<SubscriptionCategory | 'all'>('all');

  form: FormGroup = this.fb.group({
    name:         ['', Validators.required],
    amount:       [0, [Validators.required, Validators.min(0.01)]],
    currency:     ['USD'],
    billingCycle: ['monthly', Validators.required],
    nextRenewal:  [this.defaultRenewalDate() as Date | null, Validators.required],
    notes:        [''],
  });

  constructor() {
    const existing = this.dialogData?.subscription;
    if (existing) {
      // Find matching catalog entry or fall back to a synthetic template
      const match = SERVICE_CATALOG.find((s) => s.name === existing.name)
        ?? { name: existing.name, category: existing.category, color: existing.color, icon: existing.icon, defaultAmount: existing.amount, billingCycle: existing.billingCycle };
      this.selectedService.set(match);
      this.form.patchValue({
        name:         existing.name,
        amount:       existing.amount,
        currency:     existing.currency,
        billingCycle: existing.billingCycle,
        nextRenewal:  existing.nextRenewal,
        notes:        existing.notes ?? '',
      });
    }
  }

  filteredCatalog = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const cat = this.activeCategory();
    return this.catalog.filter((s) => {
      const matchCat = cat === 'all' || s.category === cat;
      const matchQ = !q || s.name.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  });

  selectService(service: ServiceTemplate): void {
    this.selectedService.set(service);
    this.form.patchValue({
      name:         service.name === 'Custom' ? '' : service.name,
      amount:       service.defaultAmount || null,
      billingCycle: service.billingCycle,
    });
    this.step.set('configure');
  }

  back(): void {
    this.step.set('pick');
    this.selectedService.set(null);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const svc = this.selectedService()!;
    const val = this.form.value;
    const existing = this.dialogData?.subscription;

    if (existing) {
      const result: Subscription = {
        ...existing,
        name:         val.name,
        category:     svc.category,
        amount:       Number(val.amount),
        currency:     val.currency,
        billingCycle: val.billingCycle as BillingCycle,
        nextRenewal:  val.nextRenewal instanceof Date ? val.nextRenewal : new Date(val.nextRenewal),
        color:        svc.color,
        icon:         svc.icon,
        notes:        val.notes || undefined,
      };
      this.dialogRef.close(result);
    } else {
      const result: Omit<Subscription, 'id'> = {
        userId:       '',
        name:         val.name,
        category:     svc.category,
        amount:       Number(val.amount),
        currency:     val.currency,
        billingCycle: val.billingCycle as BillingCycle,
        nextRenewal:  val.nextRenewal instanceof Date ? val.nextRenewal : new Date(val.nextRenewal),
        startedAt:    new Date(),
        color:        svc.color,
        icon:         svc.icon,
        status:       'active',
        notes:        val.notes || undefined,
      };
      this.dialogRef.close(result);
    }
  }

  close(): void {
    this.dialogRef.close(null);
  }

  private defaultRenewalDate(): Date {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d;
  }
}
