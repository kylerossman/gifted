import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import type { CreateEventDto } from '@/types/event';
import type { Person } from '@/types/person';

type CreateEventModalProps = {
  visible: boolean;
  people: Person[];
  onClose: () => void;
};

type EventPreview = {
  event: CreateEventDto;
};

function moneyToMinorUnits(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.round(parsed * 100) : 0;
}

function isValidIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function CreateEventModal({ visible, people, onClose }: CreateEventModalProps) {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [selectedPersonIds, setSelectedPersonIds] = useState<string[]>([]);
  const [personalBudgets, setPersonalBudgets] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState<EventPreview | null>(null);

  const validDate = isValidIsoDate(targetDate.trim());
  const validBudget = !budgetAmount.trim() || (Number.isFinite(Number(budgetAmount)) && Number(budgetAmount) >= 0);
  const validCurrency = /^[A-Za-z]{3}$/.test(currency.trim());
  const validPersonalBudgets = selectedPersonIds.every((personId) => {
    const amount = personalBudgets[personId]?.trim();
    return !amount || (Number.isFinite(Number(amount)) && Number(amount) >= 0);
  });
  const canSave = name.trim().length > 0 && validDate && validBudget && validCurrency && validPersonalBudgets;

  const togglePerson = (personId: string) => {
    setSelectedPersonIds((current) => {
      const isSelected = current.includes(personId);
      if (isSelected) {
        setPersonalBudgets((previous) => {
          const next = { ...previous };
          delete next[personId];
          return next;
        });
        return current.filter((id) => id !== personId);
      }
      return [...current, personId];
    });
    setPreview(null);
  };

  const handleSavePreview = () => {
    const participants = selectedPersonIds.map((personId) => {
      const personalBudget = personalBudgets[personId]?.trim();
      return {
        personId,
        ...(personalBudget
          ? { personalBudget: { amountMinor: moneyToMinorUnits(personalBudget), currency: currency.trim().toUpperCase() } }
          : {}),
      };
    });

    const event: CreateEventDto = {
      name: name.trim(),
      targetDate: targetDate.trim(),
      ...(budgetAmount.trim()
        ? { budget: { amountMinor: moneyToMinorUnits(budgetAmount), currency: currency.trim().toUpperCase() } }
        : {}),
      participants,
    };
    setPreview({ event });
  };

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
              <ThemedText type="subtitle" style={styles.title}>Create event</ThemedText>
              <ThemedText type="small" style={styles.subtitle}>Prototype form · nothing is saved</ThemedText>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close create event form"
              onPress={onClose}
              style={styles.closeButton}>
              <ThemedText type="default" style={styles.actionText}>Close</ThemedText>
            </Pressable>
          </View>

          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
            <View style={styles.field}>
              <ThemedText type="smallBold">Event name *</ThemedText>
              <TextInput
                accessibilityLabel="Event name"
                autoCapitalize="sentences"
                maxLength={120}
                onChangeText={(value) => { setName(value); setPreview(null); }}
                placeholder="e.g. Christmas 2026"
                placeholderTextColor={theme.textSecondary}
                returnKeyType="next"
                style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement }]}
                value={name}
              />
            </View>

            <View style={styles.field}>
              <ThemedText type="smallBold">Target date *</ThemedText>
              <TextInput
                accessibilityLabel="Target date"
                autoCapitalize="none"
                maxLength={10}
                onChangeText={(value) => { setTargetDate(value); setPreview(null); }}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={theme.textSecondary}
                style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement }]}
                value={targetDate}
              />
              <ThemedText type="small" style={styles.helperText}>
                {targetDate.length > 0 && !validDate
                  ? 'Enter a real calendar date in YYYY-MM-DD format.'
                  : 'Use the contract date format, such as 2026-12-25.'}
              </ThemedText>
            </View>

            <View style={styles.field}>
              <ThemedText type="smallBold">Overall budget (optional)</ThemedText>
              <View style={styles.budgetRow}>
                <TextInput
                  accessibilityLabel="Overall budget amount"
                  keyboardType="decimal-pad"
                  onChangeText={(value) => { setBudgetAmount(value); setPreview(null); }}
                  placeholder="0.00"
                  placeholderTextColor={theme.textSecondary}
                  style={[styles.input, styles.amountInput, { color: theme.text, backgroundColor: theme.backgroundElement }]}
                  value={budgetAmount}
                />
                <TextInput
                  accessibilityLabel="Budget currency code"
                  autoCapitalize="characters"
                  maxLength={3}
                  onChangeText={(value) => { setCurrency(value); setPreview(null); }}
                  placeholder="USD"
                  placeholderTextColor={theme.textSecondary}
                  style={[styles.input, styles.currencyInput, { color: theme.text, backgroundColor: theme.backgroundElement }]}
                  value={currency}
                />
              </View>
              {!validCurrency || !validBudget || !validPersonalBudgets ? (
                <ThemedText type="small" style={styles.validationText}>
                  Enter non-negative budget amounts and a 3-letter currency code.
                </ThemedText>
              ) : null}
            </View>

            <View style={styles.field}>
              <View style={styles.pickerHeading}>
                <ThemedText type="smallBold">Participants</ThemedText>
                <ThemedText type="small" style={styles.helperText}>{selectedPersonIds.length} selected</ThemedText>
              </View>
              <ThemedText type="small" style={styles.helperText}>Participant budgets are optional and use the same currency above.</ThemedText>
              {people.length === 0 ? (
                <ThemedText type="default" style={styles.helperText}>Create people first to add event participants.</ThemedText>
              ) : (
                <View style={styles.peopleList}>
                  {people.map((person) => {
                    const checked = selectedPersonIds.includes(person.id);
                    return (
                      <View key={person.id} style={[styles.personOption, { backgroundColor: theme.backgroundElement }, checked && styles.personOptionSelected]}>
                        <Pressable
                          accessibilityRole="checkbox"
                          accessibilityState={{ checked }}
                          accessibilityLabel={`${person.firstName} ${person.lastName}`}
                          onPress={() => togglePerson(person.id)}
                          style={styles.personSelect}>
                          <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
                            {checked ? <ThemedText style={styles.checkmark}>✓</ThemedText> : null}
                          </View>
                          <ThemedText type="default" style={styles.personName}>{person.firstName} {person.lastName}</ThemedText>
                        </Pressable>
                        {checked ? (
                          <TextInput
                            accessibilityLabel={`${person.firstName} ${person.lastName} personal budget`}
                            keyboardType="decimal-pad"
                            onChangeText={(value) => {
                              setPersonalBudgets((current) => ({ ...current, [person.id]: value }));
                              setPreview(null);
                            }}
                            placeholder="Personal budget (optional)"
                            placeholderTextColor={theme.textSecondary}
                            style={[styles.personalBudgetInput, { color: theme.text, backgroundColor: theme.background }]}
                            value={personalBudgets[person.id] ?? ''}
                          />
                        ) : null}
                      </View>
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
                style={({ pressed }) => [styles.primaryButton, !canSave && styles.buttonDisabled, pressed && canSave && styles.pressed]}>
                <ThemedText type="default" style={styles.primaryButtonText}>Save event (preview only)</ThemedText>
              </Pressable>
              <Pressable accessibilityRole="button" onPress={onClose} style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
                <ThemedText type="default">Cancel</ThemedText>
              </Pressable>
            </View>

            {preview ? (
              <View style={styles.previewBlock}>
                <ThemedText type="smallBold">Save preview (not sent)</ThemedText>
                <ThemedText type="small" style={[styles.previewText, { color: theme.text }]}>
                  {JSON.stringify(preview, null, 2)}
                </ThemedText>
                <ThemedText type="small" style={styles.helperText}>This payload follows CreateEventDto. Server-generated ID and timestamps are intentionally omitted.</ThemedText>
              </View>
            ) : null}
          </ScrollView>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 18, backgroundColor: 'rgba(0, 0, 0, 0.55)' },
  dialog: { width: '100%', maxWidth: 620, maxHeight: '92%', borderRadius: 24, overflow: 'hidden' },
  header: { minHeight: 76, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(127, 127, 127, 0.35)' },
  headerCopy: { gap: 2 },
  title: { fontSize: 22, lineHeight: 28 },
  subtitle: { opacity: 0.7 },
  closeButton: { paddingVertical: 10, paddingHorizontal: 12 },
  actionText: { color: '#3c87f7' },
  content: { padding: 20, paddingBottom: 28, gap: 18 },
  field: { gap: 8 },
  input: { minHeight: 48, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(127, 127, 127, 0.35)', paddingHorizontal: 14, paddingVertical: 12, fontSize: 16 },
  helperText: { opacity: 0.7 },
  validationText: { color: '#c83b3b' },
  budgetRow: { flexDirection: 'row', gap: 10 },
  amountInput: { flex: 1 },
  currencyInput: { width: 92, textTransform: 'uppercase' },
  pickerHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  peopleList: { gap: 8 },
  personOption: { padding: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(127, 127, 127, 0.25)', gap: 8 },
  personOptionSelected: { borderColor: '#3c87f7' },
  personSelect: { minHeight: 32, flexDirection: 'row', alignItems: 'center', gap: 12 },
  personName: { fontWeight: '700' },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 1.5, borderColor: 'rgba(127, 127, 127, 0.75)', alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { borderColor: '#3c87f7', backgroundColor: '#3c87f7' },
  checkmark: { color: '#ffffff', fontSize: 16, lineHeight: 20, fontWeight: '700' },
  personalBudgetInput: { minHeight: 42, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(127, 127, 127, 0.25)', paddingHorizontal: 12, paddingVertical: 8, fontSize: 15 },
  buttonRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 4 },
  primaryButton: { flexGrow: 1, alignItems: 'center', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16, backgroundColor: '#3c87f7' },
  primaryButtonText: { color: '#ffffff', fontWeight: '700' },
  secondaryButton: { alignItems: 'center', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16, backgroundColor: 'rgba(100, 150, 200, 0.15)' },
  buttonDisabled: { opacity: 0.45 },
  pressed: { opacity: 0.72 },
  previewBlock: { gap: 8, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(127, 127, 127, 0.35)', paddingTop: 16 },
  previewText: { fontFamily: 'monospace', fontSize: 12, lineHeight: 18 },
});
