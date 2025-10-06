// Ejemplo de configuración para Supabase
// Copia este archivo como config.js y completa tus datos

export const SUPABASE_CONFIG = {
    // Tu URL de Supabase (encuentra en Project Settings > API)
    url: 'https://tu-proyecto.supabase.co',
    
    // Tu clave pública/anon (encuentra en Project Settings > API)
    anonKey: 'tu-clave-publica-aqui',
    
    // Configuraciones opcionales
    options: {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
};

// Ejemplo de estructura de base de datos requerida
export const DATABASE_SCHEMA = {
    // Tabla principal del personal (debe existir)
    seguridad_dinamica: {
        id: 'BIGINT PRIMARY KEY',
        created_at: 'TIMESTAMP',
        'No.': 'INTEGER',
        RANGO: 'VARCHAR',
        APELLIDOS: 'VARCHAR',
        NOMBRES: 'VARCHAR',
        'INST.': 'VARCHAR', // ERD, ARD, FARD, PN
        CÉDULA: 'VARCHAR'
    },
    
    // Tabla de asistencias (se crea automáticamente)
    asistencias: {
        id: 'BIGINT PRIMARY KEY',
        created_at: 'TIMESTAMP DEFAULT NOW()',
        personal_id: 'BIGINT REFERENCES seguridad_dinamica(id)',
        fecha: 'DATE DEFAULT CURRENT_DATE',
        hora_entrada: 'TIME',
        hora_salida: 'TIME', 
        presente: 'BOOLEAN DEFAULT TRUE',
        observaciones: 'TEXT',
        'UNIQUE(personal_id, fecha)': true
    }
};

// Configuración de permisos requeridos en Supabase
export const REQUIRED_PERMISSIONS = {
    tables: {
        seguridad_dinamica: ['SELECT'],
        asistencias: ['SELECT', 'INSERT', 'UPDATE', 'DELETE']
    },
    rls: {
        // Row Level Security debe estar deshabilitado o configurado apropiadamente
        seguridad_dinamica: 'DISABLE',
        asistencias: 'DISABLE'
    }
};