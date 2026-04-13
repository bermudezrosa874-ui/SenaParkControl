# SenaParkControl

Sistema de Gestión de Parqueaderos del SENA - Aplicación Web Institucional

**Desarrollado por:** Alison y Rosalinda

## 📋 Descripción

SenaParkControl es una aplicación web completa para la gestión de parqueaderos del Servicio Nacional de Aprendizaje (SENA). El sistema permite controlar el registro de vehículos, entradas y salidas, generar reportes y administrar usuarios según roles específicos.

## ✨ Características Principales

- 🚗 **Registro de Vehículos**: Gestión completa de vehículos de estudiantes, instructores y visitantes
- ⏰ **Control de Acceso**: Registro en tiempo real de entradas y salidas
- 📊 **Reportes y Estadísticas**: Análisis detallado del uso del parqueadero
- 👥 **Sistema de Roles**: 4 tipos de usuarios con permisos específicos
- 🔒 **Autenticación Segura**: Sistema de login con selección de rol
- 📱 **Diseño Responsive**: Funciona en cualquier dispositivo

## 👤 Roles del Sistema

### 1. **Estudiante** (Azul)
- Ver información personal
- Registrar vehículos propios
- Consultar historial de entradas/salidas

### 2. **Instructor** (Morado)
- Ver información personal
- Registrar vehículos propios
- Acceso prioritario al sistema

### 3. **Guardia de Seguridad** (Naranja)
- Registrar entradas de vehículos
- Registrar salidas de vehículos
- Control de acceso al parqueadero

### 4. **Administrador** (Verde)
- Acceso completo al sistema
- Gestión de usuarios
- Generación de reportes
- Panel de administración

## 🛠️ Tecnologías Utilizadas

- **React** - Framework de JavaScript para interfaces de usuario
- **TypeScript** - Tipado estático para JavaScript
- **React Router** - Navegación entre páginas
- **Tailwind CSS** - Framework de estilos CSS
- **Lucide React** - Biblioteca de iconos
- **Recharts** - Gráficos y visualizaciones
- **Sonner** - Notificaciones toast

## 📁 Estructura del Proyecto

```
SenaParkControl/
├── App.tsx                      # Componente principal y rutas
├── contexts/
│   └── AuthContext.tsx         # Contexto de autenticación y roles
├── components/
│   ├── Layout.tsx              # Navegación y footer
│   ├── RoleBasedRoute.tsx      # Protección de rutas por rol
│   ├── pages/                  # Páginas de la aplicación
│   │   ├── Home.tsx           # Página de inicio/landing
│   │   ├── Login.tsx          # Inicio de sesión
│   │   ├── Dashboard.tsx      # Panel principal
│   │   ├── Vehicles.tsx       # Gestión de vehículos
│   │   ├── EntriesExits.tsx   # Entradas y salidas
│   │   ├── Reports.tsx        # Reportes y estadísticas
│   │   ├─��� Admin.tsx          # Panel de administración
│   │   ├── Profile.tsx        # Perfil de usuario
│   │   └── Settings.tsx       # Configuración
│   └── ui/                     # Componentes de interfaz reutilizables
└── styles/
    └── globals.css            # Estilos globales
```

## 🚀 Instalación y Uso

### Requisitos Previos
- Node.js (versión 16 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clonar o descargar el proyecto**
   ```bash
   cd SenaParkControl
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:5173
   ```

### Compilar para producción
```bash
npm run build
```

## 🔑 Credenciales de Prueba

El sistema incluye usuarios de prueba para cada rol:

| Rol | Email | Contraseña |
|-----|-------|------------|
| Estudiante | estudiante@sena.edu.co | estudiante123 |
| Instructor | instructor@sena.edu.co | instructor123 |
| Guardia | guardia@sena.edu.co | guardia123 |
| Administrador | admin@sena.edu.co | admin123 |

## 📄 Páginas del Sistema

1. **Home (/)** - Landing page con información del sistema
2. **Login (/login)** - Inicio de sesión con selección de rol
3. **Dashboard (/dashboard)** - Panel principal adaptativo por rol
4. **Vehículos (/vehicles)** - Registro y gestión de vehículos
5. **Entradas/Salidas (/entries-exits)** - Control de acceso
6. **Reportes (/reports)** - Estadísticas y análisis
7. **Administración (/admin)** - Gestión de usuarios y sistema
8. **Mi Perfil (/profile)** - Información del usuario
9. **Configuración (/settings)** - Ajustes personales

## 🎨 Paleta de Colores por Rol

- **Verde** (#059669): Administrador
- **Naranja** (#EA580C): Guardia de Seguridad
- **Morado** (#9333EA): Instructor
- **Azul** (#2563EB): Estudiante

## 📊 Funcionalidades por Página

### Dashboard
- Estadísticas personalizadas según el rol
- Gráficos de uso del parqueadero
- Accesos rápidos a funciones principales

### Vehículos
- Registro de nuevos vehículos
- Lista de vehículos registrados
- Edición y eliminación de vehículos
- Búsqueda y filtros

### Entradas/Salidas
- Registro rápido de entrada
- Registro rápido de salida
- Lista de vehículos en parqueadero
- Validación de permisos

### Reportes
- Estadísticas de uso por período
- Reportes por tipo de usuario
- Gráficos de tendencias
- Exportación de datos

### Administración
- Gestión de usuarios
- Configuración del sistema
- Logs de actividad
- Mantenimiento

## 🔐 Seguridad

- Sistema de autenticación basado en contexto de React
- Rutas protegidas por rol
- Validación de permisos en cada acción
- Sesiones persistentes con localStorage

## 📱 Responsive Design

La aplicación está optimizada para funcionar en:
- 💻 Computadoras de escritorio
- 💻 Laptops
- 📱 Tablets
- 📱 Smartphones

## 🤝 Créditos

**Desarrolladores:**
- Alison
- Rosalinda

**Institución:**
- SENA (Servicio Nacional de Aprendizaje)

## 📞 Soporte

Para soporte técnico o consultas:
- Email: asistencia.senaparkcontrol@gmail.com
- Línea Nacional: 5925555

## 📝 Licencia

Este proyecto fue desarrollado como parte de un proyecto educativo del SENA.

---

© 2025 SENA - Todos los derechos reservados
Desarrollado por Alison y Rosalinda
