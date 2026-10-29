import { auditLogRepository } from '../repositories/activeRepositories';
import { nowInPhilippineTime } from './dateTime';
import { notify } from './notify';

/**
 * Appends an entry to the audit log, e.g. logAudit('Juan Dela Cruz', 'Added new subscriber'),
 * and drops the same event into the inbox as a notification.
 */
export async function logAudit(reference: string, action: string) {
    const timestamp = nowInPhilippineTime();
    const entry = await auditLogRepository.add({ reference, action, date_created: timestamp, date_updated: timestamp });
    await notify(action, reference);
    return entry;
}
