const PHILIPPINE_TIME_ZONE = 'Asia/Manila';

function philippineParts(date: Date) {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: PHILIPPINE_TIME_ZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    }).formatToParts(date);

    const value = (type: Intl.DateTimeFormatPartTypes) =>
        parts.find((part) => part.type === type)?.value ?? '00';

    return {
        year: value('year'),
        month: value('month'),
        day: value('day'),
        // Some engines render midnight as "24" under hour12: false.
        hour: value('hour') === '24' ? '00' : value('hour'),
        minute: value('minute'),
        second: value('second'),
    };
}

/** ISO-8601 timestamp (with +08:00 offset) for the current instant in Philippine Standard Time. */
export function nowInPhilippineTime(): string {
    const { year, month, day, hour, minute, second } = philippineParts(new Date());
    return `${year}-${month}-${day}T${hour}:${minute}:${second}+08:00`;
}

/** Text-input form of an ISO timestamp in Philippine time ("YYYY-MM-DD HH:mm"); '' stays ''. */
export function toInputTimestamp(isoTimestamp: string): string {
    if (!isoTimestamp) return '';
    const date = new Date(isoTimestamp);
    if (Number.isNaN(date.getTime())) return isoTimestamp;
    const { year, month, day, hour, minute } = philippineParts(date);
    return `${year}-${month}-${day} ${hour}:${minute}`;
}

/** Parses "YYYY-MM-DD HH:mm" (Philippine time) into an ISO timestamp, or null if it is not valid. */
export function fromInputTimestamp(text: string): string | null {
    const match = text.trim().match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})$/);
    if (!match) return null;
    const iso = `${match[1]}-${match[2]}-${match[3]}T${match[4]}:${match[5]}:00+08:00`;
    return Number.isNaN(new Date(iso).getTime()) ? null : iso;
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
