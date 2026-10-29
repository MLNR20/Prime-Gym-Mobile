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

  if (!fontsLoaded) {
    return null;
  }

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <BottomTabs />
        <StatusBar style="dark" translucent />
      </NavigationContainer>
    </PaperProvider>
  );
}
