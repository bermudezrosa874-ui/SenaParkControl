# 📥 Guía de Instalación - SenaParkControl

**Proyecto desarrollado por: Alison y Rosalinda**

## 🎯 Objetivo

Esta guía te ayudará a descargar, instalar y ejecutar SenaParkControl en tu computadora local.

## 📋 Requisitos del Sistema

Antes de comenzar, asegúrate de tener instalado:

### 1. Node.js (Requerido)
- **Versión mínima:** 16.0 o superior
- **Descargar:** https://nodejs.org/
- **Verificar instalación:**
  ```bash
  node --version
  npm --version
  ```

### 2. Editor de Código (Recomendado)
- Visual Studio Code: https://code.visualstudio.com/
- O cualquier editor de tu preferencia

### 3. Git (Opcional)
- Para clonar repositorios
- **Descargar:** https://git-scm.com/

## 📁 Paso 1: Obtener el Código

### Opción A: Descargar desde Figma Make

1. En Figma Make, haz clic en el menú de opciones (⋮)
2. Selecciona "Export Code" o "Descargar Código"
3. Guarda el archivo ZIP en tu computadora
4. Descomprime el archivo en una carpeta de tu elección

### Opción B: Copiar Archivos Manualmente

1. Crea una carpeta nueva llamada `SenaParkControl`
2. Copia todos los archivos y carpetas del proyecto
3. Mantén la estructura de carpetas exactamente como está

## 🛠️ Paso 2: Configurar el Proyecto

### 1. Abrir Terminal/Consola

**Windows:**
- Presiona `Win + R`
- Escribe `cmd` y presiona Enter
- Navega a la carpeta: `cd ruta\a\SenaParkControl`

**Mac/Linux:**
- Abre Terminal
- Navega a la carpeta: `cd ruta/a/SenaParkControl`

### 2. Crear package.json

Crea un archivo `package.json` en la raíz del proyecto con este contenido:

```json
{
  "name": "sena-park-control",
  "version": "1.0.0",
  "description": "Sistema de Gestión de Parqueaderos SENA",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.22.0",
    "lucide-react": "^0.344.0",
    "recharts": "^2.12.0",
    "sonner": "^1.4.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.1",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.4.2",
    "vite": "^5.1.6",
    "tailwindcss": "^4.0.0",
    "autoprefixer": "^10.4.18"
  }
}
```

### 3. Crear vite.config.ts

Crea un archivo `vite.config.ts` en la raíz:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
```

### 4. Crear tsconfig.json

Crea un archivo `tsconfig.json` en la raíz:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["."],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 5. Crear tsconfig.node.json

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

### 6. Crear index.html

Crea un archivo `index.html` en la raíz:

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SenaParkControl - Sistema de Gestión de Parqueaderos</title>
    <meta name="description" content="Sistema institucional SENA para gestión de parqueaderos" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/main.tsx"></script>
  </body>
</html>
```

### 7. Crear main.tsx

Crea un archivo `main.tsx` en la raíz:

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

## 📦 Paso 3: Instalar Dependencias

En la terminal, ejecuta:

```bash
npm install
```

Este proceso puede tardar varios minutos dependiendo de tu conexión a internet.

## 🚀 Paso 4: Ejecutar el Proyecto

### Modo Desarrollo

```bash
npm run dev
```

Esto iniciará el servidor de desarrollo. Verás un mensaje como:

```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Abrir en el Navegador

1. Abre tu navegador
2. Visita: `http://localhost:5173`
3. Deberías ver la página de inicio de SenaParkControl

## 🏗️ Paso 5: Compilar para Producción

Cuando estés listo para crear una versión final:

```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`

## ✅ Verificar que Todo Funciona

### Test 1: Página de Inicio
- ✓ Se carga la landing page
- ✓ Los botones funcionan
- ✓ El footer muestra "Alison y Rosalinda"

### Test 2: Login
- ✓ Puedes navegar a /login
- ✓ Puedes seleccionar un rol
- ✓ Puedes iniciar sesión

### Test 3: Dashboard
- ✓ Se carga el dashboard según el rol
- ✓ Las estadísticas se muestran
- ✓ La navegación funciona

## 🐛 Solución de Problemas Comunes

### Error: "npm: command not found"
**Solución:** Instala Node.js desde https://nodejs.org/

### Error: "Cannot find module"
**Solución:** 
```bash
rm -rf node_modules
npm install
```

### Error: "Port 5173 already in use"
**Solución:**
- Cierra otras aplicaciones que usen el puerto
- O usa otro puerto: `npm run dev -- --port 3000`

### Los estilos no se cargan
**Solución:**
- Verifica que el archivo `styles/globals.css` existe
- Verifica que está importado en `main.tsx`

## 📸 Capturar Pantallas para Presentación

### Opción 1: Capturas de Pantalla

**Windows:**
- Presiona `Win + Shift + S`
- Selecciona el área
- Pega en PowerPoint (Ctrl + V)

**Mac:**
- Presiona `Cmd + Shift + 4`
- Selecciona el área
- Arrastra la imagen a tu presentación

### Opción 2: Modo Pantalla Completa

1. Presiona `F11` en el navegador
2. Navega por las páginas
3. Toma capturas sin la barra de navegación del navegador

### Páginas Recomendadas para Capturar

1. ✅ Home (Landing Page)
2. ✅ Login con selección de roles
3. ✅ Dashboard de Estudiante
4. ✅ Dashboard de Guardia
5. ✅ Dashboard de Administrador
6. ✅ Página de Vehículos
7. ✅ Página de Reportes

## 💾 Guardar el Proyecto

### Para Respaldo

1. Copia toda la carpeta `SenaParkControl`
2. Guárdala en:
   - USB
   - Google Drive
   - OneDrive
   - GitHub

### Para Compartir

1. Comprime la carpeta en ZIP
2. Incluye el archivo `README.md`
3. Comparte el ZIP

## 🎓 Próximos Pasos

- [ ] Personalizar colores si es necesario
- [ ] Agregar tu logo institucional
- [ ] Preparar presentación con capturas
- [ ] Hacer pruebas de todos los roles
- [ ] Crear documentación adicional

## 📞 Ayuda

Si tienes problemas:
1. Revisa que todos los archivos estén en su lugar
2. Verifica que Node.js esté instalado
3. Asegúrate de estar en la carpeta correcta
4. Lee los mensajes de error cuidadosamente

---

**Desarrollado por: Alison y Rosalinda**

© 2025 - SenaParkControl - SENA
