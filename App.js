import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  RefreshControl,
  StatusBar
} from 'react-native';
import { supabase } from './supabaseClient';

export default function App() {
  const [personal, setPersonal] = useState([]);
  const [asistencias, setAsistencias] = useState({});
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const fechaHoy = new Date().toISOString().split('T')[0];

  useEffect(() => {
    cargarPersonal();
    cargarAsistenciasHoy();
  }, []);

  const cargarPersonal = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('seguridad_dinamica')
        .select('*')
        .order('APELLIDOS');
      
      if (error) throw error;
      setPersonal(data || []);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar el personal: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const cargarAsistenciasHoy = async () => {
    try {
      const { data, error } = await supabase
        .from('asistencias')
        .select('*')
        .eq('fecha', fechaHoy);
      
      if (error) throw error;
      
      const asistenciasMap = {};
      data?.forEach(asistencia => {
        asistenciasMap[asistencia.personal_id] = asistencia;
      });
      setAsistencias(asistenciasMap);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las asistencias: ' + error.message);
    }
  };

  const marcarAsistencia = async (persona, presente) => {
    try {
      const asistenciaExistente = asistencias[persona.id];
      
      if (asistenciaExistente) {
        // Actualizar asistencia existente
        const { error } = await supabase
          .from('asistencias')
          .update({
            presente,
            hora_entrada: presente ? new Date().toTimeString().split(' ')[0] : null,
            hora_salida: !presente ? new Date().toTimeString().split(' ')[0] : asistenciaExistente.hora_salida
          })
          .eq('id', asistenciaExistente.id);
        
        if (error) throw error;
      } else {
        // Crear nueva asistencia
        const { error } = await supabase
          .from('asistencias')
          .insert({
            personal_id: persona.id,
            fecha: fechaHoy,
            presente,
            hora_entrada: presente ? new Date().toTimeString().split(' ')[0] : null
          });
        
        if (error) throw error;
      }
      
      // Recargar asistencias
      await cargarAsistenciasHoy();
      
      Alert.alert(
        'Éxito',
        `${persona.APELLIDOS}, ${persona.NOMBRES} marcado como ${presente ? 'PRESENTE' : 'AUSENTE'}`
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo marcar la asistencia: ' + error.message);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([cargarPersonal(), cargarAsistenciasHoy()]);
    setRefreshing(false);
  };

  const personalFiltrado = personal.filter(persona =>
    persona.APELLIDOS?.toLowerCase().includes(searchText.toLowerCase()) ||
    persona.NOMBRES?.toLowerCase().includes(searchText.toLowerCase()) ||
    persona.RANGO?.toLowerCase().includes(searchText.toLowerCase()) ||
    persona.CÉDULA?.includes(searchText)
  );

  const renderPersona = ({ item }) => {
    const asistencia = asistencias[item.id];
    const presente = asistencia?.presente;
    
    return (
      <View style={styles.personaCard}>
        <View style={styles.infoPersona}>
          <Text style={styles.nombre}>
            {item.RANGO} {item.APELLIDOS}, {item.NOMBRES}
          </Text>
          <Text style={styles.detalles}>
            {item.INST} • Cédula: {item.CÉDULA}
          </Text>
          {asistencia && (
            <Text style={styles.hora}>
              {presente ? `Entrada: ${asistencia.hora_entrada}` : 'Ausente'}
            </Text>
          )}
        </View>
        
        <View style={styles.botones}>
          <TouchableOpacity
            style={[styles.boton, styles.botonPresente, presente === true && styles.botonActivo]}
            onPress={() => marcarAsistencia(item, true)}
          >
            <Text style={styles.textoBoton}>✓</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.boton, styles.botonAusente, presente === false && styles.botonActivo]}
            onPress={() => marcarAsistencia(item, false)}
          >
            <Text style={styles.textoBoton}>✗</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2196F3" />
      
      <View style={styles.header}>
        <Text style={styles.titulo}>Asistencia Personal</Text>
        <Text style={styles.fecha}>{new Date().toLocaleDateString('es-ES')}</Text>
      </View>

      <View style={styles.busqueda}>
        <TextInput
          style={styles.inputBusqueda}
          placeholder="Buscar por nombre, rango o cédula..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <FlatList
        data={personalFiltrado}
        renderItem={renderPersona}
        keyExtractor={item => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2196F3']}
          />
        }
        contentContainerStyle={styles.lista}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 20,
    paddingTop: 50,
    alignItems: 'center',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  fecha: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  busqueda: {
    padding: 15,
    backgroundColor: 'white',
  },
  inputBusqueda: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  lista: {
    padding: 10,
  },
  personaCard: {
    backgroundColor: 'white',
    marginVertical: 5,
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  infoPersona: {
    flex: 1,
  },
  nombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  detalles: {
    fontSize: 14,
    color: '#666',
    marginTop: 3,
  },
  hora: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 3,
    fontWeight: '500',
  },
  botones: {
    flexDirection: 'row',
    gap: 10,
  },
  boton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  botonPresente: {
    backgroundColor: '#E8F5E8',
    borderColor: '#4CAF50',
  },
  botonAusente: {
    backgroundColor: '#FFEBEE',
    borderColor: '#F44336',
  },
  botonActivo: {
    opacity: 1,
    transform: [{ scale: 1.1 }],
  },
  textoBoton: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});