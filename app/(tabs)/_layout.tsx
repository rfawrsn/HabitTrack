import { StyleSheet, View } from 'react-native';
import { Tabs } from 'expo-router';
import { Camera, CalendarDays, House, ListChecks, UserRound } from 'lucide-react-native';
import { OfflineBanner } from '@/components/ui/OfflineBanner';
import { colors } from '@/constants/theme';

const ICON_SIZE = 24;

export default function TabLayout() {
  return (
    <View style={styles.container}>
      <OfflineBanner />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabLabel,
          tabBarHideOnKeyboard: true,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Beranda',
            tabBarIcon: ({ color }) => <House size={ICON_SIZE} color={color} />,
          }}
        />
        <Tabs.Screen
          name="habits"
          options={{
            title: 'Kebiasaan',
            tabBarIcon: ({ color }) => <ListChecks size={ICON_SIZE} color={color} />,
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: 'Riwayat',
            tabBarIcon: ({ color }) => <CalendarDays size={ICON_SIZE} color={color} />,
          }}
        />
        <Tabs.Screen
          name="camera"
          options={{
            title: 'Kamera',
            tabBarIcon: ({ color }) => <Camera size={ICON_SIZE} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profil',
            tabBarIcon: ({ color }) => <UserRound size={ICON_SIZE} color={color} />,
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    height: 68,
    paddingTop: 8,
    paddingBottom: 10,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});
