import { rem } from '../utils/rem';

/**
 * The only place details-page text sizes are defined (DetailsHeader, DetailSection and DetailsScreenLayout all
 * read from here), so every details screen stays uniform.
 */
export const detailsTypography = {
    /** Name at the top of the first card. */
    title: { fontSize: rem(1.35), fontFamily: 'Poppins_700Bold' },
    /** Line under the name, e.g. a category or key code. */
    subtitle: { fontSize: rem(0.875), fontFamily: 'Poppins_400Regular' },
    /** Section heading, e.g. "Personal Information". */
    sectionTitle: { fontSize: rem(1), fontFamily: 'Poppins_700Bold' },
    /** Line under the section heading. */
    sectionDescription: { fontSize: rem(0.85), fontFamily: 'Poppins_400Regular' },
    /** Small field label, e.g. "Date Created". */
    label: { fontSize: rem(0.75), fontFamily: 'Poppins_600SemiBold' },
    /** Field value. */
    value: { fontSize: rem(1), fontFamily: 'Poppins_400Regular' },
    /** Hint under the Edit button. */
    footer: { fontSize: rem(0.75), fontFamily: 'Poppins_400Regular' },
} as const;
