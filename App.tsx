import './global.css';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider, configureFonts } from 'react-native-paper';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
} from '@expo-google-fonts/poppins';
import BottomTabs from './routes/BottomTabs';
import LoginScreen from './routes/screens/LoginScreen';
import { useAuthUser } from './viewmodels/useAuthViewModel';

// Every react-native-paper component (text, inputs, buttons, menus) falls back to Poppins.
// Only fonts are overridden, so Paper keeps its default colors.
const theme = { fonts: configureFonts({ config: { fontFamily: 'Poppins_400Regular' } }) };

export default function App() {
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

  return (
    <PaperProvider theme={theme}>
      {user ? (
        <NavigationContainer>
          <BottomTabs />
        </NavigationContainer>
      ) : (
        <LoginScreen />
      )}
      <StatusBar style="dark" translucent />

    </PaperProvider>
  );
}
