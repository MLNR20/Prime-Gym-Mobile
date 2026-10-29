// One-off seed script: writes 10 sample subscriber (Member) records directly to Firestore.
// Usage: node --env-file=.env scripts/seedSubscribers.mjs
import { initializeApp } from 'firebase/app';
import { collection, doc, getFirestore, setDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

if (!firebaseConfig.projectId) {
    throw new Error('Missing EXPO_PUBLIC_FIREBASE_* env vars. Run with: node --env-file=.env scripts/seedSubscribers.mjs');
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function philippineTimestamp(date) {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Manila',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    }).formatToParts(date);
    const value = (type) => parts.find((part) => part.type === type)?.value ?? '00';
    return `${value('year')}-${value('month')}-${value('day')}T${value('hour')}:${value('minute')}:${value('second')}+08:00`;
}

function dateOnly(date) {
    return date.toISOString().slice(0, 10);
}

function generateId() {
    return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

const PLANS = ['Basic', 'Standard', 'Premium'];
const PLAN_AMOUNTS = { Basic: 500, Standard: 800, Premium: 1200 };

const SUBSCRIBERS = [
    ['Juan', 'Dela Cruz'],
    ['Maria', 'Santos'],
    ['Jose', 'Reyes'],
    ['Ana', 'Garcia'],
    ['Pedro', 'Bautista'],
    ['Carmen', 'Mendoza'],
    ['Ramon', 'Torres'],
    ['Elena', 'Flores'],
    ['Miguel', 'Ramos'],
    ['Sofia', 'Aquino'],
];

const now = new Date();
const createdTimestamp = philippineTimestamp(now);

const members = SUBSCRIBERS.map(([firstName, lastName], index) => {
    const paymentDate = new Date(now);
    paymentDate.setDate(paymentDate.getDate() - index);
    const expirationDate = new Date(paymentDate);
    expirationDate.setMonth(expirationDate.getMonth() + 1);

    return {
        id: generateId(),
        first_name: firstName,
        last_name: lastName,
        payment_date: dateOnly(paymentDate),
        payment_amount: PLAN_AMOUNTS[PLANS[index % PLANS.length]],
        subscription_expiration_date: dateOnly(expirationDate),
        plan: PLANS[index % PLANS.length],
        date_created: createdTimestamp,
        date_updated: createdTimestamp,
        is_deleted: false,
    };
});

const membersCollection = collection(db, 'members');

for (const { id, ...data } of members) {
    await setDoc(doc(membersCollection, id), data);
    console.log(`Seeded ${data.first_name} ${data.last_name} (${id})`);
}

console.log(`\nDone. Seeded ${members.length} subscriber records to Firestore.`);
process.exit(0);
