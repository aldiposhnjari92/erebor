import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  Timestamp,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Subscription } from '../models/subscription.model';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  private firestore = inject(Firestore);

  /** Real-time stream of all subscriptions for a user. Uses raw onSnapshot to avoid
   *  AngularFire's collectionData injection-context requirement. */
  list$(uid: string): Observable<Subscription[]> {
    return new Observable<Subscription[]>((subscriber) => {
      const col = collection(this.firestore, `users/${uid}/subscriptions`);
      const unsubscribe = onSnapshot(
        col,
        (snapshot) => {
          const subs = snapshot.docs.map((d) => {
            const data = d.data();
            return {
              ...data,
              id: d.id,
              nextRenewal: (data['nextRenewal'] as Timestamp).toDate(),
              startedAt: (data['startedAt'] as Timestamp).toDate(),
            } as Subscription;
          });
          subscriber.next(subs);
        },
        (err) => subscriber.error(err),
      );
      return () => unsubscribe();
    });
  }

  async add(uid: string, sub: Omit<Subscription, 'id'>): Promise<void> {
    const col = collection(this.firestore, `users/${uid}/subscriptions`);
    await addDoc(col, {
      ...sub,
      nextRenewal: Timestamp.fromDate(sub.nextRenewal),
      startedAt: Timestamp.fromDate(sub.startedAt),
    });
  }

  async update(uid: string, id: string, changes: Partial<Omit<Subscription, 'id'>>): Promise<void> {
    const ref = doc(this.firestore, `users/${uid}/subscriptions/${id}`);
    const data: Record<string, unknown> = { ...changes };
    if (changes.nextRenewal) data['nextRenewal'] = Timestamp.fromDate(changes.nextRenewal);
    if (changes.startedAt) data['startedAt'] = Timestamp.fromDate(changes.startedAt);
    await updateDoc(ref, data);
  }

  async remove(uid: string, id: string): Promise<void> {
    const ref = doc(this.firestore, `users/${uid}/subscriptions/${id}`);
    await deleteDoc(ref);
  }
}
