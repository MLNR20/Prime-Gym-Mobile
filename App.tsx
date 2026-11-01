import './global.css';
import { Fragment } from 'react';
import { StatusBar } from 'expo-status-bar';
import { DarkTheme, NavigationContainer, type NavigationState } from '@react-navigation/native';
import { MD3DarkTheme, PaperProvider, configureFonts } from 'react-native-paper';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
} from '@expo-google-fonts/poppins';
import BottomTabs from './routes/BottomTabs';
import AuthScreen from './routes/screens/AuthScreen';
import { ThemeProvider, palette, useAppTheme } from './utils/theme';
import { useAuthUser } from './viewmodels/useAuthViewModel';

// Every react-native-paper component (text, inputs, buttons, menus) falls back to Poppins.
// Only fonts are overridden, so Paper keeps its default colors.
const fonts = configureFonts({ config: { fontFamily: 'Poppins_400Regular' } });
const lightTheme = { fonts };

// Dark mode uses Paper's dark colors, with its surfaces swapped for the app's own dark palette.
function buildDarkTheme() {
  const surface = palette.surface;
  return {
    ...MD3DarkTheme,
    fonts,
    colors: {
      ...MD3DarkTheme.colors,
      background: palette.background,
      surface,
      surfaceVariant: surface,
      onSurface: palette.text,
      onSurfaceVariant: palette.muted,
      elevation: { level0: 'transparent', level1: surface, level2: surface, level3: surface, level4: surface, level5: surface },
    },
  };
}

function buildNavigationTheme() {
  return {
    ...DarkTheme,
    colors: { ...DarkTheme.colors, background: palette.background, card: palette.background, border: palette.divider, text: palette.text },
  };
}

// Kept outside the component so the tab you were on survives the remount that applying a new color scheme causes.
let savedNavigationState: NavigationState | undefined;

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const { scheme, isDark } = useAppTheme();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });

  const { user, initializing } = useAuthUser();

  // Wait for fonts and for Firebase to restore a saved session, so a signed-in user never sees a login flash.
  if (!fontsLoaded || initializing) {
    return null;
  }

  if (!user) savedNavigationState = undefined;

  // Styles read the palette when they are built, so a new scheme needs a fresh tree (keyed by the scheme).
  return (
    <Fragment key={scheme}>
      <PaperProvider theme={isDark ? buildDarkTheme() : lightTheme}>
        {user ? (
          <NavigationContainer
            theme={isDark ? buildNavigationTheme() : undefined}
            initialState={savedNavigationState}
            onStateChange={(state) => {
              savedNavigationState = state;
            }}
          >
            <BottomTabs />
          </NavigationContainer>
        ) : (
          <AuthScreen />
        )}
        <StatusBar style={isDark ? 'light' : 'dark'} translucent />
      </PaperProvider>
    </Fragment>
  );
}
