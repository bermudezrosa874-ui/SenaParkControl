import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';
import { 
  Settings as SettingsIcon, 
  Bell,
  Moon,
  Globe,
  Shield,
  Database,
  Download,
  Trash2,
  AlertCircle
} from 'lucide-react';

export function Settings() {
  const handleExportData = () => {
    const backup = {
      users: JSON.parse(localStorage.getItem('sp_users') || '[]'),
      vehicles: JSON.parse(localStorage.getItem('sp_vehicles') || '[]'),
      movements: JSON.parse(localStorage.getItem('sp_movements') || '[]'),
      notifications: JSON.parse(localStorage.getItem('sp_notifications') || '[]'),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `backup_senapark_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Configuración</h1>
          <p className="text-gray-600">Personaliza tu experiencia en SenaParkControl</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Menu */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <nav className="space-y-2">
                  <a 
                    href="#general" 
                    className="flex items-center space-x-3 px-4 py-3 bg-green-50 text-green-700 rounded-lg"
                  >
                    <SettingsIcon className="w-5 h-5" />
                    <span>General</span>
                  </a>
                  <a 
                    href="#notifications" 
                    className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    <span>Notificaciones</span>
                  </a>
                  <a 
                    href="#appearance" 
                    className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Moon className="w-5 h-5" />
                    <span>Apariencia</span>
                  </a>
                  <a 
                    href="#privacy" 
                    className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Shield className="w-5 h-5" />
                    <span>Privacidad</span>
                  </a>
                  <a 
                    href="#data" 
                    className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Database className="w-5 h-5" />
                    <span>Datos</span>
                  </a>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* General Settings */}
            <Card id="general">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <SettingsIcon className="w-5 h-5 mr-2" />
                  Configuración General
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Idioma</Label>
                    <Select defaultValue="es">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Zona Horaria</Label>
                    <Select defaultValue="bogota">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bogota">América/Bogotá (GMT-5)</SelectItem>
                        <SelectItem value="mexico">América/México_City (GMT-6)</SelectItem>
                        <SelectItem value="madrid">Europa/Madrid (GMT+1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Formato de Fecha</Label>
                    <Select defaultValue="dd-mm-yyyy">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Mostrar tutorial de bienvenida</p>
                    <p className="text-sm text-gray-500">Mostrar guía al iniciar sesión</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Actualización automática</p>
                    <p className="text-sm text-gray-500">Actualizar datos en tiempo real</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card id="notifications">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Notificaciones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notificaciones por Email</p>
                    <p className="text-sm text-gray-500">Recibir actualizaciones por correo</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Entrada de vehículo</p>
                    <p className="text-sm text-gray-500">Notificar cuando un vehículo ingresa</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Salida de vehículo</p>
                    <p className="text-sm text-gray-500">Notificar cuando un vehículo sale</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Alertas de seguridad</p>
                    <p className="text-sm text-gray-500">Vehículos no autorizados o irregularidades</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Alertas de capacidad</p>
                    <p className="text-sm text-gray-500">Cuando el parqueadero esté lleno</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Reportes semanales</p>
                    <p className="text-sm text-gray-500">Resumen de actividad cada semana</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="notification-email">Correo para Notificaciones</Label>
                  <Input 
                    id="notification-email" 
                    type="email" 
                    defaultValue="admin@sena.edu.co" 
                  />
                </div>
              </CardContent>
            </Card>

            {/* Appearance */}
            <Card id="appearance">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Moon className="w-5 h-5 mr-2" />
                  Apariencia
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Tema</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="relative border-2 border-green-600 rounded-lg p-4 cursor-pointer bg-white">
                      <div className="w-full h-20 bg-white border rounded mb-2"></div>
                      <p className="text-center text-sm font-medium">Claro</p>
                    </div>
                    <div className="relative border-2 border-gray-200 rounded-lg p-4 cursor-pointer bg-white">
                      <div className="w-full h-20 bg-gray-900 border rounded mb-2"></div>
                      <p className="text-center text-sm font-medium">Oscuro</p>
                    </div>
                    <div className="relative border-2 border-gray-200 rounded-lg p-4 cursor-pointer bg-white">
                      <div className="w-full h-20 bg-gradient-to-br from-white to-gray-900 border rounded mb-2"></div>
                      <p className="text-center text-sm font-medium">Auto</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Modo compacto</p>
                    <p className="text-sm text-gray-500">Reduce el espaciado entre elementos</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Animaciones</p>
                    <p className="text-sm text-gray-500">Habilitar transiciones y animaciones</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* Privacy */}
            <Card id="privacy">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Privacidad y Seguridad
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Autenticación de dos factores</p>
                    <p className="text-sm text-gray-500">Añade una capa extra de seguridad</p>
                  </div>
                  <Switch />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Registro de actividad</p>
                    <p className="text-sm text-gray-500">Guardar historial de acciones</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Compartir datos de uso</p>
                    <p className="text-sm text-gray-500">Ayuda a mejorar el servicio</p>
                  </div>
                  <Switch />
                </div>

                <Separator />

                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Descargar mis datos
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Ver sesiones activas
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Data Management */}
            <Card id="data">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="w-5 h-5 mr-2" />
                  Gestión de Datos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-900">Exportar datos</p>
                        <p className="text-sm text-blue-700 mt-1">
                          Descarga una copia de todos tus datos en formato CSV o JSON
                        </p>
                        <Button size="sm" variant="outline" className="mt-3" onClick={handleExportData}>
                          <Download className="w-4 h-4 mr-2" />
                          Exportar
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-orange-900">Limpiar caché</p>
                        <p className="text-sm text-orange-700 mt-1">
                          Elimina datos temporales para liberar espacio
                        </p>
                        <Button size="sm" variant="outline" className="mt-3">
                          Limpiar
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-red-900">Zona de peligro</p>
                        <p className="text-sm text-red-700 mt-1">
                          Estas acciones son permanentes y no se pueden deshacer
                        </p>
                        <div className="space-y-2 mt-3">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-red-600 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Eliminar todos los datos
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-red-600 text-red-600 hover:bg-red-50 ml-2"
                          >
                            Desactivar cuenta
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <form className="flex justify-end space-x-2" onSubmit={(e) => { e.preventDefault(); alert('Configuraciones guardadas'); }}>
              <Button variant="outline">Cancelar</Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Guardar Cambios
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
