import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { RoleBasedRoute } from './components/RoleBasedRoute';
import { Home } from './components/pages/Home';
import { Login } from './components/pages/Login';
import { Register } from './components/pages/Register';
import { Dashboard } from './components/pages/Dashboard';
import { Vehicles } from './components/pages/Vehicles';
import { EntriesExits } from './components/pages/EntriesExits';
import { Reports } from './components/pages/Reports';
import { Admin } from './components/pages/Admin';
import { Profile } from './components/pages/Profile';
import { Settings } from './components/pages/Settings';
import { Terms } from './components/pages/Terms';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/terms" element={<Terms />} />
            <Route 
              path="/dashboard" 
              element={
                <RoleBasedRoute allowedRoles={['Usuario Sena', 'Vigilante', 'Administrador', 'Visitante']}>
                  <Dashboard />
                </RoleBasedRoute>
              } 
            />
            <Route 
              path="/vehicles" 
              element={
                <RoleBasedRoute allowedRoles={['Usuario Sena', 'Administrador', 'Visitante']}>
                  <Vehicles />
                </RoleBasedRoute>
              } 
            />
            <Route 
              path="/entries-exits" 
              element={
                <RoleBasedRoute allowedRoles={['Vigilante', 'Administrador']}>
                  <EntriesExits />
                </RoleBasedRoute>
              } 
            />
            <Route 
              path="/reports" 
              element={
                <RoleBasedRoute allowedRoles={['Administrador']}>
                  <Reports />
                </RoleBasedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <RoleBasedRoute allowedRoles={['Administrador']}>
                  <Admin />
                </RoleBasedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <RoleBasedRoute allowedRoles={['Usuario Sena', 'Vigilante', 'Administrador', 'Visitante']}>
                  <Profile />
                </RoleBasedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <RoleBasedRoute allowedRoles={['Usuario Sena', 'Vigilante', 'Administrador', 'Visitante']}>
                  <Settings />
                </RoleBasedRoute>
              } 
            />
            {/* Catch-all route - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
        <Toaster 
          position="top-center" 
          richColors 
          toastOptions={{ 
            style: { 
              fontSize: '1.25rem', 
              padding: '20px', 
              justifyContent: 'center' 
            } 
          }} 
        />
      </Router>
    </AuthProvider>
  );
}
