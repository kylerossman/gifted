import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { giftedDataSource, isUsingMockData } from '@/services/data-source';
import type { Group } from '@/types/group';

/**
 * Home screen displays groups from the configured data source.
 */
export default function HomeScreen() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchGroups = useCallback(async () => {
    return giftedDataSource.getGroups();
  }, []);

  useEffect(() => {
    let isActive = true;

    fetchGroups()
      .then((result) => {
        if (isActive) setGroups(result);
      })
      .catch(() => {
        if (isActive) {
          setErrorMessage('Could not load groups. Check the backend connection and try again.');
        }
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [fetchGroups]);

  const handleRetry = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      setGroups(await fetchGroups());
    } catch {
      setErrorMessage('Could not load groups. Check the backend connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [fetchGroups]);

  const renderGroupCard = ({ item }: { item: Group }) => (
    <Pressable style={styles.groupCard}>
      <ThemedText type="subtitle" style={styles.groupName}>
        {item.name}
      </ThemedText>
      <ThemedText type="default" style={styles.groupInfo}>
        {item.groupType === 'event' ? '🎉 Event' : '👤 Person'} • {item.giftCount ?? 0}{' '}
        {(item.giftCount ?? 0) === 1 ? 'gift' : 'gifts'}
      </ThemedText>
    </Pressable>
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <ThemedText type="title">🎁 Gifted</ThemedText>
          <ThemedText type="default" style={styles.subtitle}>
            Track gift ideas
          </ThemedText>
          {isUsingMockData && (
            <ThemedText type="small" style={styles.sourceNote}>
              Showing sample groups. Set EXPO_PUBLIC_DATA_SOURCE=rest to use the backend.
            </ThemedText>
          )}
        </View>

        <FlatList
          data={groups}
          renderItem={renderGroupCard}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            isLoading ? (
              <View style={styles.messageContainer}>
                <ActivityIndicator accessibilityLabel="Loading groups" />
                <ThemedText type="default" style={styles.messageText}>
                  Loading groups...
                </ThemedText>
              </View>
            ) : errorMessage ? (
              <View style={styles.messageContainer}>
                <ThemedText type="default" style={styles.messageText}>
                  {errorMessage}
                </ThemedText>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => void handleRetry()}
                  style={styles.retryButton}>
                  <ThemedText type="default">Try again</ThemedText>
                </Pressable>
              </View>
            ) : (
              <View style={styles.messageContainer}>
                <ThemedText type="default" style={styles.messageText}>
                  No groups yet. Your groups will appear here.
                </ThemedText>
              </View>
            )
          }
        />
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
    paddingHorizontal: 16,
  },
  header: {
    marginVertical: 16,
  },
  subtitle: {
    marginTop: 4,
    opacity: 0.7,
  },
  sourceNote: {
    marginTop: 8,
    opacity: 0.7,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 16,
  },
  groupCard: {
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(100, 150, 200, 0.1)',
    borderLeftWidth: 4,
    borderLeftColor: '#6496c8',
  },
  groupName: {
    marginBottom: 4,
  },
  groupInfo: {
    opacity: 0.7,
    fontSize: 12,
  },
  messageContainer: {
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  messageText: {
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(100, 150, 200, 0.15)',
  },
});
