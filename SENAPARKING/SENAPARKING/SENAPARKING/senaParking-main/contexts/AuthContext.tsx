import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'Usuario Sena' | 'Administrador' | 'Vigilante' | 'Visitante';

interface User {
  name: string;
  email: string;
  role: UserRole;
  foto?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Mapeo de roles a IDs de la base de datos
  const roleMapping: Record<UserRole, number> = {
    'Usuario Sena': 1,
    'Administrador': 2, 
    'Vigilante': 3,
    'Visitante': 4,
  };

  const register = async (formData: any) => {
    try {
      // Mapeamos los campos del formulario a lo que espera el Backend
      const payload = {
        idRol: roleMapping[formData.role as UserRole] || 1,
        nombreCompleto: formData.name,
        documento: formData.documento,
        correo: formData.email,
        telefono: formData.telefono,
        contrasena: formData.password,
        foto: formData.foto
      };

      // Guardar localmente para que Administrador y Vigilante puedan ver el historial de registros
      const savedUsers = JSON.parse(localStorage.getItem('sp_users') || '[]');
      const newUser = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        role: formData.role,
        documento: formData.documento,
        telefono: formData.telefono,
        foto: formData.foto,
        status: 'Pendiente',
        registrationDate: new Date().toLocaleString()
      };
      localStorage.setItem('sp_users', JSON.stringify([newUser, ...savedUsers]));

      const response = await fetch('http://127.0.0.1:4000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en registro');
      }
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('http://127.0.0.1:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: email, contrasena: password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Credenciales inválidas');
      }

      const { token, user: userData } = await response.json();
      
      // Verificar si el usuario está pendiente en el almacenamiento local
      const localUsers = JSON.parse(localStorage.getItem('sp_users') || '[]');
      const pendingUser = localUsers.find((u: any) => u.email === email);
      if (pendingUser && pendingUser.status === 'Pendiente') {
        throw new Error('Tu cuenta está en revisión. Un administrador o vigilante debe aprobarla antes de poder ingresar.');
      }
      if (pendingUser && pendingUser.status === 'Inactivo') {
        throw new Error('Tu cuenta ha sido inactivada. Por favor, contacta al administrador.');
      }

      // Guardar el token en el almacenamiento local
      localStorage.setItem('sp_token', token);

      // Buscar rol devuelto por el backend
      let dbRole = userData.idRolName || userData.rol || userData.role;
      let dbFoto = userData.foto || userData.Foto;

      // Intentar recuperar el rol desde el almacenamiento local como respaldo si el backend falla
      if (!dbRole || !dbFoto) {
        const localUsers = JSON.parse(localStorage.getItem('sp_users') || '[]');
        const localUser = localUsers.find((u: any) => u.email === email);
        if (localUser) {
          if (!dbRole) dbRole = localUser.role;
          if (!dbFoto) dbFoto = localUser.foto;
        }
      }

      // Normalizamos el rol: Si es Aprendiz o Instructor, lo tratamos como Usuario Sena
      const normalizedRole = (dbRole === 'Aprendiz' || dbRole === 'Instructor') 
        ? 'Usuario Sena' 
        : (dbRole || 'Usuario Sena');

      setUser({
        name: userData.nombre,
        email: userData.correo,
        role: normalizedRole as UserRole,
        foto: dbFoto
      });
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('sp_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register,
      logout,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
