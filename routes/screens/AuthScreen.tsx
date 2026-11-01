import { useState } from 'react';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';

// What a signed-out user sees: the login screen, with links to create an account or reset a password (and back).
export default function AuthScreen() {
    const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
    if (mode === 'signup') return <SignUpScreen onShowLogin={() => setMode('login')} />;
    if (mode === 'forgot') return <ForgotPasswordScreen onShowLogin={() => setMode('login')} />;
    return <LoginScreen onShowSignUp={() => setMode('signup')} onShowForgotPassword={() => setMode('forgot')} />;
}
