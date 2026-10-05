const PHILIPPINE_TIME_ZONE = 'Asia/Manila';

/** ISO-8601 timestamp (with +08:00 offset) for the current instant in Philippine Standard Time. */
export function nowInPhilippineTime(): string {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: PHILIPPINE_TIME_ZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    }).formatToParts(new Date());

    const value = (type: Intl.DateTimeFormatPartTypes) =>
        parts.find((part) => part.type === type)?.value ?? '00';

    return `${value('year')}-${value('month')}-${value('day')}T${value('hour')}:${value('minute')}:${value('second')}+08:00`;
}

/** Formats an ISO timestamp for display in Philippine Standard Time, e.g. "Sep 5, 2026, 2:23 PM". */
export function formatPhilippineTimestamp(isoTimestamp: string): string {
    const date = new Date(isoTimestamp);
    if (Number.isNaN(date.getTime())) return isoTimestamp;
    return new Intl.DateTimeFormat('en-PH', {
        timeZone: PHILIPPINE_TIME_ZONE,
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(date);
}

/** Formats a plain "YYYY-MM-DD" date (no time component) for display, e.g. "Sep 5, 2026". */
export function formatDateOnly(dateString: string): string {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium' }).format(date);
}
