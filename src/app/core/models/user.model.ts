export type UserRole = 'admin' | 'user';
export type PlanId = 'starter' | 'pro' | 'team' | 'enterprise';
export type BillingStatus = 'trial' | 'active' | 'past_due' | 'cancelled';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  onboardingCompleted: boolean;
  createdAt: Date;
  plan: PlanId;
  trialEndsAt: Date | null;
  billingStatus: BillingStatus;
  dashboardLayout?: DashboardWidget[];
}

export interface DashboardWidget {
  id: string;
  visible: boolean;
  order: number;
}
