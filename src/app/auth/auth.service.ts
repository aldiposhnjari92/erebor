import { Injectable, inject, signal, computed, Injector, runInInjectionContext } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from '@angular/fire/auth';
import type { User } from '@angular/fire/auth';
import {
  Firestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from '@angular/fire/firestore';
import { AppUser } from '../core/models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);
  private injector = inject(Injector);

  private _user = signal<AppUser | null>(null);
  private _loading = signal(true);

  readonly user = this._user.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);
  readonly isAdmin = computed(() => this._user()?.role === 'admin');
  readonly needsOnboarding = computed(
    () => this._user() !== null && !this._user()?.onboardingCompleted,
  );
  readonly trialDaysLeft = computed(() => {
    const t = this._user()?.trialEndsAt;
    if (!t) return 0;
    return Math.max(0, Math.ceil((t.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
  });

  constructor() {
    onAuthStateChanged(this.auth, (firebaseUser) => {
      runInInjectionContext(this.injector, async () => {
        if (!firebaseUser) {
          this._user.set(null);
          this._loading.set(false);
          return;
        }
        const appUser = await this.loadOrCreateProfile(firebaseUser);
        this._user.set(appUser);
        this._loading.set(false);
      });
    });
  }

  async signInWithGoogle(): Promise<void> {
    const credential = await signInWithPopup(this.auth, new GoogleAuthProvider());
    const appUser = await this.loadOrCreateProfile(credential.user);
    this._user.set(appUser);
    this.router.navigate(['/dashboard']);
  }

  async signInWithEmail(email: string, password: string): Promise<void> {
    const credential = await signInWithEmailAndPassword(this.auth, email, password);
    const appUser = await this.loadOrCreateProfile(credential.user);
    this._user.set(appUser);
    this.router.navigate(['/dashboard']);
  }

  async signUpWithEmail(email: string, password: string, displayName: string): Promise<void> {
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);
    await updateProfile(credential.user, { displayName });
    const appUser = await this.loadOrCreateProfile({ ...credential.user, displayName });
    this._user.set(appUser);
    this.router.navigate(['/dashboard']);
  }

  async sendPasswordReset(email: string): Promise<void> {
    await sendPasswordResetEmail(this.auth, email);
  }

  async signOut(): Promise<void> {
    await signOut(this.auth);
    this._user.set(null);
    this.router.navigate(['/login']);
  }

  completeOnboarding(): void {
    const current = this._user();
    if (!current) return;
    this._user.set({ ...current, onboardingCompleted: true });
    const ref = doc(this.firestore, `users/${current.uid}`);
    updateDoc(ref, { onboardingCompleted: true }).catch(console.error);
  }

  private async loadOrCreateProfile(firebaseUser: User | (User & { displayName: string })): Promise<AppUser> {
    const ref = doc(this.firestore, `users/${firebaseUser.uid}`);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data();
      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        role: data['role'] ?? 'user',
        onboardingCompleted: data['onboardingCompleted'] ?? false,
        createdAt: (data['createdAt'] as Timestamp)?.toDate() ?? new Date(),
        plan: data['plan'] ?? 'pro',
        trialEndsAt: (data['trialEndsAt'] as Timestamp)?.toDate() ?? null,
        billingStatus: data['billingStatus'] ?? 'trial',
      };
    }

    // First-ever login — create the profile document
    const trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    await setDoc(ref, {
      role: 'user',
      onboardingCompleted: false,
      createdAt: serverTimestamp(),
      plan: 'pro',
      trialEndsAt: Timestamp.fromDate(trialEndsAt),
      billingStatus: 'trial',
    });

    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      role: 'user',
      onboardingCompleted: false,
      createdAt: new Date(),
      plan: 'pro',
      trialEndsAt,
      billingStatus: 'trial',
    };
  }
}
