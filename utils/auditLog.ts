import { auditLogRepository } from '../repositories/activeRepositories';
import { nowInPhilippineTime } from './dateTime';

/** Appends an entry to the audit log, e.g. logAudit('Juan Dela Cruz', 'Added new subscriber'). */
export function logAudit(reference: string, action: string) {
    const timestamp = nowInPhilippineTime();
    return auditLogRepository.add({ reference, action, date_created: timestamp, date_updated: timestamp });
}
