import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type GymProfile = {
    name: string;
    email: string;
    phone: string;
    address: string;
};

const STORAGE_KEY = 'gym-profile';

export const DEFAULT_GYM_PROFILE: GymProfile = { name: 'Prime Gym', email: '', phone: '', address: '' };

export async function loadGymProfile(): Promise<GymProfile> {
    try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        return raw ? { ...DEFAULT_GYM_PROFILE, ...JSON.parse(raw) } : DEFAULT_GYM_PROFILE;
    } catch {
        return DEFAULT_GYM_PROFILE;
    }
}

export async function saveGymProfile(profile: GymProfile): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

/** The saved gym profile; pass a value that changes (e.g. whether a screen is focused) to reload it. */
export function useGymProfile(reloadKey?: unknown): GymProfile {
    const [profile, setProfile] = useState<GymProfile>(DEFAULT_GYM_PROFILE);

    useEffect(() => {
        let cancelled = false;
        loadGymProfile().then((loaded) => {
            if (!cancelled) setProfile(loaded);
        });
        return () => {
            cancelled = true;
        };
    }, [reloadKey]);

    return profile;
}
