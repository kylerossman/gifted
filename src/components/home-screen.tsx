import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CreateEventModal } from '@/components/create-event-modal';
import { CreatePersonModal } from '@/components/create-person-modal';
import { EventDetailModal } from '@/components/event-detail-modal';
import { PersonDetailModal } from '@/components/person-detail-modal';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { giftedDataSource, isUsingMockData } from '@/services/data-source';
import type { Event } from '@/types/event';
import type { GiftIdea } from '@/types/gift';
import type { Person } from '@/types/person';

const selectedCard = { backgroundColor: 'rgba(60, 135, 247, 0.18)', borderLeftColor: '#3c87f7' };

type SelectedResource =
  | { type: 'person'; resource: Person }
  | { type: 'event'; resource: Event }
  | null;

export default function HomeScreen() {
  const [people, setPeople] = useState<Person[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedResource, setSelectedResource] = useState<SelectedResource>(null);
  const [personGiftIdeas, setPersonGiftIdeas] = useState<GiftIdea[]>([]);
  const [isLoadingGiftIdeas, setIsLoadingGiftIdeas] = useState(false);
  const [giftIdeasError, setGiftIdeasError] = useState<string | null>(null);
  const giftIdeasRequestId = useRef(0);
  const [eventGiftIdeas, setEventGiftIdeas] = useState<GiftIdea[]>([]);
  const [isLoadingEventGiftIdeas, setIsLoadingEventGiftIdeas] = useState(false);
  const [eventGiftIdeasError, setEventGiftIdeasError] = useState<string | null>(null);
  const eventGiftIdeasRequestId = useRef(0);
  const [isCreatePersonModalVisible, setIsCreatePersonModalVisible] = useState(false);
  const [createPersonModalKey, setCreatePersonModalKey] = useState(0);
  const [createPersonGiftIdeas, setCreatePersonGiftIdeas] = useState<GiftIdea[]>([]);
  const [isLoadingCreateGiftIdeas, setIsLoadingCreateGiftIdeas] = useState(false);
  const [createGiftIdeasError, setCreateGiftIdeasError] = useState<string | null>(null);
  const createGiftIdeasRequestId = useRef(0);
  const [isCreateEventModalVisible, setIsCreateEventModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    const [nextPeople, nextEvents] = await Promise.all([
      giftedDataSource.getPeople(),
      giftedDataSource.getEvents(),
    ]);
    return { people: nextPeople, events: nextEvents };
  }, []);

  useEffect(() => {
    let isActive = true;
    fetchDashboardData()
      .then((result) => {
        if (isActive) {
          setPeople(result.people);
          setEvents(result.events);
        }
      })
      .catch(() => {
        if (isActive) setErrorMessage('Could not load dashboard data. Check the backend connection and try again.');
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });
    return () => {
      isActive = false;
    };
  }, [fetchDashboardData]);

  const handleRetry = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = await fetchDashboardData();
      setPeople(result.people);
      setEvents(result.events);
    } catch {
      setErrorMessage('Could not load dashboard data. Check the backend connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [fetchDashboardData]);

  const loadPersonGiftIdeas = useCallback(async (personId: string) => {
    const requestId = ++giftIdeasRequestId.current;
    setIsLoadingGiftIdeas(true);
    setGiftIdeasError(null);
    setPersonGiftIdeas([]);
    try {
      const ideas = await giftedDataSource.getPersonGiftIdeas(personId);
      if (requestId === giftIdeasRequestId.current) setPersonGiftIdeas(ideas);
    } catch {
      if (requestId === giftIdeasRequestId.current) {
        setGiftIdeasError('Could not load this person’s gift ideas. Please try again.');
      }
    } finally {
      if (requestId === giftIdeasRequestId.current) setIsLoadingGiftIdeas(false);
    }
  }, []);

  const loadEventGiftIdeas = useCallback(async (eventId: string) => {
    const requestId = ++eventGiftIdeasRequestId.current;
    setIsLoadingEventGiftIdeas(true);
    setEventGiftIdeasError(null);
    setEventGiftIdeas([]);
    try {
      const ideas = await giftedDataSource.getGiftIdeas();
      if (requestId === eventGiftIdeasRequestId.current) {
        setEventGiftIdeas(ideas.filter((giftIdea) => giftIdea.eventId === eventId));
      }
    } catch {
      if (requestId === eventGiftIdeasRequestId.current) {
        setEventGiftIdeasError('Could not load this event’s gift ideas. Please try again.');
      }
    } finally {
      if (requestId === eventGiftIdeasRequestId.current) setIsLoadingEventGiftIdeas(false);
    }
  }, []);

  const loadCreatePersonGiftIdeas = useCallback(async () => {
    const requestId = ++createGiftIdeasRequestId.current;
    setIsLoadingCreateGiftIdeas(true);
    setCreateGiftIdeasError(null);
    try {
      const ideas = await giftedDataSource.getGiftIdeas();
      if (requestId === createGiftIdeasRequestId.current) setCreatePersonGiftIdeas(ideas);
    } catch {
      if (requestId === createGiftIdeasRequestId.current) {
        setCreateGiftIdeasError('Could not load existing gift ideas. Please try again.');
      }
    } finally {
      if (requestId === createGiftIdeasRequestId.current) setIsLoadingCreateGiftIdeas(false);
    }
  }, []);

  const selectedPerson = selectedResource?.type === 'person' ? selectedResource.resource : null;
  const selectedEvent = selectedResource?.type === 'event' ? selectedResource.resource : null;

  const handleSelectPerson = (person: Person) => {
    eventGiftIdeasRequestId.current += 1;
    setEventGiftIdeas([]);
    setIsLoadingEventGiftIdeas(false);
    setEventGiftIdeasError(null);
    setSelectedResource({ type: 'person', resource: person });
    void loadPersonGiftIdeas(person.id);
  };

  const handleClosePersonModal = () => {
    giftIdeasRequestId.current += 1;
    setSelectedResource(null);
    setPersonGiftIdeas([]);
    setIsLoadingGiftIdeas(false);
    setGiftIdeasError(null);
  };

  const handleSelectEvent = (event: Event) => {
    giftIdeasRequestId.current += 1;
    setPersonGiftIdeas([]);
    setIsLoadingGiftIdeas(false);
    setGiftIdeasError(null);
    eventGiftIdeasRequestId.current += 1;
    setSelectedResource({ type: 'event', resource: event });
    void loadEventGiftIdeas(event.id);
  };

  const handleCloseEventModal = () => {
    eventGiftIdeasRequestId.current += 1;
    setSelectedResource(null);
    setEventGiftIdeas([]);
    setIsLoadingEventGiftIdeas(false);
    setEventGiftIdeasError(null);
  };

  const handleOpenCreatePerson = () => {
    setCreatePersonModalKey((current) => current + 1);
    setCreatePersonGiftIdeas([]);
    setIsCreatePersonModalVisible(true);
    void loadCreatePersonGiftIdeas();
  };

  const handleCloseCreatePerson = () => {
    createGiftIdeasRequestId.current += 1;
    setIsCreatePersonModalVisible(false);
    setCreatePersonGiftIdeas([]);
    setIsLoadingCreateGiftIdeas(false);
    setCreateGiftIdeasError(null);
  };

  const handleOpenCreateEvent = () => setIsCreateEventModalVisible(true);
  const handleCloseCreateEvent = () => setIsCreateEventModalVisible(false);

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
              Showing sample people and events. Set EXPO_PUBLIC_DATA_SOURCE=rest to use the backend.
            </ThemedText>
          )}
        </View>

        {isLoading ? (
          <View style={styles.messageContainer}>
            <ActivityIndicator accessibilityLabel="Loading dashboard" />
            <ThemedText type="default" style={styles.messageText}>
              Loading people and events...
            </ThemedText>
          </View>
        ) : errorMessage ? (
          <View style={styles.messageContainer}>
            <ThemedText type="default" style={styles.messageText}>{errorMessage}</ThemedText>
            <Pressable accessibilityRole="button" onPress={() => void handleRetry()} style={styles.retryButton}>
              <ThemedText type="default">Try again</ThemedText>
            </Pressable>
          </View>
        ) : (
          <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <ThemedText type="subtitle" style={styles.sectionTitle}>People</ThemedText>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Create person"
                  accessibilityHint="Opens the create person form."
                  onPress={handleOpenCreatePerson}
                  style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}>
                  <ThemedText type="default" style={styles.addButtonText}>+</ThemedText>
                </Pressable>
              </View>
              {people.length === 0 ? (
                <ThemedText type="default" style={styles.emptyText}>No people yet.</ThemedText>
              ) : people.map((person) => (
                <Pressable
                  key={person.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${person.firstName} ${person.lastName}`}
                  accessibilityHint="Opens this person’s details."
                  accessibilityState={{ selected: selectedResource?.type === 'person' && selectedResource.resource.id === person.id }}
                  onPress={() => handleSelectPerson(person)}
                  style={({ pressed }) => [styles.resourceCard, selectedResource?.type === 'person' && selectedResource.resource.id === person.id && selectedCard, pressed && styles.pressed]}>
                  <ThemedText type="subtitle" style={styles.resourceName}>👤 {person.firstName} {person.lastName}</ThemedText>
                  {person.notes ? <ThemedText type="default" style={styles.resourceInfo} numberOfLines={2}>{person.notes}</ThemedText> : null}
                  {selectedResource?.type === 'person' && selectedResource.resource.id === person.id ? <ThemedText type="smallBold" style={styles.selectionLabel}>Selected</ThemedText> : null}
                </Pressable>
              ))}
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <ThemedText type="subtitle" style={styles.sectionTitle}>Events</ThemedText>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Create event"
                  accessibilityHint="Opens the create event form."
                  onPress={handleOpenCreateEvent}
                  style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}>
                  <ThemedText type="default" style={styles.addButtonText}>+</ThemedText>
                </Pressable>
              </View>
              {events.length === 0 ? (
                <ThemedText type="default" style={styles.emptyText}>No events yet.</ThemedText>
              ) : events.map((event) => (
                <Pressable
                  key={event.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Open event ${event.name}`}
                  accessibilityHint="Opens this event’s details."
                  accessibilityState={{ selected: selectedResource?.type === 'event' && selectedResource.resource.id === event.id }}
                  onPress={() => handleSelectEvent(event)}
                  style={({ pressed }) => [styles.resourceCard, selectedResource?.type === 'event' && selectedResource.resource.id === event.id && selectedCard, pressed && styles.pressed]}>
                  <ThemedText type="subtitle" style={styles.resourceName}>🎉 {event.name}</ThemedText>
                  <ThemedText type="default" style={styles.resourceInfo}>
                    {event.targetDate} · {event.participants.length} {event.participants.length === 1 ? 'participant' : 'participants'}
                  </ThemedText>
                  {selectedResource?.type === 'event' && selectedResource.resource.id === event.id ? <ThemedText type="smallBold" style={styles.selectionLabel}>Selected</ThemedText> : null}
                </Pressable>
              ))}
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
      <PersonDetailModal
        person={selectedPerson}
        giftIdeas={personGiftIdeas}
        isLoadingGiftIdeas={isLoadingGiftIdeas}
        giftIdeasError={giftIdeasError}
        onClose={handleClosePersonModal}
        onRetryGiftIdeas={() => { if (selectedPerson) void loadPersonGiftIdeas(selectedPerson.id); }}
      />
      <EventDetailModal
        event={selectedEvent}
        people={people}
        giftIdeas={eventGiftIdeas}
        isLoadingGiftIdeas={isLoadingEventGiftIdeas}
        giftIdeasError={eventGiftIdeasError}
        onClose={handleCloseEventModal}
        onRetryGiftIdeas={() => { if (selectedEvent) void loadEventGiftIdeas(selectedEvent.id); }}
      />
      <CreatePersonModal
        key={createPersonModalKey}
        visible={isCreatePersonModalVisible}
        people={people}
        giftIdeas={createPersonGiftIdeas}
        isLoadingGiftIdeas={isLoadingCreateGiftIdeas}
        giftIdeasError={createGiftIdeasError}
        onClose={handleCloseCreatePerson}
        onRetryGiftIdeas={() => void loadCreatePersonGiftIdeas()}
      />
      <CreateEventModal
        visible={isCreateEventModalVisible}
        people={people}
        onClose={handleCloseCreateEvent}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: 16 },
  header: { marginVertical: 16 },
  subtitle: { marginTop: 4, opacity: 0.7 },
  sourceNote: { marginTop: 8, opacity: 0.7 },
  list: { flex: 1 },
  listContent: { paddingBottom: 16 },
  section: { gap: 8, marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  sectionTitle: { fontSize: 24, lineHeight: 32 },
  addButton: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(60, 135, 247, 0.14)' },
  addButtonText: { color: '#3c87f7', fontSize: 28, lineHeight: 32, fontWeight: '500' },
  resourceCard: { padding: 16, marginBottom: 8, borderRadius: 12, backgroundColor: 'rgba(100, 150, 200, 0.1)', borderLeftWidth: 4, borderLeftColor: '#6496c8' },
  pressed: { opacity: 0.75 },
  resourceName: { fontSize: 20, lineHeight: 28, marginBottom: 4 },
  resourceInfo: { opacity: 0.7, fontSize: 14 },
  selectionLabel: { color: '#3c87f7', marginTop: 8 },
  emptyText: { opacity: 0.7, paddingVertical: 8 },
  messageContainer: { alignItems: 'center', padding: 24, gap: 12 },
  messageText: { textAlign: 'center' },
  retryButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, backgroundColor: 'rgba(100, 150, 200, 0.15)' },
});
