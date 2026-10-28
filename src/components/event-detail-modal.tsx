import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import type { Event } from '@/types/event';
import type { GiftIdea } from '@/types/gift';
import type { Person } from '@/types/person';

type EventDetailModalProps = {
  event: Event | null;
  people: Person[];
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

export function EventDetailModal({
  event,
  people,
  giftIdeas,
  isLoadingGiftIdeas,
  giftIdeasError,
  onClose,
  onRetryGiftIdeas,
}: EventDetailModalProps) {
  const peopleById = new Map(people.map((person) => [person.id, person]));

  return (
    <Modal
      visible={event !== null}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent>
      <View style={styles.backdrop}>
        <ThemedView accessibilityViewIsModal style={styles.dialog}>
          <View style={styles.header}>
            <ThemedText type="subtitle" style={styles.title}>
              Event details
            </ThemedText>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close event details"
              onPress={onClose}
              style={styles.closeButton}>
              <ThemedText type="default" style={styles.closeText}>
                Close
              </ThemedText>
            </Pressable>
          </View>

          {event && (
            <ScrollView contentContainerStyle={styles.content}>
              <ThemedText type="subtitle" style={styles.eventName}>
                🎉 {event.name}
              </ThemedText>

              <View style={styles.summary}>
                <View style={styles.summaryItem}>
                  <ThemedText type="smallBold">Date</ThemedText>
                  <ThemedText type="default">{event.targetDate}</ThemedText>
                </View>
                {event.budget ? (
                  <View style={styles.summaryItem}>
                    <ThemedText type="smallBold">Budget</ThemedText>
                    <ThemedText type="default">
                      {formatPrice(event.budget.amountMinor, event.budget.currency)}
                    </ThemedText>
                  </View>
                ) : null}
              </View>

              <View style={styles.detailSection}>
                <ThemedText type="smallBold">Participants</ThemedText>
                {event.participants.length === 0 ? (
                  <ThemedText type="default" style={styles.secondaryText}>
                    No participants added.
                  </ThemedText>
                ) : (
                  <View style={styles.list}>
                    {event.participants.map((participant) => {
                      const person = peopleById.get(participant.personId);
                      const participantName = person
                        ? `${person.firstName} ${person.lastName}`
                        : 'Unknown person';

                      return (
                        <View key={participant.personId} style={styles.listCard}>
                          <ThemedText type="default" style={styles.listTitle}>
                            {participantName}
                          </ThemedText>
                          {participant.personalBudget ? (
                            <ThemedText type="small" style={styles.secondaryText}>
                              Personal budget:{' '}
                              {formatPrice(
                                participant.personalBudget.amountMinor,
                                participant.personalBudget.currency
                              )}
                            </ThemedText>
                          ) : null}
                          {!person ? (
                            <ThemedText type="small" style={styles.secondaryText}>
                              Person ID: {participant.personId}
                            </ThemedText>
                          ) : null}
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>

              <View style={styles.detailSection}>
                <ThemedText type="smallBold">Gift ideas for this event</ThemedText>
                {isLoadingGiftIdeas ? (
                  <ThemedText type="default" style={styles.secondaryText}>
                    Loading gift ideas...
                  </ThemedText>
                ) : giftIdeasError ? (
                  <View style={styles.errorBlock}>
                    <ThemedText type="default" style={styles.secondaryText}>
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
                  <ThemedText type="default" style={styles.secondaryText}>
                    No gift ideas linked to this event.
                  </ThemedText>
                ) : (
                  <View style={styles.list}>
                    {giftIdeas.map((giftIdea) => {
                      const person = peopleById.get(giftIdea.personId);
                      return (
                        <View key={giftIdea.id} style={styles.listCard}>
                          <ThemedText type="default" style={styles.listTitle}>
                            {giftIdea.label}
                          </ThemedText>
                          <ThemedText type="small" style={styles.secondaryText}>
                            For {person ? `${person.firstName} ${person.lastName}` : 'unknown person'}
                            {' · '}
                            {giftIdea.status.toLowerCase()}
                            {giftIdea.price
                              ? ` · ${formatPrice(giftIdea.price.amountMinor, giftIdea.price.currency)}`
                              : ''}
                          </ThemedText>
                          {giftIdea.description ? (
                            <ThemedText type="small" style={styles.secondaryText}>
                              {giftIdea.description}
                            </ThemedText>
                          ) : null}
                        </View>
                      );
                    })}
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
    padding: 24,
    paddingBottom: 32,
  },
  eventName: {
    fontSize: 30,
    lineHeight: 38,
    textAlign: 'center',
    marginBottom: 20,
  },
  summary: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  summaryItem: {
    flexGrow: 1,
    gap: 4,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(100, 150, 200, 0.1)',
  },
  detailSection: {
    gap: 8,
    marginTop: 24,
  },
  list: {
    gap: 8,
  },
  listCard: {
    gap: 4,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(100, 150, 200, 0.1)',
  },
  listTitle: {
    fontWeight: '700',
  },
  secondaryText: {
    opacity: 0.7,
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
});