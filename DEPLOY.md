# 🚀 Guía de Deployment - Sistema de Asistencia Personal

## 📋 Pasos para subir a GitHub

### 1. Crear repositorio en GitHub
1. Ve a [GitHub.com](https://github.com)
2. Click en "New repository"
3. Nombre: `AsistenciaApp` o `sistema-asistencia-personal`
4. Descripción: "Sistema web para gestionar asistencia del personal de seguridad"
5. ✅ Public/Private (tu elección)
6. ❌ NO inicialices con README (ya lo tenemos)
7. Click "Create repository"

### 2. Conectar repositorio local
```bash
# Ya ejecutado automáticamente:
# git init
# git add .
# git commit -m "Initial commit..."

# Ya ejecutado - Tu repositorio:
git remote add origin https://github.com/Almanzar001/paselistafn.git
git branch -M main
git push -u origin main
```

### 3. Configurar para otros usuarios

#### Para usuarios que clonen el repo:
1. **Clonar repositorio:**
   ```bash
   git clone https://github.com/Almanzar001/paselistafn.git
   cd paselistafn
   ```

2. **Configurar Supabase:**
   ```bash
   # Copiar archivo de configuración
   cp config.example.js config.js
   
   # Editar config.js con sus credenciales
   nano config.js
   ```

3. **Configurar base de datos:**
   - Ir a Supabase SQL Editor
   - Ejecutar script `setup.sql`
   - Verificar permisos y tablas

4. **Ejecutar aplicación:**
   ```bash
   # Opción 1: Servidor Python
   cd web
   python3 -m http.server 8080
   
   # Opción 2: NPM script
   npm run web-server
   
   # Abrir: http://localhost:8080
   ```

## 🔧 Configuración de Producción

### Opción 1: GitHub Pages
1. Ve a Settings > Pages en tu repo
2. Source: Deploy from a branch
3. Branch: main, folder: /web
4. Save

### Opción 2: Netlify
1. Conecta tu repo GitHub a Netlify
2. Build command: (vacío)
3. Publish directory: `web`
4. Deploy

### Opción 3: Vercel
1. Conecta repo a Vercel
2. Framework: Other
3. Root directory: `web`
4. Deploy

## 🔐 Variables de Entorno Seguras

### Para producción, usar variables de entorno:
```javascript
// web/index.html - reemplazar líneas hardcodeadas:
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'tu-url-default';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'tu-key-default';
```

### En Netlify/Vercel:
```
REACT_APP_SUPABASE_URL=https://tu-proyecto.supabase.co
REACT_APP_SUPABASE_ANON_KEY=tu-clave-publica
```

## 📱 Deployment Móvil (React Native)

### Expo:
```bash
npm install -g @expo/cli
expo build:web
expo publish
```

### APK Android:
```bash
expo build:android
```

## 🛡️ Seguridad en Producción

### 1. Supabase RLS (Row Level Security)
```sql
-- Habilitar RLS para producción
ALTER TABLE seguridad_dinamica ENABLE ROW LEVEL SECURITY;
ALTER TABLE asistencias ENABLE ROW LEVEL SECURITY;

-- Crear políticas según necesidades
CREATE POLICY "Allow read for authenticated users" ON seguridad_dinamica
    FOR SELECT USING (auth.role() = 'authenticated');
```

### 2. CORS y Dominios
- Configurar dominios permitidos en Supabase
- Restringir acceso a URLs específicas

### 3. Rate Limiting
- Configurar límites en Supabase
- Implementar throttling en frontend

## 📊 Monitoreo

### Logs disponibles en:
- Supabase Dashboard > Logs
- Browser Developer Tools > Console
- Network tab para API calls

### Métricas importantes:
- Tiempo de carga inicial
- Tiempo de respuesta API
- Errores de conexión
- Uso de base de datos

## 🆘 Troubleshooting

### Problemas comunes:
1. **CORS errors**: Verificar configuración de Supabase
2. **404 en tablas**: Ejecutar setup.sql
3. **Permisos**: Verificar RLS y grants
4. **Lentitud**: Revisar índices en BD

### Contacto de soporte:
- GitHub Issues: [repo]/issues
- Email: tu-email@ejemplo.com

---

🎉 **¡Tu aplicación está lista para el mundo!** 🎉