-- Script de configuración para Sistema de Asistencia Personal
-- Ejecutar en Supabase SQL Editor

-- 1. Crear tabla de asistencias (si no existe)
CREATE TABLE IF NOT EXISTS asistencias (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    personal_id BIGINT REFERENCES seguridad_dinamica(id),
    fecha DATE DEFAULT CURRENT_DATE,
    hora_entrada TIME,
    hora_salida TIME,
    presente BOOLEAN DEFAULT TRUE,
    observaciones TEXT,
    UNIQUE(personal_id, fecha)
);

-- 2. Deshabilitar Row Level Security (para acceso público)
ALTER TABLE seguridad_dinamica DISABLE ROW LEVEL SECURITY;
ALTER TABLE asistencias DISABLE ROW LEVEL SECURITY;

-- 3. Otorgar permisos al usuario anónimo
GRANT SELECT ON seguridad_dinamica TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON asistencias TO anon;
GRANT USAGE ON SEQUENCE asistencias_id_seq TO anon;

-- 4. Otorgar permisos al usuario autenticado
GRANT SELECT ON seguridad_dinamica TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON asistencias TO authenticated;
GRANT USAGE ON SEQUENCE asistencias_id_seq TO authenticated;

-- 5. Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_asistencias_personal_fecha 
ON asistencias(personal_id, fecha);

CREATE INDEX IF NOT EXISTS idx_asistencias_fecha 
ON asistencias(fecha);

CREATE INDEX IF NOT EXISTS idx_seguridad_dinamica_inst 
ON seguridad_dinamica("INST.");

CREATE INDEX IF NOT EXISTS idx_seguridad_dinamica_rango 
ON seguridad_dinamica(RANGO);

-- 6. Verificar estructura de datos
-- Ejecutar para confirmar que todo está correcto:
-- SELECT COUNT(*) as total_personal FROM seguridad_dinamica;
-- SELECT COUNT(*) as total_asistencias_hoy FROM asistencias WHERE fecha = CURRENT_DATE;