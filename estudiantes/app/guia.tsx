import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Pressable, StyleSheet, Text, View } from 'react-native';

const missions = [
  'Reproducir los errores antes de cambiar el código.',
  'Examinar las variables con DevTools, consola o breakpoints.',
  'Corregir al menos cuatro incidencias con cambios mínimos.',
  'Ejecutar pruebas automatizadas y explicar sus resultados.',
  'Documentar causa raíz, corrección y prueba de regresión.',
  'Crear un commit con los cambios y defender las decisiones.',
];

export default function GuiaScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>← Volver a Morel Tasks</Text>
        </Pressable>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>GUÍA DE TRABAJO</Text>
          <Text style={styles.title}>Investigar antes de corregir</Text>
          <Text style={styles.intro}>No se trata de encontrar el código correcto en Internet, sino de demostrar cómo se detecta una falla, cómo se explica y cómo se evita que reaparezca.</Text>
        </View>
        <View style={styles.callout}>
          <Text style={styles.calloutTitle}>Misión de la clase</Text>
          <Text style={styles.calloutText}>Corregir al menos 4 fallos y entregar un informe técnico verificable.</Text>
        </View>
        {missions.map((mission, index) => (
          <View key={mission} style={styles.mission}>
            <View style={styles.numberCircle}><Text style={styles.number}>{String(index + 1).padStart(2, '0')}</Text></View>
            <Text style={styles.missionText}>{mission}</Text>
          </View>
        ))}
        <Text style={styles.note}>Usá la plantilla INFORME_INCIDENTES.md del proyecto para registrar las evidencias.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFF1F5' },
  content: { paddingHorizontal: 22, paddingBottom: 35, paddingTop: 14 },
  back: { alignSelf: 'flex-start', backgroundColor: '#FADCE8', padding: 12, borderRadius: 20, marginBottom: 16 },
  backText: { color: '#96305B', fontWeight: '800' },
  hero: { backgroundColor: '#F8C8DC', padding: 20, borderRadius: 24, marginBottom: 16 },
  eyebrow: { fontSize: 10, letterSpacing: 1.6, color: '#96305B', fontWeight: '900' },
  title: { fontSize: 29, color: '#68253F', fontWeight: '900', marginTop: 10, lineHeight: 35 },
  intro: { fontSize: 14, color: '#68253F', lineHeight: 23, marginTop: 13 },
  callout: { backgroundColor: '#A83265', borderRadius: 18, padding: 18, marginBottom: 20 },
  calloutTitle: { fontSize: 15, fontWeight: '900', color: '#FFFFFF' },
  calloutText: { marginTop: 7, color: '#FFE0EC', lineHeight: 20 },
  mission: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 18, gap: 14, marginBottom: 9, borderWidth: 1, borderColor: '#F0CBD9' },
  numberCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FADCE8', alignItems: 'center', justifyContent: 'center' },
  number: { color: '#96305B', fontWeight: '900' },
  missionText: { flex: 1, color: '#68253F', lineHeight: 20, fontSize: 13 },
  note: { marginTop: 22, color: '#815568', fontStyle: 'italic', lineHeight: 19 },
});
