import { Image } from 'expo-image';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import type { GiftIdea } from '@/types/gift';
import type { Person } from '@/types/person';

type PersonDetailModalProps = {
  person: Person | null;
  giftIdeas: GiftIdea[];
  isLoadingGiftIdeas: boolean;
  giftIdeasError: string | null;
  onClose: () => void;
  onRetryGiftIdeas: () => void;
};

function formatPrice(amountMinor: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(
      amountMinor / 100
    );
  } catch {
    return `${currency} ${(amountMinor / 100).toFixed(2)}`;
  }
}

function PersonPortrait({ person }: { person: Person }) {
  const [imageFailed, setImageFailed] = useState(false);

  if (!person.imageUrl || imageFailed) {
    return (
      <View style={styles.portraitPlaceholder} accessibilityElementsHidden>
        <ThemedText style={styles.placeholderIcon}>👤</ThemedText>
      </View>
    );
  }

  return (
    <Image
      source={{ uri: person.imageUrl }}
      accessibilityLabel={`${person.firstName} ${person.lastName}`}
      contentFit="cover"
      onError={() => setImageFailed(true)}
      style={styles.portrait}
    />
  );
}

export function PersonDetailModal({
  person,
  giftIdeas,
  isLoadingGiftIdeas,
  giftIdeasError,
  onClose,
  onRetryGiftIdeas,
}: PersonDetailModalProps) {
  return (
    <Modal
      visible={person !== null}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent>
      <View style={styles.backdrop}>
        <ThemedView accessibilityViewIsModal style={styles.dialog}>
          <View style={styles.header}>
            <ThemedText type="subtitle" style={styles.title}>
              Person details
            </ThemedText>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close person details"
              onPress={onClose}
              style={styles.closeButton}>
              <ThemedText type="default" style={styles.closeText}>
                Close
              </ThemedText>
            </Pressable>
          </View>

          {person && (
            <ScrollView contentContainerStyle={styles.content}>
              <PersonPortrait key={person.id} person={person} />

              <ThemedText type="subtitle" style={styles.personName}>
                {person.firstName} {person.lastName}
              </ThemedText>

              <View style={styles.detailSection}>
                <ThemedText type="smallBold">Notes</ThemedText>
                <ThemedText type="default" style={styles.bodyText}>
                  {person.notes?.trim() || 'No notes added.'}
                </ThemedText>
              </View>

              <View style={styles.detailSection}>
                <ThemedText type="smallBold">Gift ideas</ThemedText>
                {isLoadingGiftIdeas ? (
                  <ThemedText type="default" style={styles.bodyText}>
                    Loading gift ideas...
                  </ThemedText>
                ) : giftIdeasError ? (
                  <View style={styles.errorBlock}>
                    <ThemedText type="default" style={styles.bodyText}>
                      {giftIdeasError}
                    </ThemedText>
                    <Pressable
                      accessibilityRole="button"
                      onPress={onRetryGiftIdeas}
                      style={styles.retryButton}>
                      <ThemedText type="default">Try again</ThemedText>
                    </Pressable>
                  </View>
                ) : giftIdeas.length === 0 ? (
                  <ThemedText type="default" style={styles.bodyText}>
                    No gift ideas yet.
                  </ThemedText>
                ) : (
                  <View style={styles.giftList}>
                    {giftIdeas.map((giftIdea) => (
                      <View key={giftIdea.id} style={styles.giftCard}>
                        <ThemedText type="default" style={styles.giftName}>
                          {giftIdea.label}
                        </ThemedText>
                        <ThemedText type="small" style={styles.giftMeta}>
                          {giftIdea.type.replace('_', ' ')} · {giftIdea.status.toLowerCase()}
                          {giftIdea.price
                            ? ` · ${formatPrice(giftIdea.price.amountMinor, giftIdea.price.currency)}`
                            : ''}
                        </ThemedText>
                        {giftIdea.description ? (
                          <ThemedText type="small" style={styles.giftMeta}>
                            {giftIdea.description}
                          </ThemedText>
                        ) : null}
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </ScrollView>
          )}
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  dialog: {
    width: '100%',
    maxWidth: 560,
    maxHeight: '88%',
    borderRadius: 24,
    overflow: 'hidden',
  },
  header: {
    minHeight: 64,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(127, 127, 127, 0.35)',
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
  },
  closeButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  closeText: {
    color: '#3c87f7',
  },
  content: {
    alignItems: 'center',
    padding: 24,
    paddingBottom: 32,
  },
  portrait: {
    width: 144,
    height: 144,
    borderRadius: 72,
    marginBottom: 16,
    backgroundColor: 'rgba(100, 150, 200, 0.15)',
  },
  portraitPlaceholder: {
    width: 144,
    height: 144,
    borderRadius: 72,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(100, 150, 200, 0.15)',
  },
  placeholderIcon: {
    fontSize: 64,
  },
  personName: {
    fontSize: 30,
    lineHeight: 38,
    textAlign: 'center',
    marginBottom: 20,
  },
  detailSection: {
    width: '100%',
    gap: 8,
    marginTop: 16,
  },
  bodyText: {
    opacity: 0.8,
  },
  errorBlock: {
    alignItems: 'flex-start',
    gap: 10,
  },
  retryButton: {
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(100, 150, 200, 0.15)',
  },
  giftList: {
    gap: 8,
  },
  giftCard: {
    gap: 4,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(100, 150, 200, 0.1)',
  },
  giftName: {
    fontWeight: '700',
  },
  giftMeta: {
    opacity: 0.7,
  },
});