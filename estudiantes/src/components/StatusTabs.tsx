import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { TaskStatus } from '../types/task';

const options: { key: TaskStatus; label: string }[] = [
  { key: 'todas', label: 'Todas' },
  { key: 'pendientes', label: 'Pendientes' },
  { key: 'completadas', label: 'Completadas' },
];

type Props = {
  current: TaskStatus;
  onChange: (status: TaskStatus) => void;
};

export function StatusTabs({ current, onChange }: Props) {
  return (
    <View style={styles.container}>
      {options.map((item) => (
        <Pressable
          key={item.key}
          accessibilityRole="button"
          accessibilityState={{ selected: current === item.key }}
          onPress={() => onChange(item.key)}
          style={[
            styles.button,
            current === item.key && styles.active,
          ]}
        >
          <Text
            style={[
              styles.text,
              current === item.key && styles.textActive,
            ]}
          >
            {item.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FCE4EC',
    padding: 5,
    borderRadius: 25,
    gap: 5,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3CDDC',
  },

  button: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  active: {
    backgroundColor: '#A83265',
    elevation: 2,
    shadowColor: '#A83265',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  text: {
    color: '#93445F',
    fontWeight: '700',
    fontSize: 11,
  },

  textActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});