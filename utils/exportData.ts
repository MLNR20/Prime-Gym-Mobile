import { Platform, Share } from 'react-native';
import type { Member } from '../models/Member';
import { summarizeFinance } from './finance';
import { getMemberStatus, MEMBER_STATUS_LABELS } from './memberStatus';

type Cell = string | number;

function csvCell(value: Cell): string {
    let text = String(value);
    // A leading = + - @ makes Excel and Sheets run the cell as a formula, so mark text cells as plain text.
    if (typeof value === 'string' && /^[=+\-@\t\r]/.test(text)) text = `'${text}`;
    return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function toCsv(headers: string[], rows: Cell[][]): string {
    return [headers, ...rows].map((row) => row.map(csvCell).join(',')).join('\r\n');
}

/** Every subscriber, including removed ones (status "Inactive"). */
export function buildSubscribersCsv(members: Member[]): { csv: string; count: number } {
    const rows = members.map((member) => [
        member.first_name,
        member.last_name,
        member.plan,
        MEMBER_STATUS_LABELS[getMemberStatus(member)],
        member.payment_date,
        member.payment_amount ?? 0,
        member.subscription_expiration_date,
        member.date_created,
    ]);
    const headers = ['First Name', 'Last Name', 'Plan', 'Status', 'Payment Date', 'Payment Amount', 'Subscription Expiration Date', 'Date Created'];
    return { csv: toCsv(headers, rows), count: rows.length };
}

/** One row per subscriber's payment (the same payments the Finance screen adds up), newest first. */
export function buildPaymentsCsv(members: Member[]): { csv: string; count: number } {
    const rows = summarizeFinance(members).payments.map((member) => [
        member.payment_date,
        `${member.first_name} ${member.last_name}`.trim(),
        member.plan,
        member.payment_amount ?? 0,
    ]);
    return { csv: toCsv(['Payment Date', 'Subscriber', 'Plan', 'Amount'], rows), count: rows.length };
}

/** Downloads the CSV in a browser, or opens the share sheet on a phone. */
export async function exportCsv(filename: string, csv: string): Promise<void> {
    if (Platform.OS === 'web') {
        const doc = (globalThis as any).document;
        // The BOM makes Excel read the file as UTF-8, so names with accents survive.
        const blob = new Blob(['﻿', csv], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = doc.createElement('a');
        link.href = url;
        link.download = filename;
        doc.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        return;
    }
    await Share.share({ title: filename, message: csv });
}
