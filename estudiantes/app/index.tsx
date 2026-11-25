import { useEffect, useMemo, useState } from 'react';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ActivityIndicator, FlatList, Keyboard, Pressable,
  StyleSheet, Text, TextInput, View,
} from 'react-native';
import { TaskCard } from '../src/components/TaskCard';
import { StatusTabs } from '../src/components/StatusTabs';
import { createTask, fetchTasks, removeTask, setTaskCompleted } from '../src/services/taskService';
import type { Task, TaskStatus } from '../src/types/task';
import { filterTasks } from '../src/utils/taskFilters';
import { isValidTaskTitle } from '../src/utils/taskValidation';

export default function TaskManagerScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todas');
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');

  async function loadTasks(simulateFailure = false) {
    setLoading(true);
    setError(null);
    try {
      const records = await fetchTasks(simulateFailure);
      setTasks(records);
    } catch (caught) {
      console.error('[taskService] No se cargaron las tareas', caught);
      setError('No pudimos cargar las tareas. Probá otra vez.');
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void loadTasks();
  }, []);

  const visibleTasks = useMemo(() => filterTasks(tasks, query, status), [tasks, query, status]);
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;

  async function toggleTask(id: string) {
    const found = tasks.find((task) => task.id === id);
    if (!found) return;
    try {
      const updated = await setTaskCompleted(id, !found.completed);
      setTasks((previous) => previous.map((task) => (task.id === id ? updated : task)));
    } catch (caught) {
      console.error('[taskService] No se pudo actualizar la tarea', caught);
      setFeedback('No se pudo actualizar la tarea. Revisá la conexión.');
    }
  }

  async function addTask() {
    if (!isValidTaskTitle(newTitle)) {
      setFeedback('Ingresá un nombre válido para continuar.');
      return;
    }
    try {
      const task = await createTask({
        title: newTitle.trim(),
        description: 'Tarea creada durante el taller de debugging.',
        priority: 'media',
      });
      setTasks((previous) => [task, ...previous]);
      setNewTitle('');
      setFeedback('Tarea agregada.');
      Keyboard.dismiss();
    } catch (caught) {
      console.error('[taskService] No se pudo crear la tarea', caught);
      setFeedback('No se pudo crear la tarea. Revisá la conexión.');
    }
  }

  async function deleteTask(id: string) {
    try {
      await removeTask(id);
      setTasks((previous) => previous.filter((task) => task.id !== id));
      setFeedback('Tarea eliminada.');
    } catch (caught) {
      console.error('[taskService] No se pudo eliminar la tarea', caught);
      setFeedback('No se pudo eliminar la tarea. Revisá la conexión.');
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <FlatList
        data={loading ? [] : visibleTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard task={item} onToggle={() => toggleTask(item.id)} onDelete={() => deleteTask(item.id)} />
        )}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <>
            <View style={styles.hero}>
            <View style={styles.eyebrowRow}>
              <Text style={styles.eyebrow}>MI ESPACIO DE ORGANIZACIÓN</Text>
              <Pressable accessibilityRole="button" onPress={() => router.push('/guia')} style={styles.helpButton}>
                <Text style={styles.helpText}>Guía ↗</Text>
              </Pressable>
            </View>
            <Text style={styles.heading}>Morel Tasks</Text>
            <Text style={styles.subtitle}>Pequeños pasos, grandes logros.</Text>

            </View>
            <View style={styles.statsRow}>
              <View style={[styles.stat, styles.statDark]}>
                <Text style={styles.statLabelLight}>TAREAS</Text>
                <Text style={styles.statNumberLight}>{total}</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statLabel}>COMPLETADAS</Text>
                <Text style={styles.statNumber}>{completed}</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statLabel}>PENDIENTES</Text>
                <Text style={styles.statNumber}>{total - completed}</Text>
              </View>
            </View>

            <View style={styles.progressCard}>
              <Text style={styles.progressTitle}>Tu progreso</Text>
              <Text style={styles.progressCaption}>{total ? Math.round(completed / total * 100) : 0}% completado</Text>
              <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${total ? Math.round(completed / total * 100) : 0}%` as `${number}%` }]} /></View>
            </View>
            <Text style={styles.label}>NUEVA TAREA</Text>
            <View style={styles.addRow}>
              <TextInput
                testID="new-task-input"
                accessibilityLabel="Nombre de la nueva tarea"
                placeholder="Ej.: Revisar documentación"
                placeholderTextColor="#936D7C"
                value={newTitle}
                onChangeText={setNewTitle}
                returnKeyType="done"
                style={styles.addInput}
              />
              <Pressable accessibilityRole="button" testID="add-task-button" style={styles.addButton} onPress={addTask}>
                <Text style={styles.addButtonText}>Agregar</Text>
              </Pressable>
            </View>
            {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}

            <Text style={[styles.label, styles.sectionHeading]}>MIS TAREAS</Text>
            <TextInput
              testID="search-input"
              accessibilityLabel="Buscar tareas"
              placeholder="Buscar por nombre..."
              placeholderTextColor="#936D7C"
              value={query}
              onChangeText={setQuery}
              style={styles.searchInput}
            />
            <StatusTabs current={status} onChange={setStatus} />

            <View style={styles.actions}>
              <Pressable accessibilityRole="button" style={styles.retryButton} onPress={() => void loadTasks()}>
                <Text style={styles.retryLabel}>↻ Recargar datos</Text>
              </Pressable>
              <Pressable accessibilityRole="button" testID="simulate-error-button" style={styles.simulateButton} onPress={() => void loadTasks(true)}>
                <Text style={styles.simulateLabel}>⚠ Simular error API</Text>
              </Pressable>
            </View>
            {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
            {loading ? (
              <View style={styles.loading}>
                <ActivityIndicator color="#A83265" size="large" />
                <Text style={styles.loadingLabel}>Consultando tareas…</Text>
              </View>
            ) : null}
          </>
        }
        ListEmptyComponent={!loading ? <Text style={styles.empty}>No hay tareas para mostrar con estos filtros.</Text> : null}
        ListFooterComponent={<Text style={styles.footer}>Morel Tasks · Programación III · Andrea Morel</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  hero: { backgroundColor: '#F8C8DC', borderRadius: 24, padding: 18, marginBottom: 14 },
  progressCard: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16, marginBottom: 22, borderWidth: 1, borderColor: '#F0CBD9' },
  progressTitle: { color: '#68253F', fontSize: 16, fontWeight: '800' },
  progressCaption: { color: '#815568', fontSize: 12, marginTop: 5, marginBottom: 10 },
  progressTrack: { height: 8, borderRadius: 8, backgroundColor: '#FADCE8', overflow: 'hidden' },
  progressFill: { height: 8, borderRadius: 8, backgroundColor: '#A83265' },
  screen: { flex: 1, backgroundColor: '#FFF1F5' },
  listContainer: { paddingHorizontal: 19, paddingTop: 18, paddingBottom: 55, flexGrow: 1 },
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  eyebrow: { fontSize: 10, letterSpacing: 1.5, fontWeight: '900', color: '#A83265' },
  helpButton: { backgroundColor: '#FADCE8', paddingVertical: 8, paddingHorizontal: 11, borderRadius: 9 },
  helpText: { fontWeight: '800', color: '#96305B', fontSize: 12 },
  heading: { fontSize: 30, fontWeight: '900', color: '#68253F', marginTop: 12 },
  subtitle: { color: '#815568', fontSize: 13, marginTop: 7, marginBottom: 0, lineHeight: 20 },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  stat: { backgroundColor: '#FFFFFF', padding: 12, borderRadius: 15, flex: 1, borderColor: '#F0CBD9', borderWidth: 1 },
  statDark: { backgroundColor: '#A83265', borderColor: '#A83265' },
  statLabel: { fontWeight: '800', color: '#815568', fontSize: 9, letterSpacing: 0.35 },
  statLabelLight: { fontWeight: '800', color: '#FFE0EC', fontSize: 9, letterSpacing: 0.35 },
  statNumber: { marginTop: 8, color: '#68253F', fontWeight: '900', fontSize: 25 },
  statNumberLight: { marginTop: 8, color: '#FFFFFF', fontWeight: '900', fontSize: 25 },
  label: { fontSize: 11, color: '#68253F', fontWeight: '900', letterSpacing: 1.1, marginBottom: 10 },
  sectionHeading: { marginTop: 12 },
  addRow: { flexDirection: 'row', gap: 8, marginBottom: 7 },
  addInput: { flex: 1, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#EBC4D3', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 11, color: '#68253F', fontSize: 13, minWidth: 0 },
  addButton: { backgroundColor: '#A83265', paddingHorizontal: 13, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  addButtonText: { color: '#FFFFFF', fontWeight: '800', fontSize: 12 },
  feedback: { color: '#A83265', fontSize: 12, marginBottom: 8 },
  searchInput: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#EBC4D3', borderRadius: 12, paddingHorizontal: 13, paddingVertical: 13, color: '#68253F', fontSize: 13, marginBottom: 12 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', gap: 7, marginBottom: 13 },
  retryButton: { paddingVertical: 11, paddingHorizontal: 11, backgroundColor: '#FADCE8', borderRadius: 10, flex: 1, alignItems: 'center' },
  retryLabel: { fontSize: 11, color: '#96305B', fontWeight: '800' },
  simulateButton: { paddingVertical: 11, paddingHorizontal: 10, backgroundColor: '#FDEBEB', borderRadius: 10, flex: 1, alignItems: 'center' },
  simulateLabel: { fontSize: 11, color: '#B84F4F', fontWeight: '800' },
  error: { color: '#A53D49', backgroundColor: '#FFF0F0', padding: 11, borderRadius: 10, fontWeight: '700', marginBottom: 10, fontSize: 12 },
  loading: { alignItems: 'center', paddingTop: 24, paddingBottom: 18, gap: 10 },
  loadingLabel: { color: '#815568', fontSize: 12 },
  empty: { marginTop: 30, textAlign: 'center', color: '#815568', lineHeight: 20, fontSize: 13 },
  footer: { textAlign: 'center', color: '#815568', fontSize: 10, paddingTop: 30 },
});
