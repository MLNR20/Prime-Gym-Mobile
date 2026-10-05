import type { Persistence } from 'firebase/auth';

// firebase@12's "firebase/auth" package.json exports map has no "react-native" branch of its
// own (only "@firebase/auth" does), so TypeScript's package-exports resolution never reaches the
// React Native typings even with `customConditions: ["react-native"]` set — Metro/Babel still
// resolve the real runtime export correctly, this augmentation just restores the type for tsc.
declare module 'firebase/auth' {
    export function getReactNativePersistence(storage: unknown): Persistence;
}
