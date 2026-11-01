import { useEffect, useState } from 'react';
import {
    EmailAuthProvider,
    onAuthStateChanged,
    reauthenticateWithCredential,
    sendPasswordResetEmail,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updatePassword,
    updateProfile,
    type User,
} from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

/** The signed-in Firebase user (null when signed out); `initializing` stays true until Firebase restores the saved session. */
export function useAuthUser() {
    const [user, setUser] = useState<User | null>(null);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        return onAuthStateChanged(auth, (nextUser) => {
            setUser(nextUser);
            setInitializing(false);
        });
    }, []);

    return { user, initializing };
}

const AUTH_ERROR_MESSAGES: Record<string, string> = {
    'auth/invalid-credential': 'Incorrect email or password.',
    'auth/wrong-password': 'Incorrect email or password.',
    'auth/user-not-found': 'Incorrect email or password.',
    'auth/invalid-email': 'Enter a valid email address.',
    'auth/email-already-in-use': 'An account with this email already exists. Log in instead.',
    'auth/weak-password': 'Choose a stronger password (at least 6 characters).',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/too-many-requests': 'Too many attempts. Try again in a few minutes.',
    'auth/network-request-failed': 'No connection. Check your internet and try again.',
    'auth/operation-not-allowed': 'Email/password sign-in is not enabled for this Firebase project.',
};

/** Signs in with email and password; throws an Error whose message is safe to show the user. */
export async function signInWithEmail(email: string, password: string): Promise<void> {
    try {
        await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
        const code = (err as { code?: string }).code ?? '';
        console.warn('[auth]', code, (err as Error).message);
        throw new Error(AUTH_ERROR_MESSAGES[code] ?? 'Could not sign in. Please try again.');
    }
}

/**
 * Emails a password-reset link. Firebase doesn't reveal whether the address has an account, so a missing
 * account isn't an error here. Throws an Error whose message is safe to show.
 */
export async function sendPasswordReset(email: string): Promise<void> {
    try {
        await sendPasswordResetEmail(auth, email.trim());
    } catch (err) {
        const code = (err as { code?: string }).code ?? '';
        console.warn('[auth]', code, (err as Error).message);
        if (code === 'auth/user-not-found') return;
        throw new Error(AUTH_ERROR_MESSAGES[code] ?? 'Could not send the reset email. Please try again.');
    }
}

/** Creates an email/password account and saves the name; signs the new user in. Throws an Error that is safe to show. */
export async function signUpWithEmail(name: string, email: string, password: string): Promise<void> {
    try {
        const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        await updateProfile(credential.user, { displayName: name.trim() });
    } catch (err) {
        const code = (err as { code?: string }).code ?? '';
        console.warn('[auth]', code, (err as Error).message);
        throw new Error(AUTH_ERROR_MESSAGES[code] ?? 'Could not create your account. Please try again.');
    }
}

/** Saves the signed-in user's display name. Throws an Error whose message is safe to show. */
export async function updateDisplayName(name: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error('You are signed out. Log in again.');
    try {
        await updateProfile(user, { displayName: name.trim() });
    } catch (err) {
        const code = (err as { code?: string }).code ?? '';
        console.warn('[auth]', code, (err as Error).message);
        throw new Error(AUTH_ERROR_MESSAGES[code] ?? 'Could not update your profile. Please try again.');
    }
}

/** Re-checks the current password, then sets a new one. Throws an Error whose message is safe to show. */
export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const user = auth.currentUser;
    if (!user?.email) throw new Error('You are signed out. Log in again.');
    try {
        await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, currentPassword));
        await updatePassword(user, newPassword);
    } catch (err) {
        const code = (err as { code?: string }).code ?? '';
        console.warn('[auth]', code, (err as Error).message);
        if (code === 'auth/invalid-credential' || code === 'auth/wrong-password') {
            throw new Error('Your current password is incorrect.');
        }
        if (code === 'auth/requires-recent-login') {
            throw new Error('For security, log out and log in again, then change your password.');
        }
        throw new Error(AUTH_ERROR_MESSAGES[code] ?? 'Could not change your password. Please try again.');
    }
}

export function signOutUser() {
    return signOut(auth);
}
