import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Shield, Lock, Mail, ArrowRight, CheckCircle2, KeyRound, ArrowLeft } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetStep, setResetStep] = useState<1 | 2>(1);
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      
      // Le damos 300ms al navegador para detectar el envío antes de cambiar al panel
      setTimeout(() => {
        navigate('/dashboard');
      }, 300);
    } catch (error: any) {
      toast.error('¡Oh no! 🚨 Hubo un problema al iniciar sesión: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:4000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: resetEmail }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error al solicitar código');
      
      toast.success('¡Listo! ✉️ El código de seguridad está volando hacia tu bandeja de entrada.');
      setResetStep(2);
    } catch (error: any) {
      toast.error('¡Oh no! 🚨 Algo salió mal: ' + error.message);
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar la nueva contraseña con las reglas de seguridad
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{5,}$/;
    if (!passwordRegex.test(newPassword)) {
      toast.error('La nueva contraseña debe tener al menos 5 caracteres, incluyendo letras y números.');
      return;
    }

    setResetLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:4000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          correo: resetEmail, 
          codigo: resetCode, 
          nuevaContrasena: newPassword 
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error al cambiar contraseña');
      
      toast.success('¡Contraseña renovada! 🔐 Ya tienes las llaves para entrar de nuevo.');
      setIsResetting(false);
      setResetStep(1);
      setResetEmail('');
      setResetCode('');
      setNewPassword('');
    } catch (error: any) {
      toast.error('¡Oh no! 🚨 Algo salió mal: ' + error.message);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 py-4 px-4">
      <div className="max-w-6xl w-full">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left side - Information */}
          <div className="hidden md:block">
            <div className="pr-8">
              <div className="inline-flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full mb-6">
                <Shield className="w-4 h-4 text-green-700" />
                <span className="text-sm text-green-700">Acceso Seguro SENA</span>
              </div>
              
              <h1 className="text-4xl mb-4">
                Bienvenido a SenaParkControl
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Sistema de gestión de parqueaderos institucional del SENA
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold">Control de Acceso en Tiempo Real</p>
                    <p className="text-gray-600 text-sm">Monitorea entradas y salidas instantáneamente</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold">Gestión Completa de Vehículos</p>
                    <p className="text-gray-600 text-sm">Registra y administra todos los vehículos autorizados</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold">Reportes y Estadísticas</p>
                    <p className="text-gray-600 text-sm">Análisis detallado del uso del parqueadero</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Login form */}
          <div>
            <Card className="border-2 shadow-xl">
              <CardContent className="pt-8 pb-8 px-8">
                {isResetting ? (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <KeyRound className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-2xl mb-2">Recuperar Contraseña</h2>
                      <p className="text-gray-600">
                        {resetStep === 1 
                          ? 'Ingresa tu correo para recibir un código de acceso' 
                          : 'Ingresa el código recibido y tu nueva contraseña'}
                      </p>
                    </div>

                    {resetStep === 1 ? (
                      <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="reset-email">Correo Electrónico</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                              id="reset-email"
                              type="email"
                              placeholder="usuario@sena.edu.co"
                              value={resetEmail}
                              onChange={(e) => setResetEmail(e.target.value)}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" size="lg" disabled={resetLoading}>
                          {resetLoading ? 'Enviando...' : 'Enviar Código'}
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                      </form>
                    ) : (
                      <form onSubmit={handleResetPasswordSubmit} className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="reset-code">Código de Verificación</Label>
                          <div className="relative">
                            <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                              id="reset-code"
                              type="text"
                              placeholder="123456"
                              value={resetCode}
                              onChange={(e) => setResetCode(e.target.value)}
                              className="pl-10 tracking-widest font-bold text-center"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-password">Nueva Contraseña</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                              id="new-password"
                              type="password"
                              placeholder="••••••••"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" size="lg" disabled={resetLoading}>
                          {resetLoading ? 'Actualizando...' : 'Guardar Contraseña'}
                          <CheckCircle2 className="ml-2 w-5 h-5" />
                        </Button>
                      </form>
                    )}

                    <div className="mt-6 text-center border-t border-gray-200 pt-6">
                      <button 
                        type="button" 
                        onClick={() => { setIsResetting(false); setResetStep(1); }}
                        className="text-sm text-gray-600 hover:text-gray-900 inline-flex items-center font-semibold cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Volver al Inicio de Sesión
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-2xl mb-2">Iniciar Sesión</h2>
                      <p className="text-gray-600">Ingresa tus credenciales para acceder al sistema</p>
                    </div>

                    <form onSubmit={handleSubmit} method="POST" action="#" className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="usuario@sena.edu.co"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        autoComplete="username"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        autoComplete="current-password"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="remember" 
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      />
                      <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
                        Recordarme
                      </label>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setIsResetting(true)}
                      className="text-sm text-green-600 hover:text-green-700 cursor-pointer bg-transparent border-none"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>

                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" size="lg" disabled={loading}>
                    {loading ? 'Cargando...' : 'Ingresar al Sistema'}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                    </form>
                  </>
                )}

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-center text-sm text-gray-600">
                    ¿No tienes acceso?{' '}
                    <Link to="/register" className="text-green-600 hover:text-green-700 font-semibold">
                     Registrate
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 text-center">
              <Link to="/" className="text-sm text-gray-600 hover:text-gray-900 inline-flex items-center">
                ← Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
