/** React Native has no rem unit; 1rem = 16px, matching the Tailwind classes used elsewhere, e.g. fontSize: rem(1.35). */
export const rem = (value: number): number => value * 16;
