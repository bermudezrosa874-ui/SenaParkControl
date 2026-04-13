import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  Car,
  Shield,
  Edit,
  Save,
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

export function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Obtener los datos completos del usuario desde el almacenamiento local
  const allUsers = JSON.parse(localStorage.getItem('sp_users') || '[]');
  const currentUserData = allUsers.find((u: any) => u.email === user?.email);

  const [formData, setFormData] = useState(() => {
    const [first, ...rest] = (currentUserData?.name || user?.name || '').split(' ');
    return {
      firstName: first || '',
      lastName: rest.join(' ') || '',
      email: currentUserData?.email || user?.email || '',
      phone: currentUserData?.telefono || '',
      document: currentUserData?.documento || '',
      address: currentUserData?.direccion || ''
    };
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validar nombre y apellido para no permitir números
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!nameRegex.test(formData.firstName) || !nameRegex.test(formData.lastName)) {
      toast.error('El nombre y apellido solo pueden contener letras y espacios, sin números.');
      return;
    }

    const updatedUsers = allUsers.map((u: any) => {
      if (u.email === user?.email) {
        return {
          ...u,
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          telefono: formData.phone,
          documento: formData.document,
          direccion: formData.address
        };
      }
      return u;
    });
    localStorage.setItem('sp_users', JSON.stringify(updatedUsers));
    toast.success('¡Estilo renovado! 💅 Tu perfil ha sido actualizado. Inicia sesión nuevamente para lucir los cambios globales.');
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error('¡Ojo ahí! 👀 Las contraseñas nuevas no son gemelas. Inténtalo de nuevo.');
      return;
    }

    // Validar que la nueva contraseña cumpla con las políticas de seguridad
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{5,}$/;
    if (!passwordRegex.test(passwords.new)) {
      toast.error('La nueva contraseña debe tener al menos 5 caracteres, incluyendo letras y números.');
      return;
    }

    if (!passwords.current || !passwords.new) {
      toast.error('¡No te saltes ningún campo de contraseña, todos son importantes! 🗝️');
      return;
    }
    toast.success('¡Fortaleza asegurada! 🏰 Tu contraseña se actualizó correctamente.');
    setPasswords({ current: '', new: '', confirm: '' });
  };

  const resetProfileForm = () => {
    const [first, ...rest] = (currentUserData?.name || user?.name || '').split(' ');
    setFormData({
      firstName: first || '',
      lastName: rest.join(' ') || '',
      email: currentUserData?.email || user?.email || '',
      phone: currentUserData?.telefono || '',
      document: currentUserData?.documento || '',
      address: currentUserData?.direccion || ''
    });
  };

  // Obtener vehículos reales del usuario desde el almacenamiento local
  const allVehicles = JSON.parse(localStorage.getItem('sp_vehicles') || '[]');
  const userVehicles = allVehicles.filter((v: any) => v.owner === user?.name);

  // Limpiar actividad falsa
  const recentActivity: any[] = [];

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Mi Perfil</h1>
          <p className="text-gray-600">Información personal y configuración de cuenta</p>
        </div>

        {/* Profile Header Card */}
        <Card className="mb-8 bg-gradient-to-r from-green-600 to-green-700 text-white">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="w-24 h-24 border-4 border-white relative overflow-hidden">
                {currentUserData?.foto && <AvatarImage src={currentUserData.foto} alt="Perfil" className="object-cover" />}
                <AvatarFallback className="bg-white text-green-700 text-3xl font-bold">
                  {user?.name ? user.name.substring(0, 2).toUpperCase() : 'US'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl mb-2 font-semibold">{user?.name || 'Usuario'}</h2>
                <p className="text-green-100 mb-4">{user?.email || 'usuario@sena.edu.co'}</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge className="bg-white text-green-700">
                    <Shield className="w-3 h-3 mr-1" />
                    {user?.role || 'Usuario Sena'}
                  </Badge>
                  <Badge className="bg-white/20 text-white">
                    Acceso a su información personal
                  </Badge>
                </div>
              </div>
              <Button variant="secondary" onClick={() => document.getElementById('firstName')?.focus()}>
                <Edit className="w-4 h-4 mr-2" />
                Editar Perfil
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Personal Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Información Personal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleProfileSubmit}>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nombre</Label>
                      <Input id="firstName" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Apellido</Label>
                      <Input id="lastName" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="pl-10" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input id="phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="pl-10" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="document">Documento</Label>
                      <Input id="document" value={formData.document} onChange={(e) => setFormData({...formData, document: e.target.value})} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Dirección</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input id="address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="pl-10" />
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button type="submit" className="bg-green-600 hover:bg-green-700">
                      <Save className="w-4 h-4 mr-2" />
                      Guardar Cambios
                    </Button>
                    <Button type="button" variant="outline" onClick={resetProfileForm}>Cancelar</Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* My Vehicles */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Car className="w-5 h-5 mr-2" />
                    Mis Vehículos
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={() => navigate('/vehicles')}>Agregar Vehículo</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userVehicles.length > 0 ? (
                    userVehicles.map((vehicle: any) => (
                      <div key={vehicle.id} className="p-4 bg-gray-50 rounded-lg border-2 border-green-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                              <Car className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-lg">{vehicle.plate}</p>
                              <Badge className="bg-green-100 text-green-700 text-xs">
                                {vehicle.status}
                              </Badge>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => navigate('/vehicles')}>
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-gray-500">Tipo</p>
                            <p className="font-medium">{vehicle.type || '-'}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Marca</p>
                            <p className="font-medium">{vehicle.brand || '-'}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Modelo</p>
                            <p className="font-medium">{vehicle.model || '-'}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Año</p>
                            <p className="font-medium">{vehicle.year || '-'}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Color</p>
                            <p className="font-medium">{vehicle.color || '-'}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      Aún no tienes vehículos registrados.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Seguridad
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handlePasswordSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Contraseña Actual</Label>
                    <Input id="currentPassword" type="password" value={passwords.current} onChange={(e) => setPasswords({...passwords, current: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nueva Contraseña</Label>
                    <Input id="newPassword" type="password" value={passwords.new} onChange={(e) => setPasswords({...passwords, new: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                    <Input id="confirmPassword" type="password" value={passwords.confirm} onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} />
                  </div>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    Cambiar Contraseña
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas de Cuenta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm text-gray-600">Total Ingresos</span>
                    <span className="text-2xl font-semibold">0</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm text-gray-600">Este Mes</span>
                    <span className="text-2xl font-semibold">0</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <span className="text-sm text-gray-600">Promedio Diario</span>
                    <span className="text-2xl font-semibold">0</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity) => (
                      <div key={activity.id} className="pb-3 border-b last:border-0">
                        <div className="flex items-center justify-between mb-1">
                          <Badge 
                            className={`text-xs ${
                              activity.action === 'Entrada' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {activity.action}
                          </Badge>
                          <span className="text-xs text-gray-500">{activity.time}</span>
                        </div>
                        <p className="text-xs text-gray-600">{activity.location}</p>
                        <p className="text-xs text-gray-500 flex items-center mt-1">
                          <Calendar className="w-3 h-3 mr-1" />
                          {activity.date}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500 text-sm">
                      No hay actividad reciente.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/vehicles')}>
                    <Car className="w-4 h-4 mr-2" />
                    Registrar Vehículo
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/entries-exits')}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Ver Historial
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = 'mailto:asistencia.senaparkcontrol@gmail.com'}>
                    <Mail className="w-4 h-4 mr-2" />
                    Contactar Soporte
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 mt-4"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
