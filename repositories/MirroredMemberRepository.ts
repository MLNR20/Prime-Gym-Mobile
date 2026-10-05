import * as Network from 'expo-network';
import { firestoreMemberRepository } from './FirestoreMemberRepository';
import type { Member, NewMember } from '../models/Member';
import type { Repository } from './Repository';
import { sqliteMemberRepository } from './SqliteMemberRepository';

/**
 * SQLite stays the source of truth for reads/updates/removes. A newly created member (i.e. a new
 * subscription) is additionally, best-effort mirrored to Firestore as a cloud backup — a Firestore
 * failure is logged but never blocks the local save.
 *
 * Before serving reads, any Firestore-only records (e.g. a fresh install restoring from a cloud
 * backup) are pulled down into SQLite first, via insertMissing so local edits/removals — which are
 * never mirrored back up to Firestore — are never overwritten. The pull is skipped, not retried,
 * when the device has no internet connection.
 */
export class MirroredMemberRepository implements Repository<Member, NewMember> {
    private async pullFromFirestore(): Promise<void> {
        try {
            const networkState = await Network.getNetworkStateAsync();
            if (!networkState.isConnected || networkState.isInternetReachable === false) {
                console.warn('Skipping Firestore pull: device is offline');
                return;
            }
            const cloudMembers = await firestoreMemberRepository.getAll();
            await sqliteMemberRepository.insertMissing(cloudMembers);
        } catch (error) {
            console.warn('Failed to pull members from Firestore', error);
        }
    }

    subscribe(onData: (items: Member[]) => void, onError: (error: Error) => void): () => void {
        let cancelled = false;
        let unsubscribeSqlite: (() => void) | null = null;

        this.pullFromFirestore().finally(() => {
            if (!cancelled) {
                unsubscribeSqlite = sqliteMemberRepository.subscribe(onData, onError);
            }
        });

        return () => {
            cancelled = true;
            unsubscribeSqlite?.();
        };
    }

    async getAll(): Promise<Member[]> {
        await this.pullFromFirestore();
        return sqliteMemberRepository.getAll();
    }

    async add(item: NewMember): Promise<Member> {
        const member = await sqliteMemberRepository.add(item);
        firestoreMemberRepository.set(member).catch((error) => {
            console.warn('Failed to back up new member to Firestore', error);
        });
        return member;
    }

    update(id: string, changes: Partial<NewMember>): Promise<void> {
        return sqliteMemberRepository.update(id, changes);
    }

    remove(id: string): Promise<void> {
        return sqliteMemberRepository.remove(id);
    }
}

export const mirroredMemberRepository = new MirroredMemberRepository();
