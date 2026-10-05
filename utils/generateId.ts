/** Locally-unique id for records created on-device (SQLite rows). Not for cross-device uniqueness. */
export function generateId(): string {
    return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}
