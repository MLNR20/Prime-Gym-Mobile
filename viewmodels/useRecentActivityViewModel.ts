import { useEffect, useState } from 'react';
import type { AuditLog } from '../models/AuditLog';
import { auditLogRepository } from '../repositories/activeRepositories';

const RECENT_ACTIVITY_LIMIT = 3;

export function useRecentActivityViewModel() {
    const [entries, setEntries] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = auditLogRepository.subscribe(
            (data) => {
                setEntries(data.slice(0, RECENT_ACTIVITY_LIMIT));
                setLoading(false);
            },
            (err) => {
                setError(err.message);
                setLoading(false);
            }
        );
        return unsubscribe;
    }, []);

    return { entries, loading, error };
}
