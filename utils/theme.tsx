import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ColorScheme = 'light' | 'dark';

export type Palette = {
    /** Screen and card background. */
    background: string;
    /** Gray-filled surfaces: list cards, inputs, icon tiles. */
    surface: string;
    border: string;
    divider: string;
    /** Primary text and icons. */
    text: string;
    bodyText: string;
    inputText: string;
    muted: string;
    subtle: string;
    iconMuted: string;
    /** Accent-tinted secondary text (descriptions under titles). */
    brown: string;
    danger: string;
    dangerText: string;
    dangerBg: string;
    ok: string;
    okText: string;
    okBg: string;
    warnText: string;
    warnBg: string;
};

const LIGHT: Palette = {
    background: '#FFFFFF',
    surface: '#F2F5F7',
    border: '#EDF0F2',
    divider: '#E5E7EB',
    text: '#000000',
    bodyText: '#374151',
    inputText: '#111827',
    muted: '#6B7280',
    subtle: '#9CA3AF',
    iconMuted: '#C4C7CC',
    brown: '#5C4300',
    danger: '#DC2626',
    dangerText: '#B91C1C',
    dangerBg: '#FEE2E2',
    ok: '#15803D',
    okText: '#166534',
    okBg: '#DCFCE7',
    warnText: '#B45309',
    warnBg: '#FEF3C7',
};

const DARK: Palette = {
    background: '#121212',
    surface: '#1E2025',
    border: '#2C2F36',
    divider: '#2C2F36',
    text: '#F9FAFB',
    bodyText: '#E5E7EB',
    inputText: '#F3F4F6',
    muted: '#9CA3AF',
    subtle: '#6B7280',
    iconMuted: '#4B5563',
    brown: '#D6B97A',
    danger: '#F87171',
    dangerText: '#F87171',
    dangerBg: '#3A1515',
    ok: '#4ADE80',
    okText: '#4ADE80',
    okBg: '#10281A',
    warnText: '#FCD34D',
    warnBg: '#33260A',
};

/**
 * The colors currently in effect. Styles read it when they are built, and the app remounts when the scheme
 * changes (see ThemeProvider and themedStyles), so a plain mutable object is enough: no per-component hooks.
 */
export const palette: Palette = { ...LIGHT };

let version = 0;

function applyScheme(scheme: ColorScheme) {
    Object.assign(palette, scheme === 'dark' ? DARK : LIGHT);
    version += 1;
}

/**
 * A StyleSheet whose factory re-runs after the scheme changes, so `palette.*` inside it is always current.
 * Use in place of a bare `StyleSheet.create(...)`: `themedStyles(() => StyleSheet.create({ ... }))`.
 */
export function themedStyles<T extends object>(factory: () => T): T {
    let cached: T | null = null;
    let cachedVersion = -1;
    const current = (): T => {
        if (!cached || cachedVersion !== version) {
            cached = factory();
            cachedVersion = version;
        }
        return cached;
    };
    return new Proxy({} as T, {
        get: (_, key) => (current() as Record<string | symbol, unknown>)[key],
        has: (_, key) => key in current(),
        ownKeys: () => Reflect.ownKeys(current()),
        getOwnPropertyDescriptor: (_, key) => {
            const descriptor = Reflect.getOwnPropertyDescriptor(current(), key);
            return descriptor ? { ...descriptor, configurable: true } : undefined;
        },
    });
}

const STORAGE_KEY = 'color-scheme';

type ThemeContextValue = {
    scheme: ColorScheme;
    isDark: boolean;
    setScheme: (scheme: ColorScheme) => void;
};

const ThemeContext = createContext<ThemeContextValue>({ scheme: 'light', isDark: false, setScheme: () => {} });

/** Restores the saved scheme before anything renders, then lets Settings flip it. Consumers re-render on change. */
export function ThemeProvider({ children }: { children: ReactNode }) {
    const [scheme, setSchemeState] = useState<ColorScheme>('light');
    const [ready, setReady] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem(STORAGE_KEY)
            .then((saved) => {
                const restored: ColorScheme = saved === 'dark' ? 'dark' : 'light';
                applyScheme(restored);
                setSchemeState(restored);
            })
            .catch(() => {})
            .finally(() => setReady(true));
    }, []);

    const setScheme = useCallback((next: ColorScheme) => {
        applyScheme(next);
        setSchemeState(next);
        AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
    }, []);

    const value = useMemo(() => ({ scheme, isDark: scheme === 'dark', setScheme }), [scheme, setScheme]);

    if (!ready) return null;
    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
    return useContext(ThemeContext);
}
