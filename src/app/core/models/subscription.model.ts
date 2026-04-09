export type BillingCycle = 'weekly' | 'monthly' | 'annual';
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled';
export type SubscriptionCategory =
  | 'streaming'
  | 'productivity'
  | 'gaming'
  | 'news'
  | 'fitness'
  | 'cloud'
  | 'music'
  | 'other';

export interface Subscription {
  id: string;
  userId: string;
  name: string;
  description?: string;
  category: SubscriptionCategory;
  amount: number;
  currency: string;
  billingCycle: BillingCycle;
  nextRenewal: Date;
  startedAt: Date;
  color: string;
  icon: string;
  website?: string;
  status: SubscriptionStatus;
  notes?: string;
}

export const CATEGORY_META: Record<
  SubscriptionCategory,
  { label: string; icon: string; color: string }
> = {
  streaming: { label: 'Streaming', icon: 'play_circle', color: '#ef4444' },
  productivity: { label: 'Productivity', icon: 'work', color: '#1652f0' },
  gaming: { label: 'Gaming', icon: 'sports_esports', color: '#8b5cf6' },
  news: { label: 'News & Media', icon: 'newspaper', color: '#f97316' },
  fitness: { label: 'Fitness', icon: 'fitness_center', color: '#10b981' },
  cloud: { label: 'Cloud Storage', icon: 'cloud', color: '#06b6d4' },
  music: { label: 'Music', icon: 'music_note', color: '#ec4899' },
  other: { label: 'Other', icon: 'apps', color: '#6b7280' },
};

