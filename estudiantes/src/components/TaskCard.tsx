import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Task } from '../types/task';

type TaskCardProps = { task: Task; onToggle: () => void; onDelete: () => void };

export function TaskCard({ task, onToggle, onDelete }: TaskCardProps) {
  const [expanded, setExpanded] = useState(false);
  return (
    <View style={[styles.card, task.completed && styles.doneCard]}>
      <View style={styles.topLine}>
        <Pressable testID={`toggle-${task.id}`} accessibilityRole="button" accessibilityLabel={`Cambiar estado de ${task.title}`} style={[styles.check, task.completed && styles.checked]} onPress={onToggle}>
          <Text style={styles.checkText}>{task.completed ? '✓' : ''}</Text>
        </Pressable>
        <View style={styles.content}>
          <Text style={[styles.title, task.completed && styles.completed]}>{task.title}</Text>
          <View style={styles.row}>
            <Text style={[styles.priority, task.priority === 'alta' && styles.high]}>{(task.priority ?? 'media').toUpperCase()}</Text>
            <Text style={styles.state}>{task.completed ? 'Completada' : 'Pendiente'}</Text>
          </View>
        </View>
        <Pressable testID={`expand-${task.id}`} accessibilityRole="button" accessibilityLabel={`Ver detalle de ${task.title}`} onPress={() => setExpanded((current) => !current)} style={styles.expandButton}>
          <Text style={styles.expandText}>{expanded ? '−' : '+'}</Text>
        </Pressable>
      </View>
      {expanded ? (
        <View style={styles.details} testID={`details-${task.id}`}>
          <Text style={styles.description}>{task.description}</Text>
          <Pressable accessibilityRole="button" onPress={onDelete} style={styles.deleteButton}><Text style={styles.deleteText}>Eliminar tarea</Text></Pressable>
        </View>
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, marginBottom: 11, borderWidth: 1, borderColor: '#F0CBD9', borderLeftWidth: 4, borderLeftColor: '#D75A89' },
  doneCard: { backgroundColor: '#FFF9FB', borderLeftColor: '#B58A9C' },
  topLine: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  check: { height: 32, width: 32, borderRadius: 16, borderWidth: 2, borderColor: '#D75A89', justifyContent: 'center', alignItems: 'center' },
  checked: { backgroundColor: '#A83265', borderColor: '#A83265' },
  checkText: { color: '#FFFFFF', fontWeight: '900', fontSize: 16 },
  content: { flex: 1 },
  title: { color: '#68253F', fontSize: 15, fontWeight: '800', lineHeight: 21 },
  completed: { color: '#815568', textDecorationLine: 'line-through' },
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 7, marginTop: 6 },
  priority: { fontSize: 10, letterSpacing: 0.5, color: '#96305B', backgroundColor: '#FADCE8', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, fontWeight: '800' },
  high: { color: '#9E3043', backgroundColor: '#FFE1E6' },
  state: { color: '#815568', fontSize: 11 },
  expandButton: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#FADCE8', justifyContent: 'center', alignItems: 'center' },
  expandText: { color: '#96305B', fontWeight: '800', fontSize: 19 },
  details: { marginTop: 13, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F0CBD9' },
  description: { fontSize: 13, color: '#815568', lineHeight: 20 },
  deleteButton: { alignSelf: 'flex-start', marginTop: 13, paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#FFF0F0', borderRadius: 12 },
  deleteText: { color: '#B63D4E', fontSize: 12, fontWeight: '800' },
});
