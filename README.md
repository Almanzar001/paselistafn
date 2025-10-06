# 📋 Sistema de Asistencia Personal

Sistema web para gestionar la asistencia del personal de seguridad con interfaz moderna y optimizada.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Tech](https://img.shields.io/badge/tech-Web%20App-green.svg)
![Database](https://img.shields.io/badge/database-Supabase-orange.svg)

## 🌟 Características Principales

- ✅ **Lista Organizada**: Personal ordenado por institución (ERD → ARD → FARD → PN) y jerarquía militar
- ✅ **Interfaz Flotante**: Búsqueda, tabs y estadísticas siempre visibles durante scroll
- ✅ **Experiencia Fluida**: Actualizaciones instantáneas sin recargas
- ✅ **Búsqueda Inteligente**: Filtrado por nombre, rango, institución o cédula
- ✅ **Tabs Dinámicos**: "Por Pasar Lista" vs "Presentes" con contadores en tiempo real
- ✅ **Animaciones Suaves**: Transiciones visuales sin popups molestos
- ✅ **Responsive**: Optimizado para desktop y móvil

## 🚀 Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Supabase (PostgreSQL)
- **UI**: Interfaz moderna con elementos flotantes
- **Deployment**: Servidor web estático

## 📦 Instalación y Uso

### Opción 1: Versión Web (Recomendada)
```bash
cd AsistenciaApp/web
python3 -m http.server 8080
# Abrir http://localhost:8080
```

### Opción 2: React Native (Desarrollo)
```bash
cd AsistenciaApp
npm install
npm start
# Escanear QR con Expo Go
```

## ⚙️ Configuración

### Variables de Entorno
```javascript
const supabaseUrl = 'TU_SUPABASE_URL';
const supabaseKey = 'TU_SUPABASE_ANON_KEY';
```

### Base de Datos
El sistema utiliza dos tablas principales:

#### `seguridad_dinamica`
```sql
- id (BIGINT, PRIMARY KEY)
- created_at (TIMESTAMP)
- "No." (INTEGER)
- RANGO (VARCHAR)
- APELLIDOS (VARCHAR) 
- NOMBRES (VARCHAR)
- "INST." (VARCHAR) -- ERD, ARD, FARD, PN
- CÉDULA (VARCHAR)
```

#### `asistencias` (Auto-creada)
```sql
- id (BIGINT, PRIMARY KEY)
- created_at (TIMESTAMP)
- personal_id (BIGINT, FK → seguridad_dinamica.id)
- fecha (DATE)
- hora_entrada (TIME)
- hora_salida (TIME)
- presente (BOOLEAN)
- observaciones (TEXT)
- UNIQUE(personal_id, fecha)
```

## 🎯 Funcionalidades

### 📊 Panel Principal
- **Estadísticas**: Total personal, presentes, % asistencia
- **Contadores Dinámicos**: Pendientes (337) vs Presentes (13)
- **Búsqueda en Tiempo Real**: Sin delays, debounce de 200ms

### 👥 Gestión de Personal
- **Ordenamiento Inteligente**: Por institución → rango → apellidos
- **Check Instantáneo**: Botón "✓ Presente" mueve inmediatamente entre listas
- **Deshacer**: Botón "Deshacer" regresa a lista pendiente
- **Sincronización**: Cambios se guardan automáticamente en background

### 📱 Interfaz
- **Header Fijo**: Título y fecha siempre visibles
- **Búsqueda Flotante**: Acceso inmediato sin scroll
- **Tabs Flotantes**: Cambio rápido entre vistas
- **Lista Scrolleable**: Solo el contenido hace scroll

## 🏗️ Arquitectura

```
AsistenciaApp/
├── web/
│   └── index.html          # App web principal
├── App.js                  # React Native (opcional)
├── supabaseClient.js       # Configuración Supabase
├── package.json            # Dependencias
└── README.md              # Documentación
```

## 🎨 Jerarquía Militar Implementada

1. Mayor General
2. General de Brigada  
3. Coronel
4. Capitán de Navio
5. Teniente Coronel
6. Capitán de Fragata
7. Mayor
8. Capitán de Corbeta
9. Capitán
10. Teniente de Navio
11. 1er. Teniente
12. Tte. de Fragata
13. 2do. Teniente
14. Tte. de Corbeta
15. Sargento Mayor
16. Sargento
17. Cabo
18. Raso
19. Marinero
20. Asimilado Militar
21. Asimilado
22. Civil

## 🔧 Funciones Técnicas

### Optimizaciones de Rendimiento
- **Actualizaciones Optimistas**: UI se actualiza antes que BD
- **Manipulación DOM Directa**: Sin re-renderizado completo
- **Background Sync**: Base de datos se actualiza sin bloquear UI
- **Debounce Search**: Evita búsquedas excesivas

### Gestión de Estado
- **Estado Local**: Variables JavaScript para rapidez
- **Sincronización**: Supabase como source of truth
- **Rollback**: Si falla BD, se revierte estado local

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Para soporte técnico o consultas:
- 📧 Email: [tu-email@ejemplo.com]
- 🐛 Issues: [GitHub Issues](https://github.com/Almanzar001/paselistafn/issues)

---

⭐ **¡Dale una estrella si te gusta el proyecto!** ⭐