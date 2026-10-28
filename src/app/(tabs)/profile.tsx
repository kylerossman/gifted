import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import type { UserProfile } from '@/types/user';

const sampleProfile: UserProfile = {
  id: '672a9b5b-8357-4575-9d8b-7ca732f4c1be',
  firstName: 'Jordan',
  lastName: 'Taylor',
  email: 'jordan@example.com',
  phoneNumber: '+14155552671',
  friendIds: [],
  createdAt: '2026-10-22T14:30:00Z',
  updatedAt: '2026-10-22T14:30:00Z',
};

function ProfileField({ label, value }: { label: string; value?: string }) {
  return (
    <View style={styles.field}>
      <ThemedText type="smallBold" themeColor="textSecondary">
        {label}
      </ThemedText>
      <ThemedText type="default">{value || 'Not provided'}</ThemedText>
    </View>
  );
}

export default function ProfileScreen() {
  const theme = useTheme();
  const displayName = `${sampleProfile.firstName} ${sampleProfile.lastName}`;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.pageTitle}>
            Profile
          </ThemedText>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.identity}>
            {sampleProfile.imageUrl ? (
              <Image
                source={{ uri: sampleProfile.imageUrl }}
                accessibilityLabel={`${displayName} profile picture`}
                contentFit="cover"
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <SymbolView
                  name={{ ios: 'person.fill', android: 'person', web: 'person' }}
                  tintColor={theme.textSecondary}
                  size={44}
                />
              </View>
            )}
            <ThemedText type="subtitle" style={styles.name}>
              {displayName}
            </ThemedText>
            <ThemedText type="small" style={styles.sampleBadge}>
              Sample profile · not connected to an account
            </ThemedText>
          </View>

          <ThemedView type="backgroundElement" style={styles.card}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Account details
            </ThemedText>
            <ProfileField label="Email" value={sampleProfile.email} />
            <ProfileField label="Phone" value={sampleProfile.phoneNumber} />
            <ProfileField label="Profile image" value={sampleProfile.imageUrl} />
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.card}>
            <View style={styles.friendsHeading}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Friends
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {sampleProfile.friendIds.length}
              </ThemedText>
            </View>
            <ThemedText type="default" themeColor="textSecondary">
              No connected users yet. Friend connections will be available when accounts are added.
            </ThemedText>
          </ThemedView>

          <ThemedText type="small" themeColor="textSecondary" style={styles.footerNote}>
            This page uses placeholder data. Profile editing, sign-in, and friend management are not
            connected yet.
          </ThemedText>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 12,
    paddingBottom: 8,
  },
  pageTitle: {
    fontSize: 36,
    lineHeight: 42,
  },
  content: {
    paddingTop: 20,
    paddingBottom: 32,
    gap: 20,
  },
  identity: {
    alignItems: 'center',
    paddingVertical: 12,
    gap: 10,
  },
  avatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
  },
  avatarPlaceholder: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(100, 150, 200, 0.15)',
  },
  name: {
    fontSize: 28,
    lineHeight: 36,
    textAlign: 'center',
  },
  sampleBadge: {
    opacity: 0.7,
    textAlign: 'center',
  },
  card: {
    padding: 20,
    borderRadius: 18,
    gap: 18,
  },
  sectionTitle: {
    fontSize: 22,
    lineHeight: 28,
  },
  field: {
    gap: 4,
  },
  friendsHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerNote: {
    textAlign: 'center',
    paddingHorizontal: 12,
  },
});
