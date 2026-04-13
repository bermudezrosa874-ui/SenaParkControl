import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { 
  Shield, 
  Users, 
  Settings,
  UserPlus,
  Search,
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { toast } from 'sonner';

export function Admin() {
  const [users, setUsers] = useState<any[]>(() => {
    const saved = JSON.parse(localStorage.getItem('sp_users') || '[]');
    return saved;
  });

  const [vehicles, setVehicles] = useState<any[]>(() => {
    return JSON.parse(localStorage.getItem('sp_vehicles') || '[]');
  });
  const pendingApprovals = vehicles.filter(v => v.status === 'Pendiente');

  const handleApproveVehicle = (id: number) => {
    const updated = vehicles.map(v => v.id === id ? { ...v, status: 'Activo' } : v);
    setVehicles(updated);
    localStorage.setItem('sp_vehicles', JSON.stringify(updated));
    toast.success('Vehículo aprobado exitosamente');
  };

  const handleRejectVehicle = (id: number) => {
    const updated = vehicles.map(v => v.id === id ? { ...v, status: 'Inactivo' } : v);
    setVehicles(updated);
    localStorage.setItem('sp_vehicles', JSON.stringify(updated));
    toast.success('Vehículo rechazado exitosamente');
  };

  const handleInactivateUser = (id: number) => {
    const updated = users.map(u => u.id === id ? { ...u, status: 'Inactivo' } : u);
    setUsers(updated);
    localStorage.setItem('sp_users', JSON.stringify(updated));
    toast.success('Usuario inactivado/rechazado exitosamente');
  };

  const handleActivateUser = (id: number) => {
    const updated = users.map(u => u.id === id ? { ...u, status: 'Activo' } : u);
    setUsers(updated);
    localStorage.setItem('sp_users', JSON.stringify(updated));
    toast.success('Usuario reactivado exitosamente');
  };

  const systemSettings = [
    { id: 1, name: 'Capacidad Máxima', value: '130 espacios' },
    { id: 2, name: 'Horario de Operación', value: '6:00 AM - 10:00 PM' },
    { id: 3, name: 'Tiempo Máximo de Permanencia', value: '12 horas' },
    { id: 4, name: 'Notificaciones Email', value: 'Habilitado' },
  ];

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl">Panel de Administración</h1>
          </div>
          <p className="text-gray-600">Gestión de usuarios, permisos y configuración del sistema</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Usuarios Totales</p>
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-3xl">5</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Usuarios Activos</p>
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-3xl">4</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Aprobaciones Pendientes</p>
                <AlertCircle className="w-4 h-4 text-orange-600" />
              </div>
              <p className="text-3xl">{pendingApprovals.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Guardias de Turno</p>
                <Shield className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-3xl">2</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">Usuarios</TabsTrigger>
            <TabsTrigger value="approvals">Aprobaciones</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                      <CardTitle>Gestión de Usuarios</CardTitle>
                      <div className="flex space-x-2">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input placeholder="Buscar usuario..." className="pl-10 w-48" />
                        </div>
                        <Button className="bg-green-600 hover:bg-green-700">
                          <UserPlus className="w-4 h-4 mr-2" />
                          Nuevo Usuario
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {users.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex items-center space-x-4">
                            <Avatar className="w-12 h-12 relative overflow-hidden">
                              {user.foto && <img src={user.foto} alt={user.name} className="w-full h-full object-cover absolute top-0 left-0 z-10" />}
                              <AvatarFallback className="bg-green-600 text-white">
                                {user.name ? user.name.split(' ').map((n: string) => n.charAt(0)).join('').substring(0, 2).toUpperCase() : 'US'} 
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold">{user.name}</p>
                              <p className="text-sm text-gray-600">
                                {user.email} {user.telefono ? `| Tel: ${user.telefono}` : ''} {user.documento ? `| Doc: ${user.documento}` : ''}
                              </p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="secondary" className="text-xs">
                                  {user.role}
                                </Badge>
                                <Badge 
                                  className={`text-xs ${
                                    user.status === 'Activo' 
                                      ? 'bg-green-100 text-green-700' 
                                      : 'bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  {user.status}
                                </Badge>
                                {user.registrationDate && (
                                  <span className="text-xs text-gray-500 ml-2">Registrado: {user.registrationDate}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right hidden md:block">
                              <p className="text-xs text-gray-500">Último acceso</p>
                              <p className="text-sm">{user.lastLogin}</p>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Ver Perfil</DropdownMenuItem>
                                <DropdownMenuItem>Editar</DropdownMenuItem>
                                <DropdownMenuItem>Cambiar Rol</DropdownMenuItem>
                                {user.status === 'Pendiente' && (
                                  <DropdownMenuItem className="text-green-600" onClick={() => handleActivateUser(user.id)}>
                                    Aprobar
                                  </DropdownMenuItem>
                                )}
                                {user.status === 'Inactivo' ? (
                                  <DropdownMenuItem className="text-green-600" onClick={() => handleActivateUser(user.id)}>
                                    Activar
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem className="text-red-600" onClick={() => handleInactivateUser(user.id)}>
                                    {user.status === 'Pendiente' ? 'Rechazar' : 'Inactivar'}
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Add User Form */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <UserPlus className="w-5 h-5 mr-2" />
                      Agregar Usuario
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success('Usuario guardado exitosamente'); }}>
                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre Completo</Label>
                        <Input id="name" placeholder="Juan Pérez" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Correo Electrónico</Label>
                        <Input id="email" type="email" placeholder="juan@sena.edu.co" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="user-role">Rol</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar rol" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="supervisor">Supervisor</SelectItem>
                            <SelectItem value="guard">Guardia de Seguridad</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">Contraseña Temporal</Label>
                        <Input id="password" type="password" placeholder="••••••••" />
                      </div>

                      <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                        Crear Usuario
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Approvals Tab */}
          <TabsContent value="approvals">
            <Card>
              <CardHeader>
                <CardTitle>Solicitudes Pendientes de Aprobación</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingApprovals.map((approval) => (
                    <div key={approval.id} className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge className="bg-orange-600">{approval.type}</Badge>
                          <span className="font-semibold">{approval.plate}</span>
                        </div>
                        <p className="text-sm text-gray-600">Propietario: {approval.owner}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApproveVehicle(approval.id)}>
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Aprobar
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-600" onClick={() => handleRejectVehicle(approval.id)}>
                          <XCircle className="w-4 h-4 mr-1" />
                          Rechazar
                        </Button>
                      </div>
                    </div>
                  ))}
                  {pendingApprovals.length === 0 && (
                    <p className="text-sm text-gray-500">No hay solicitudes pendientes.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Configuración del Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {systemSettings.map((setting) => (
                      <div key={setting.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-semibold">{setting.name}</p>
                          <p className="text-sm text-gray-600">{setting.value}</p>
                        </div>
                        <Button variant="ghost" size="sm">Editar</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Configuración de Notificaciones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold">Alertas de Capacidad</p>
                        <p className="text-sm text-gray-600">Notificar cuando se alcance el 85%</p>
                      </div>
                      <input type="checkbox" className="w-5 h-5" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold">Vehículos No Autorizados</p>
                        <p className="text-sm text-gray-600">Alerta inmediata por email</p>
                      </div>
                      <input type="checkbox" className="w-5 h-5" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold">Reportes Diarios</p>
                        <p className="text-sm text-gray-600">Enviar resumen cada 24 horas</p>
                      </div>
                      <input type="checkbox" className="w-5 h-5" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold">Mantenimiento Programado</p>
                        <p className="text-sm text-gray-600">Recordatorios de mantenimiento</p>
                      </div>
                      <input type="checkbox" className="w-5 h-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
