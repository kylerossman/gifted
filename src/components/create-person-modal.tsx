import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import type { GiftIdea } from '@/types/gift';
import type { CreatePersonDto, Person } from '@/types/person';

type CreatePersonModalProps = {
  visible: boolean;
  people: Person[];
  giftIdeas: GiftIdea[];
  isLoadingGiftIdeas: boolean;
  giftIdeasError: string | null;
  onClose: () => void;
  onRetryGiftIdeas: () => void;
};

type CreatePersonPreview = {
  person: CreatePersonDto;
  selectedGiftIdeaIds: string[];
};

export function CreatePersonModal({
  visible,
  people,
  giftIdeas,
  isLoadingGiftIdeas,
  giftIdeasError,
  onClose,
  onRetryGiftIdeas,
}: CreatePersonModalProps) {
  const theme = useTheme();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedGiftIdeaIds, setSelectedGiftIdeaIds] = useState<string[]>([]);
  const [preview, setPreview] = useState<CreatePersonPreview | null>(null);

  const toggleGiftIdea = (giftIdeaId: string) => {
    setSelectedGiftIdeaIds((current) =>
      current.includes(giftIdeaId)
        ? current.filter((selectedId) => selectedId !== giftIdeaId)
        : [...current, giftIdeaId]
    );
    setPreview(null);
  };

  const handleSavePreview = () => {
    const person: CreatePersonDto = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      ...(notes.trim() ? { notes: notes.trim() } : {}),
      ...(imageUrl.trim() ? { imageUrl: imageUrl.trim() } : {}),
    };

    setPreview({ person, selectedGiftIdeaIds });
  };

  const peopleById = new Map(people.map((person) => [person.id, person]));
  const selectableGiftIdeas = giftIdeas.filter((giftIdea) => giftIdea.status === 'ACTIVE');
  const canSave = firstName.trim().length > 0 && lastName.trim().length > 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent>
      <View style={styles.backdrop}>
        <ThemedView accessibilityViewIsModal style={styles.dialog}>
          <View style={styles.header}>
            <View style={styles.headerCopy}>
              <ThemedText type="subtitle" style={styles.title}>
                Create person
              </ThemedText>
              <ThemedText type="small" style={styles.subtitle}>
                Prototype form · nothing is saved
              </ThemedText>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close create person form"
              onPress={onClose}
              style={styles.closeButton}>
              <ThemedText type="default" style={styles.actionText}>
                Close
              </ThemedText>
            </Pressable>
          </View>

          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
            <View style={styles.nameRow}>
              <View style={styles.nameField}>
                <ThemedText type="smallBold">First name *</ThemedText>
                <TextInput
                  accessibilityLabel="First name"
                  autoCapitalize="words"
                  autoComplete="given-name"
                  maxLength={100}
                  onChangeText={(value) => {
                    setFirstName(value);
                    setPreview(null);
                  }}
                  placeholder="e.g. Sarah"
                  placeholderTextColor={theme.textSecondary}
                  returnKeyType="next"
                  style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement }]}
                  value={firstName}
                />
              </View>
              <View style={styles.nameField}>
                <ThemedText type="smallBold">Last name *</ThemedText>
                <TextInput
                  accessibilityLabel="Last name"
                  autoCapitalize="words"
                  autoComplete="family-name"
                  maxLength={100}
                  onChangeText={(value) => {
                    setLastName(value);
                    setPreview(null);
                  }}
                  placeholder="e.g. Lee"
                  placeholderTextColor={theme.textSecondary}
                  returnKeyType="next"
                  style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement }]}
                  value={lastName}
                />
              </View>
            </View>

            <View style={styles.field}>
              <ThemedText type="smallBold">Image URL</ThemedText>
              <TextInput
                accessibilityLabel="Image URL"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="url"
                keyboardType="url"
                maxLength={2048}
                onChangeText={(value) => {
                  setImageUrl(value);
                  setPreview(null);
                }}
                placeholder="https://example.com/photo.jpg"
                placeholderTextColor={theme.textSecondary}
                style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement }]}
                value={imageUrl}
              />
              <ThemedText type="small" style={styles.helperText}>
                Image bytes are not part of the person JSON; this field stores a URL only.
              </ThemedText>
            </View>

            <View style={styles.field}>
              <ThemedText type="smallBold">Notes and interests</ThemedText>
              <TextInput
                accessibilityLabel="Notes and interests"
                autoCapitalize="sentences"
                maxLength={2000}
                multiline
                onChangeText={(value) => {
                  setNotes(value);
                  setPreview(null);
                }}
                placeholder="What do they enjoy? Any gift preferences?"
                placeholderTextColor={theme.textSecondary}
                textAlignVertical="top"
                style={[
                  styles.input,
                  styles.notesInput,
                  { color: theme.text, backgroundColor: theme.backgroundElement },
                ]}
                value={notes}
              />
            </View>

            <View style={styles.field}>
              <View style={styles.pickerHeading}>
                <ThemedText type="smallBold">Existing gift ideas to associate</ThemedText>
                <ThemedText type="small" style={styles.helperText}>
                  {selectedGiftIdeaIds.length} selected
                </ThemedText>
              </View>
              <ThemedText type="small" style={styles.helperText}>
                Select active ideas to associate with this person. This prototype does not reassign
                or save them.
              </ThemedText>

              {isLoadingGiftIdeas ? (
                <ThemedText type="default" style={styles.helperText}>
                  Loading existing gift ideas...
                </ThemedText>
              ) : giftIdeasError ? (
                <View style={styles.errorBlock}>
                  <ThemedText type="default">{giftIdeasError}</ThemedText>
                  <Pressable
                    accessibilityRole="button"
                    onPress={onRetryGiftIdeas}
                    style={styles.secondaryButton}>
                    <ThemedText type="default">Try again</ThemedText>
                  </Pressable>
                </View>
              ) : selectableGiftIdeas.length === 0 ? (
                <ThemedText type="default" style={styles.helperText}>
                  No active gift ideas are available to select.
                </ThemedText>
              ) : (
                <View style={styles.giftList}>
                  {selectableGiftIdeas.map((giftIdea) => {
                    const existingPerson = peopleById.get(giftIdea.personId);
                    const checked = selectedGiftIdeaIds.includes(giftIdea.id);
                    return (
                      <Pressable
                        key={giftIdea.id}
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked }}
                        accessibilityLabel={`${giftIdea.label}${existingPerson ? `, currently for ${existingPerson.firstName} ${existingPerson.lastName}` : ''}`}
                        onPress={() => toggleGiftIdea(giftIdea.id)}
                        style={({ pressed }) => [
                          styles.giftOption,
                          { backgroundColor: theme.backgroundElement },
                          checked && styles.giftOptionSelected,
                          pressed && styles.pressed,
                        ]}>
                        <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
                          {checked ? <ThemedText style={styles.checkmark}>✓</ThemedText> : null}
                        </View>
                        <View style={styles.giftCopy}>
                          <ThemedText type="default" style={styles.giftLabel}>
                            {giftIdea.label}
                          </ThemedText>
                          <ThemedText type="small" style={styles.helperText}>
                            {existingPerson
                              ? `Currently for ${existingPerson.firstName} ${existingPerson.lastName}`
                              : 'No matching person loaded'}
                          </ThemedText>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              )}
            </View>

            <View style={styles.buttonRow}>
              <Pressable
                accessibilityRole="button"
                disabled={!canSave}
                onPress={handleSavePreview}
                style={({ pressed }) => [
                  styles.primaryButton,
                  !canSave && styles.buttonDisabled,
                  pressed && canSave && styles.pressed,
                ]}>
                <ThemedText type="default" style={styles.primaryButtonText}>
                  Save person (preview only)
                </ThemedText>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={onClose}
                style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
                <ThemedText type="default">Cancel</ThemedText>
              </Pressable>
            </View>

            {preview ? (
              <View style={styles.previewBlock}>
                <ThemedText type="smallBold">Save preview (not sent)</ThemedText>
                <ThemedText type="small" style={[styles.previewText, { color: theme.text }]}>
                  {JSON.stringify(preview, null, 2)}
                </ThemedText>
                <ThemedText type="small" style={styles.helperText}>
                  The person fields match CreatePersonDto. Gift associations are shown separately
                  because gift ideas currently belong to a person via personId.
                </ThemedText>
              </View>
            ) : null}
          </ScrollView>
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
    padding: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  dialog: {
    width: '100%',
    maxWidth: 620,
    maxHeight: '92%',
    borderRadius: 24,
    overflow: 'hidden',
  },
  header: {
    minHeight: 76,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(127, 127, 127, 0.35)',
  },
  headerCopy: {
    gap: 2,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
  },
  subtitle: {
    opacity: 0.7,
  },
  closeButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  actionText: {
    color: '#3c87f7',
  },
  content: {
    padding: 20,
    paddingBottom: 28,
    gap: 18,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
  },
  nameField: {
    flex: 1,
    gap: 8,
  },
  field: {
    gap: 8,
  },
  input: {
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(127, 127, 127, 0.35)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  notesInput: {
    minHeight: 112,
  },
  helperText: {
    opacity: 0.7,
  },
  pickerHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  giftList: {
    gap: 8,
  },
  giftOption: {
    minHeight: 64,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(127, 127, 127, 0.25)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  giftOptionSelected: {
    borderColor: '#3c87f7',
    backgroundColor: 'rgba(60, 135, 247, 0.12)',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(127, 127, 127, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    borderColor: '#3c87f7',
    backgroundColor: '#3c87f7',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '700',
  },
  giftCopy: {
    flex: 1,
    gap: 2,
  },
  giftLabel: {
    fontWeight: '700',
  },
  errorBlock: {
    alignItems: 'flex-start',
    gap: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 4,
  },
  primaryButton: {
    flexGrow: 1,
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#3c87f7',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  secondaryButton: {
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(100, 150, 200, 0.15)',
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.72,
  },
  previewBlock: {
    gap: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(127, 127, 127, 0.35)',
    paddingTop: 16,
  },
  previewText: {
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 18,
  },
});
