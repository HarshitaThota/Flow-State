import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SelectOptionProps {
  label: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
  emoji?: string;
}

export function SelectOption({
  label,
  description,
  selected,
  onPress,
  emoji,
}: SelectOptionProps) {
  return (
    <TouchableOpacity
      style={[styles.container, selected && styles.selected]}
      onPress={onPress}
    >
      {emoji && <Text style={styles.emoji}>{emoji}</Text>}
      <View style={styles.textContainer}>
        <Text style={[styles.label, selected && styles.selectedLabel]}>
          {label}
        </Text>
        {description && (
          <Text
            style={[styles.description, selected && styles.selectedDescription]}
          >
            {description}
          </Text>
        )}
      </View>
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected && <View style={styles.radioInner} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: 12,
  },
  selected: {
    backgroundColor: '#f3e8ff',
    borderColor: '#8b5cf6',
  },
  emoji: {
    fontSize: 28,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  selectedLabel: {
    color: '#6d28d9',
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  selectedDescription: {
    color: '#7c3aed',
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: '#8b5cf6',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#8b5cf6',
  },
});
