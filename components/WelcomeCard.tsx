import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from 'react-native-paper';

export default function WelcomeCard({ membershipId }: { membershipId: string }) {
    const [visible, setVisible] = useState(true);

    return (
        <LinearGradient
            colors={['#F59E0B', '#FFC107']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
        >
            <View>
                <Text className="text-2xl font-poppins-bold text-black">Welcome back</Text>
                <Text className="text-base font-poppins" style={[styles.subtitle, styles.subtitleColor]}>
                    Prime-Gym Owner
                </Text>
            </View>
            <View style={styles.row}>
                <View>
                    <Text className="text-xs font-poppins text-black" style={styles.label}>
                        MEMBERSHIP ID
                    </Text>
                    <Text className="text-xl mt-2 font-poppins-semibold text-black">
                        {visible ? membershipId : ''}
                    </Text>
                </View>
                <Button
                    mode="outlined"
                    compact
                    textColor="#000000"
                    labelStyle={styles.buttonLabel}
                    contentStyle={styles.buttonContent}
                    style={styles.hideButton}
                    onPress={() => setVisible((prev) => !prev)}
                >
                    {visible ? 'Hide' : 'Show'}
                </Button>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    card: {
        width: '100%',
        marginTop: 12,
        borderRadius: 16,
        padding: 24,
        gap: 16,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    subtitle: {
        marginTop: 8,
    },
    subtitleColor: {
        color: '#5a3f00',
    },
    buttonLabel: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 12,
        letterSpacing: 1,
        marginVertical: 6,
        marginHorizontal: 12,
    },
    buttonContent: {
        height: 34,
    },
    label: {
        letterSpacing: 1,
        marginTop: 12,
    },
    hideButton: {
        borderColor: '#000000',
        borderRadius: 20,
        minWidth: 0,
    },
});
