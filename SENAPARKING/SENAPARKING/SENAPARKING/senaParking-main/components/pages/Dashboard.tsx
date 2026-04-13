import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { 
  Car, 
  TrendingUp, 
  Users, 
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  XCircle,
  LogOut,
  User
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

export function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const [vehicles, setVehicles] = useState<any[]>(() => {
    const saved = localStorage.getItem('sp_vehicles');
    if (saved) return JSON.parse(saved);
    return [];
  });
  const pendingVehicles = vehicles.filter(v => v.status === 'Pendiente');

  const handleApproveVehicle = (id: number) => {
    const updated = vehicles.map(v => v.id === id ? { ...v, status: 'Activo' } : v);
    setVehicles(updated);
    localStorage.setItem('sp_vehicles', JSON.stringify(updated));
    toast.success('¡Luz verde! 🟢 El vehículo ahora es oficial en SenaParkControl.');
  };

  const handleRejectVehicle = (id: number) => {
    const updated = vehicles.map(v => v.id === id ? { ...v, status: 'Inactivo' } : v);
    setVehicles(updated);
    localStorage.setItem('sp_vehicles', JSON.stringify(updated));
    toast.success('Vehículo rechazado exitosamente');
  };

  const [movements, setMovements] = useState<any[]>(() => {
    return JSON.parse(localStorage.getItem('sp_movements') || '[]');
  });

  const [entryRequests, setEntryRequests] = useState<any[]>(() => {
    return JSON.parse(localStorage.getItem('sp_entry_requests') || '[]');
  });

  const [exitRequests, setExitRequests] = useState<any[]>(() => {
    return JSON.parse(localStorage.getItem('sp_exit_requests') || '[]');
  });

  const isVehicleInside = (plate: string) => {
    const vehicleMovements = movements.filter(m => m.plate === plate);
    if (vehicleMovements.length === 0) return false;
    return vehicleMovements[0].type === 'Entrada';
  };

  const handleRequestEntry = (vehicle: any) => {
    const alreadyRequested = entryRequests.find(r => r.plate === vehicle.plate);
    if (alreadyRequested) return toast.error('¡Calma motor! 🏎️ Ya tienes una solicitud de entrada rodando para este vehículo.');
    
    const newRequest = {
      id: Date.now(),
      plate: vehicle.plate,
      owner: vehicle.owner,
      role: vehicle.role,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().split('T')[0]
    };
    const updated = [...entryRequests, newRequest];
    setEntryRequests(updated);
    localStorage.setItem('sp_entry_requests', JSON.stringify(updated));
    toast.success('¡Permiso solicitado! 🎫 El guardia ya tiene tu solicitud de entrada.');
  };

  const handleApproveEntry = (req: any) => {
    const newMovement = {
      id: Date.now(),
      plate: req.plate,
      type: 'Entrada',
      owner: req.owner,
      role: req.role,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      guard: user?.name || 'Sistema',
      observations: 'Entrada autorizada desde la app.'
    };
    const updatedMovements = [newMovement, ...movements];
    setMovements(updatedMovements);
    localStorage.setItem('sp_movements', JSON.stringify(updatedMovements));

    const updatedReqs = entryRequests.filter(r => r.id !== req.id);
    setEntryRequests(updatedReqs);
    localStorage.setItem('sp_entry_requests', JSON.stringify(updatedReqs));
    toast.success('¡Pase concedido! 🚦 Entrada aprobada y registrada en bitácora.');
  };

  const handleRejectEntry = (id: number) => {
    const updated = entryRequests.filter(r => r.id !== id);
    setEntryRequests(updated);
    localStorage.setItem('sp_entry_requests', JSON.stringify(updated));
    toast.success('Entrada rechazada');
  };

  const handleRequestExit = (vehicle: any) => {
    const alreadyRequested = exitRequests.find(r => r.plate === vehicle.plate);
    if (alreadyRequested) return toast.error('¡Frena un poco! 🛑 Ya tienes una solicitud de salida en proceso.');
    
    const newRequest = {
      id: Date.now(),
      plate: vehicle.plate,
      owner: vehicle.owner,
      role: vehicle.role,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().split('T')[0]
    };
    const updated = [...exitRequests, newRequest];
    setExitRequests(updated);
    localStorage.setItem('sp_exit_requests', JSON.stringify(updated));
    toast.success('¡Solicitud de salida enviada! 🛣️ El guardia te abrirá pronto.');
  };

  const handleApproveExit = (req: any) => {
    const newMovement = {
      id: Date.now(),
      plate: req.plate,
      type: 'Salida',
      owner: req.owner,
      role: req.role,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      guard: user?.name || 'Sistema',
      observations: 'Salida autorizada desde la app.'
    };
    const updatedMovements = [newMovement, ...movements];
    setMovements(updatedMovements);
    localStorage.setItem('sp_movements', JSON.stringify(updatedMovements));

    const updatedReqs = exitRequests.filter(r => r.id !== req.id);
    setExitRequests(updatedReqs);
    localStorage.setItem('sp_exit_requests', JSON.stringify(updatedReqs));
    toast.success('¡Buen viaje! 🚗 Salida aprobada y registrada exitosamente.');
  };

  const handleRejectExit = (id: number) => {
    const updated = exitRequests.filter(r => r.id !== id);
    setExitRequests(updated);
    localStorage.setItem('sp_exit_requests', JSON.stringify(updated));
    toast.success('Salida denegada');
  };

  const [alerts] = useState<any[]>(() => {
    const savedNotifs = JSON.parse(localStorage.getItem('sp_notifications') || '[]');
    return savedNotifs;
  });

  const [registeredUsers, setRegisteredUsers] = useState<any[]>(() => {
    return JSON.parse(localStorage.getItem('sp_users') || '[]');
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const entradasHoy = movements.filter(m => m.type === 'Entrada' && m.date === todayStr).length;
  const salidasHoy = movements.filter(m => m.type === 'Salida' && m.date === todayStr).length;
  const vehiculosDentro = vehicles.filter(v => isVehicleInside(v.plate)).length;

  const stats = [
    {
      title: 'Vehículos Registrados',
      value: vehicles.length.toString(),
      change: 'Total en sistema',
      trend: 'up',
      icon: Car,
      color: 'green',
    },
    {
      title: 'En el Parqueadero',
      value: vehiculosDentro.toString(),
      change: `${Math.round((vehiculosDentro / 130) * 100)}% capacidad`,
      trend: 'neutral',
      icon: CheckCircle2,
      color: 'blue',
    },
    {
      title: 'Entradas Hoy',
      value: entradasHoy.toString(),
      change: 'Movimientos del día',
      trend: entradasHoy > 0 ? 'up' : 'neutral',
      icon: TrendingUp,
      color: 'orange',
    },
    {
      title: 'Alertas Activas',
      value: alerts?.filter(a => a.severity === 'high').length.toString() || '0',
      change: alerts?.filter(a => a.severity === 'high').length > 0 ? 'Requieren atención' : 'Todo en orden',
      trend: alerts?.filter(a => a.severity === 'high').length > 0 ? 'down' : 'neutral',
      icon: AlertCircle,
      color: 'red',
    },
  ];

  const recentActivity = movements.slice(0, 5).map((m: any) => ({
    id: m.id,
    type: m.type,
    plate: m.plate,
    user: m.owner,
    time: m.time,
    date: m.date,
    status: 'success'
  }));

  const handleApproveUser = (id: number) => {
    const updated = registeredUsers.map(u => u.id === id ? { ...u, status: 'Activo' } : u);
    setRegisteredUsers(updated);
    localStorage.setItem('sp_users', JSON.stringify(updated));
    toast.success('Usuario aprobado exitosamente');
  };

  const handleRejectUser = (id: number) => {
    const updated = registeredUsers.map(u => u.id === id ? { ...u, status: 'Inactivo' } : u);
    setRegisteredUsers(updated);
    localStorage.setItem('sp_users', JSON.stringify(updated));
    toast.success('Usuario rechazado exitosamente');
  };

  const handleInactivateUser = (id: number) => {
    const updated = registeredUsers.map(u => u.id === id ? { ...u, status: 'Inactivo' } : u);
    setRegisteredUsers(updated);
    localStorage.setItem('sp_users', JSON.stringify(updated));
    toast.success('Usuario inactivado exitosamente');
  };

  const handleActivateUser = (id: number) => {
    const updated = registeredUsers.map(u => u.id === id ? { ...u, status: 'Activo' } : u);
    setRegisteredUsers(updated);
    localStorage.setItem('sp_users', JSON.stringify(updated));
    toast.success('Usuario reactivado exitosamente');
  };

  // Renderizar contenido según el rol
  const renderContent = () => {
    switch (user?.role) {
      case 'Usuario Sena':
      case 'Visitante':
        return renderStudentInstructorDashboard();
      case 'Vigilante':
        return renderGuardDashboard();
      case 'Administrador':
        return renderAdminDashboard();
      default:
        return null;
    }
  };

  const renderStudentInstructorDashboard = () => {
    const myVehicles = vehicles.filter(v => v.owner === user?.name);

    return (
    <div className="bg-gray-50 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl mb-1">Bienvenido, {user?.name}</h1>
            <p className="text-gray-600 text-sm">Gestiona tu información y vehículos registrados</p>
          </div>
          <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Mis Vehículos</p>
                  <p className="text-3xl">{myVehicles.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Car className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Ingresos Este Mes</p>
                  <p className="text-3xl">{movements.filter(m => m.owner === user?.name && m.type === 'Entrada').length}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Estado</p>
                  <p className="text-xl">Activo</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" >
            <Link to="/vehicles">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <Car className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl mb-1">Mis Vehículos / Registrar</h3>
                    <p className="text-gray-600 text-sm">Añade o gestiona tus vehículos aquí</p>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" >
            <Link to="/profile">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl mb-1">Mi Perfil</h3>
                    <p className="text-gray-600 text-sm">Actualizar información personal</p>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* My Vehicle Info */}
        <Card>
          <CardHeader>
            <CardTitle>Mis Vehículos Registrados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myVehicles.length > 0 ? myVehicles.map(v => (
                <div key={v.id} className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center overflow-hidden relative">
                        {v.foto ? (
                          <img src={v.foto} alt="Vehículo" className="w-full h-full object-cover absolute top-0 left-0 z-10" />
                        ) : (
                          <Car className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-lg">{v.plate}</p>
                        <p className="text-sm text-gray-600 mb-1">{v.brand} {v.model} {v.year ? `- ${v.year}` : ''} - {v.color}</p>
                        {v.status === 'Activo' && (
                          <span className={`text-xs px-2 py-1 rounded-full w-fit ${isVehicleInside(v.plate) ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                            {isVehicleInside(v.plate) ? '📍 En Parqueadero' : '🚗 Fuera'}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {v.status === 'Activo' ? <CheckCircle2 className="w-6 h-6 text-green-600" /> : <Clock className="w-6 h-6 text-orange-600" />}
                      {v.status === 'Activo' && (
                        isVehicleInside(v.plate) ? (
                          <Button size="sm" variant={exitRequests.find(r => r.plate === v.plate) ? "secondary" : "outline"} className={exitRequests.find(r => r.plate === v.plate) ? "bg-blue-100 text-blue-700 pointer-events-none" : "text-blue-600 border-blue-600 hover:bg-blue-50"} onClick={() => handleRequestExit(v)}>
                            {exitRequests.find(r => r.plate === v.plate) ? 'Salida Solicitada' : 'Solicitar Salida'}
                          </Button>
                        ) : (
                          <Button size="sm" variant={entryRequests.find(r => r.plate === v.plate) ? "secondary" : "outline"} className={entryRequests.find(r => r.plate === v.plate) ? "bg-green-100 text-green-700 pointer-events-none" : "text-green-600 border-green-600 hover:bg-green-50"} onClick={() => handleRequestEntry(v)}>
                            {entryRequests.find(r => r.plate === v.plate) ? 'Entrada Solicitada' : 'Solicitar Entrada'}
                          </Button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-gray-500">Aún no tienes vehículos registrados.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )};

  const renderGuardDashboard = () => (
    <div className="bg-gray-50 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl mb-1">Panel del Guardia</h1>
            <p className="text-gray-600 text-sm">Control de entradas y salidas del parqueadero</p>
          </div>
          <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>

        {/* Guard Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Entradas Hoy</p>
                  <p className="text-3xl">{entradasHoy}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <ArrowUpRight className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Salidas Hoy</p>
                  <p className="text-3xl">{salidasHoy}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <ArrowDownRight className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Vehículos Actuales</p>
                  <p className="text-3xl">{vehiculosDentro}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Car className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Capacidad</p>
                  <p className="text-3xl">{Math.round((vehiculosDentro / 130) * 100)}%</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Action Button */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white hover:shadow-xl transition-shadow">
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="text-2xl mb-4">Registrar Movimiento</h2>
                <Button size="lg" className="bg-white text-green-700 hover:bg-green-50" >
                  <Link to="/entries-exits">
                    <Clock className="w-5 h-5 mr-2" />
                    Ir a Entradas/Salidas
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alertas Críticas (Relevancia alta y exclusiva visualmente para el Vigilante) */}
        {alerts.filter(a => a.severity === 'high').length > 0 && (
          <Card className="mb-8 border-2 border-red-500 shadow-lg shadow-red-100">
            <CardHeader className="bg-red-50">
              <CardTitle className="text-red-700 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                Alertas de Seguridad Activas
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {alerts.filter(a => a.severity === 'high').map((alert) => (
                  <div key={alert.id} className="p-4 bg-white border-l-4 border-red-500 rounded-r-lg shadow-sm">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-6 h-6 text-red-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-red-900">{alert.message}</p>
                        <p className="text-xs text-red-600 mt-1 font-semibold">{alert.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente (Hoy)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'Entrada' ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      <Car className={`w-5 h-5 ${
                        activity.type === 'Entrada' ? 'text-green-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">{activity.plate}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          activity.type === 'Entrada' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {activity.type}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">{activity.user}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">{activity.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      {/* Solicitudes de Entrada */}
      <Card className="mt-8 border-2 border-green-200">
        <CardHeader className="bg-green-50">
          <CardTitle className="text-green-800">Solicitudes de Entrada Pendientes</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {entryRequests.length > 0 ? entryRequests.map(req => (
              <div key={req.id} className="flex items-center justify-between p-4 bg-white border border-green-100 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <ArrowUpRight className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{req.plate} <span className="text-xs px-2 py-1 bg-green-600 text-white rounded-full">Entrada</span></p>
                    <p className="text-sm text-gray-600">Propietario: {req.owner}</p>
                    <p className="text-xs text-gray-500">Hora: {req.time}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApproveEntry(req)}><CheckCircle2 className="w-4 h-4 mr-1"/> Aprobar</Button>
                  <Button size="sm" variant="outline" className="text-red-600 border-red-600" onClick={() => handleRejectEntry(req.id)}><XCircle className="w-4 h-4 mr-1"/> Rechazar</Button>
                </div>
              </div>
            )) : <p className="text-sm text-gray-500">No hay solicitudes de entrada.</p>}
          </div>
        </CardContent>
      </Card>

      {/* Solicitudes de Salida */}
      <Card className="mt-8 border-2 border-blue-200">
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-blue-800">Solicitudes de Salida Pendientes</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {exitRequests.length > 0 ? exitRequests.map(req => (
              <div key={req.id} className="flex items-center justify-between p-4 bg-white border border-blue-100 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <ArrowDownRight className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{req.plate} <span className="text-xs px-2 py-1 bg-blue-600 text-white rounded-full">Salida</span></p>
                    <p className="text-sm text-gray-600">Propietario: {req.owner}</p>
                    <p className="text-xs text-gray-500">Hora: {req.time}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => handleApproveExit(req)}><CheckCircle2 className="w-4 h-4 mr-1"/> Aprobar</Button>
                  <Button size="sm" variant="outline" className="text-red-600 border-red-600" onClick={() => handleRejectExit(req.id)}><XCircle className="w-4 h-4 mr-1"/> Rechazar</Button>
                </div>
              </div>
            )) : <p className="text-sm text-gray-500">No hay solicitudes de salida.</p>}
          </div>
        </CardContent>
      </Card>

      {/* Usuarios Registrados (Visible para el Guardia) */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Usuarios Registrados Recientemente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {registeredUsers.length > 0 ? registeredUsers.map((u: any) => (
              <div key={u.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 relative rounded-full overflow-hidden bg-green-100 flex items-center justify-center">
                    {u.foto ? (
                      <img src={u.foto} alt={u.name} className="w-full h-full object-cover absolute top-0 left-0 z-10" />
                    ) : (
                      <User className="w-6 h-6 text-green-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{u.name}</span>
                      <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-full">{u.role}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {u.email} {u.telefono ? `| Tel: ${u.telefono}` : ''} {u.documento ? `| Doc: ${u.documento}` : ''}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Registrado el: {u.registrationDate}</p>
                <p className="text-xs font-semibold mt-1">
                  Estado: <span className={u.status === 'Activo' ? 'text-green-600' : 'text-orange-600'}>{u.status || 'Pendiente'}</span>
                </p>
                  </div>
                </div>
            {u.status === 'Pendiente' && (
              <div className="flex space-x-2 ml-4">
                <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApproveUser(u.id)}>
                  <CheckCircle2 className="w-4 h-4 mr-1" /> Aprobar
                </Button>
                <Button size="sm" variant="outline" className="text-red-600 border-red-600" onClick={() => handleRejectUser(u.id)}>
                  <XCircle className="w-4 h-4 mr-1" /> Rechazar
                </Button>
              </div>
            )}
            {u.status === 'Activo' && (
              <div className="flex space-x-2 ml-4">
                <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50" onClick={() => handleInactivateUser(u.id)}>
                  <XCircle className="w-4 h-4 mr-1" /> Inactivar
                </Button>
              </div>
            )}
            {u.status === 'Inactivo' && (
              <div className="flex space-x-2 ml-4">
                <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50" onClick={() => handleActivateUser(u.id)}>
                  <CheckCircle2 className="w-4 h-4 mr-1" /> Activar
                </Button>
              </div>
            )}
              </div>
            )) : (
              <p className="text-sm text-gray-500">No hay usuarios registrados recientemente.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Vehículos Pendientes de Aprobación */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Vehículos Pendientes de Aprobación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingVehicles.length > 0 ? pendingVehicles.map((v: any) => (
              <div key={v.id} className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  {v.foto && (
                    <img src={v.foto} alt="Vehículo" className="w-12 h-12 rounded-lg object-cover" />
                  )}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{v.plate}</span>
                      <span className="text-xs px-2 py-1 bg-orange-600 text-white rounded-full">{v.type}</span>
                    </div>
                    <p className="text-sm text-gray-600">Propietario: {v.owner}</p>
                  </div>
                </div>
              <div className="flex space-x-2">
                <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApproveVehicle(v.id)}>
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Aprobar
                </Button>
                <Button size="sm" variant="outline" className="text-red-600 border-red-600" onClick={() => handleRejectVehicle(v.id)}>
                  <XCircle className="w-4 h-4 mr-1" />
                  Rechazar
                </Button>
              </div>
              </div>
            )) : (
              <p className="text-sm text-gray-500">No hay vehículos pendientes de aprobación.</p>
            )}
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="bg-gray-50 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl mb-1">Panel de Control</h1>
            <p className="text-gray-600 text-sm">Resumen general del sistema de parqueadero</p>
          </div>
          <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const isUp = stat.trend === 'up';
            const isDown = stat.trend === 'down';
            
            return (
              <Card key={stat.title} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${stat.color}-100`}>
                      <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                    {stat.trend !== 'neutral' && (
                      <div className={`flex items-center ${isUp ? 'text-green-600' : 'text-red-600'}`}>
                        {isUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      </div>
                    )}
                  </div>
                  <div className="text-2xl mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600 mb-2">{stat.title}</div>
                  <div className={`text-xs ${isUp ? 'text-green-600' : isDown ? 'text-red-600' : 'text-gray-600'}`}>
                    {stat.change}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Actividad Reciente*/}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Actividad Reciente</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/entries-exits">Ver todo</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === 'Entrada' ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        <Car className={`w-5 h-5 ${
                          activity.type === 'Entrada' ? 'text-green-600' : 'text-blue-600'
                        }`} />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">{activity.plate}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            activity.type === 'Entrada' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {activity.type}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">{activity.user}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-sm text-gray-500 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {activity.time}
                      </div>
                      {activity.status === 'success' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <Clock className="w-5 h-5 text-orange-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Alertas y Notificaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
                    alert.severity === 'high' 
                      ? 'bg-red-50 border-red-500'
                      : alert.severity === 'medium'
                      ? 'bg-orange-50 border-orange-500'
                      : 'bg-blue-50 border-blue-500'
                  }`}>
                    <div className="flex items-start space-x-3">
                      <AlertCircle className={`w-5 h-5 mt-0.5 ${
                        alert.severity === 'high'
                          ? 'text-red-500'
                          : alert.severity === 'medium'
                          ? 'text-orange-500'
                          : 'text-blue-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                Ver todas las alertas
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" >
            <Link to="/vehicles">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Car className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl mb-2">Registrar Vehículo</h3>
                  <p className="text-gray-600 text-sm">Añade un nuevo vehículo al sistema</p>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" >
            <Link to="/entries-exits">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl mb-2">Registrar Movimiento</h3>
                  <p className="text-gray-600 text-sm">Registra entrada o salida de vehículo</p>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" >
            <Link to="/reports">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl mb-2">Ver Reportes</h3>
                  <p className="text-gray-600 text-sm">Consulta estadísticas y reportes</p>
                </div>
              </CardContent>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );

  return renderContent();
}
