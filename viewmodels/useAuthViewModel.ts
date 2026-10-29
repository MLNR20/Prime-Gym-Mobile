import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import {
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
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
    'auth/user-disabled': 'This account has been disabled.',
    'auth/too-many-requests': 'Too many attempts. Try again in a few minutes.',
    'auth/network-request-failed': 'No connection. Check your internet and try again.',
    'auth/popup-blocked': 'The Google sign-in popup was blocked. Allow popups and try again.',
    'auth/account-exists-with-different-credential': 'An account with this email already exists. Log in with your password instead.',
    'auth/operation-not-allowed': 'Google sign-in is not enabled for this project yet.',
    'auth/unauthorized-domain': 'This domain is not authorized for Google sign-in in Firebase.',
};

// Closing the Google popup is a cancel, not an error worth showing.
const CANCELLED_CODES = new Set(['auth/popup-closed-by-user', 'auth/cancelled-popup-request']);

/** Signs in with email and password; throws an Error whose message is safe to show the user. */
export async function signInWithEmail(email: string, password: string): Promise<void> {
    try {
        await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
        const code = (err as { code?: string }).code ?? '';
        throw new Error(AUTH_ERROR_MESSAGES[code] ?? 'Could not sign in. Please try again.');
    }
}

/**
 * Signs in (or registers, for a first-time Google account) with Google through a Firebase popup.
 * Web only: native Google sign-in needs OAuth client IDs that this project doesn't have yet.
 * Throws an Error whose message is safe to show; resolves quietly when the user closes the popup.
 */
export async function signInWithGoogle(): Promise<void> {
    if (Platform.OS !== 'web') {
        throw new Error('Google sign-in is only available on the web version for now.');
    }
    try {
        await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (err) {
        const code = (err as { code?: string }).code ?? '';
        if (CANCELLED_CODES.has(code)) return;
        throw new Error(AUTH_ERROR_MESSAGES[code] ?? 'Could not sign in with Google. Please try again.');
    }
}

export function signOutUser() {
    return signOut(auth);
}
