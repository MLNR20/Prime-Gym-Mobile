import * as Network from 'expo-network';
import { firestoreContactRepository } from './FirestoreContactRepository';
import type { Contact, NewContact } from '../models/Contact';
import type { Repository } from './Repository';
import { sqliteContactRepository } from './SqliteContactRepository';

/**
 * SQLite stays the source of truth for reads/updates/removes. A newly created contact is
 * additionally, best-effort mirrored to Firestore as a cloud backup — a Firestore failure is
 * logged but never blocks the local save.
 *
 * Before serving reads, any Firestore-only records (e.g. a fresh install restoring from a cloud
 * backup) are pulled down into SQLite first, via insertMissing so local edits/removals — which are
 * never mirrored back up to Firestore — are never overwritten. The pull is skipped, not retried,
 * when the device has no internet connection.
 */
export class MirroredContactRepository implements Repository<Contact, NewContact> {
    private async pullFromFirestore(): Promise<void> {
        try {
            const networkState = await Network.getNetworkStateAsync();
            if (!networkState.isConnected || networkState.isInternetReachable === false) {
                console.warn('Skipping Firestore pull: device is offline');
                return;
            }
            const cloudContacts = await firestoreContactRepository.getAll();
            await sqliteContactRepository.insertMissing(cloudContacts);
        } catch (error) {
            console.warn('Failed to pull contacts from Firestore', error);
        }
    }

    subscribe(onData: (items: Contact[]) => void, onError: (error: Error) => void): () => void {
        let cancelled = false;
        let unsubscribeSqlite: (() => void) | null = null;

        this.pullFromFirestore().finally(() => {
            if (!cancelled) {
                unsubscribeSqlite = sqliteContactRepository.subscribe(onData, onError);
            }
        });

        return () => {
            cancelled = true;
            unsubscribeSqlite?.();
        };
    }

    async getAll(): Promise<Contact[]> {
        await this.pullFromFirestore();
        return sqliteContactRepository.getAll();
    }

    async add(item: NewContact): Promise<Contact> {
        const contact = await sqliteContactRepository.add(item);
        firestoreContactRepository.set(contact).catch((error) => {
            console.warn('Failed to back up new contact to Firestore', error);
        });
        return contact;
    }

    update(id: string, changes: Partial<NewContact>): Promise<void> {
        return sqliteContactRepository.update(id, changes);
    }

    remove(id: string): Promise<void> {
        return sqliteContactRepository.remove(id);
    }
}

export const mirroredContactRepository = new MirroredContactRepository();
