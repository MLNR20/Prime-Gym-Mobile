/** Formats an amount in Philippine pesos for display, e.g. "₱1,500.00". */
export function formatPeso(amount: number): string {
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
}
