import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Search,
  Filter,
  Download,
  Calendar,
  Clock,
  User,
  XCircle,
  Car,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function EntriesExits() {
  const { user } = useAuth();
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [plate, setPlate] = useState('');
  const [movementType, setMovementType] = useState('');
  const [guard, setGuard] = useState('');
  const [observations, setObservations] = useState('');

  const [movements, setMovements] = useState<any[]>(() => {
    const saved = localStorage.getItem('sp_movements');
    return saved ? JSON.parse(saved) : [];
  });

  const registeredUsers = JSON.parse(localStorage.getItem('sp_users') || '[]');
  const guardUsers = registeredUsers.filter((u: any) => u.role === 'Vigilante' || u.role === 'Guardia de Seguridad' || u.role === 'Administrador');

  const allVehicles = JSON.parse(localStorage.getItem('sp_vehicles') || '[]');
  const foundVehicle = plate ? allVehicles.find((v: any) => v.plate === plate.toUpperCase()) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plate || !movementType || !guard) {
      alert('¡Faltan datos en la portería! 🛑 Por favor, completa la Placa, el Tipo de movimiento y el Guardia.');
      return;
    }

    const vehicle = foundVehicle;

    if (!vehicle) {
      alert('¡Vehículo fantasma! 👻 Esa placa no existe en nuestros registros. Por favor, regístralo primero.');
      return;
    }
    if (vehicle.status !== 'Activo') {
      alert('¡Acceso denegado! 🚫 Este vehículo aún no tiene luz verde (no está Activo/Aprobado).');
      return;
    }

    const now = new Date();
    const newMovement = {
      id: Date.now(),
      plate: plate.toUpperCase(),
      type: movementType === 'entrada' ? 'Entrada' : 'Salida',
      owner: vehicle.owner,
      role: vehicle.role,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      guard: guard,
      observations: observations
    };

    const updatedMovements = [newMovement, ...movements];
    setMovements(updatedMovements);
    localStorage.setItem('sp_movements', JSON.stringify(updatedMovements));

    setPlate('');
    setMovementType('');
    setGuard('');
    setObservations('');
    alert('¡Check de seguridad! ✅ Movimiento registrado sin contratiempos.');
  };

  const handleExport = () => {
    const headers = ['Tipo', 'Placa', 'Propietario', 'Rol', 'Fecha', 'Hora', 'Guardia', 'Observaciones'];
    const csvData = filteredMovements.map((m: any) => [
      m.type, m.plate, m.owner, m.role, m.date, m.time, m.guard, m.observations || ''
    ]);

    const csvContent = [
      headers.join(';'),
      ...csvData.map(row => row.map((cell: any) => `"${cell}"`).join(';'))
    ].join('\n');

    // Agregamos BOM para que Excel lea los acentos (UTF-8)
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `movimientos_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  let filteredMovements = filterType === 'all' 
    ? movements 
    : movements.filter(m => m.type.toLowerCase() === filterType);

  if (searchTerm) {
    filteredMovements = filteredMovements.filter(m =>
      m.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.owner.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const entriesCount = movements.filter(m => m.type === 'Entrada' && m.date === todayStr).length;
  const exitsCount = movements.filter(m => m.type === 'Salida' && m.date === todayStr).length;
  const totalEntries = movements.filter(m => m.type === 'Entrada').length;
  const totalExits = movements.filter(m => m.type === 'Salida').length;
  const currentVehicles = totalEntries - totalExits;

  const renderTable = (period: string) => {
    const today = new Date();
    const data = filteredMovements.filter((m) => {
      if (period === 'today') return m.date === todayStr;
      if (period === 'week') {
        const mDate = new Date(m.date);
        const diff = today.getTime() - mDate.getTime();
        return diff <= 7 * 24 * 60 * 60 * 1000;
      }
      if (period === 'month') {
        const mDate = new Date(m.date);
        return mDate.getMonth() === today.getMonth() && mDate.getFullYear() === today.getFullYear();
      }
      return true;
    });

    if (data.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p>No hay movimientos registrados para este período.</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">Tipo</th>
              <th className="text-left py-3 px-4">Placa</th>
              <th className="text-left py-3 px-4">Propietario</th>
              <th className="text-left py-3 px-4">Rol</th>
              <th className="text-left py-3 px-4">Fecha</th>
              <th className="text-left py-3 px-4">Hora</th>
              <th className="text-left py-3 px-4">Guardia</th>
              <th className="text-left py-3 px-4">Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((movement) => (
              <tr key={movement.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  <Badge 
                    className={
                      movement.type === 'Entrada'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }
                  >
                    {movement.type === 'Entrada' ? (
                      <ArrowDownCircle className="w-3 h-3 mr-1" />
                    ) : (
                      <ArrowUpCircle className="w-3 h-3 mr-1" />
                    )}
                    {movement.type}
                  </Badge>
                </td>
                <td className="py-3 px-4 font-semibold">{movement.plate}</td>
                <td className="py-3 px-4">{movement.owner}</td>
                <td className="py-3 px-4">
                  <Badge variant="secondary">{movement.role}</Badge>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-1" />
                    {movement.date}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    {movement.time}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="w-4 h-4 mr-1" />
                    {movement.guard}
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {movement.observations || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Entradas y Salidas</h1>
          <p className="text-gray-600">Registro completo de movimientos del parqueadero</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Entradas Hoy</p>
                  <p className="text-3xl">{entriesCount}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <ArrowDownCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Salidas Hoy</p>
                  <p className="text-3xl">{exitsCount}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <ArrowUpCircle className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Vehículos Actuales</p>
                  <p className="text-3xl">{currentVehicles}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Register */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Registro Rápido de Movimiento</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid md:grid-cols-5 gap-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="plate">Placa</Label>
                <Input id="plate" placeholder="ABC123" className="uppercase" value={plate} onChange={(e) => setPlate(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="movement-type">Tipo de Movimiento</Label>
                <Select value={movementType} onValueChange={setMovementType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entrada">Entrada</SelectItem>
                    <SelectItem value="salida">Salida</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="guard">Guardia de Seguridad</Label>
                <Select value={guard} onValueChange={setGuard}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {guardUsers.length > 0 ? guardUsers.map((g: any) => (
                      <SelectItem key={g.id || g.email} value={g.name}>{g.name}</SelectItem>
                    )) : user && (
                      <SelectItem value={user.name}>{user.name}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observations">Observaciones</Label>
                <Input id="observations" placeholder="Opcional" value={observations} onChange={(e) => setObservations(e.target.value)} />
              </div>

              <div className="flex items-end">
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                  Registrar
                </Button>
              </div>

              {plate.length >= 3 && (
                <div className="col-span-1 md:col-span-5 p-4 rounded-lg border bg-white flex flex-col md:flex-row items-center gap-4 mt-2 shadow-sm">
                  {foundVehicle ? (
                    <>
                      {foundVehicle.foto ? (
                         <img src={foundVehicle.foto} alt="Vehículo" className="w-20 h-20 rounded-md object-cover border-2 border-green-200" />
                      ) : (
                         <div className="w-20 h-20 bg-green-100 rounded-md flex items-center justify-center border-2 border-green-200"><Car className="w-10 h-10 text-green-600" /></div>
                      )}
                      <div className="flex-1 text-center md:text-left">
                        <p className="font-bold text-green-700 text-lg flex items-center justify-center md:justify-start">
                          <CheckCircle2 className="w-5 h-5 mr-2" /> Vehículo Registrado
                        </p>
                        <p className="text-base font-semibold mt-1">Propietario: {foundVehicle.owner} <Badge variant="outline" className="ml-2">{foundVehicle.role}</Badge></p>
                        <p className="text-sm text-gray-600 mt-1">
                          Tipo: <span className="font-medium">{foundVehicle.type}</span> | 
                          Color: <span className="font-medium">{foundVehicle.color}</span> | 
                          Estado: <span className={`font-medium ${foundVehicle.status === 'Activo' ? 'text-green-600' : 'text-orange-600'}`}>{foundVehicle.status}</span>
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-red-600 py-2">
                      <XCircle className="w-8 h-8 mb-2" />
                      <p className="font-bold text-lg">Vehículo No Encontrado</p>
                      <p className="text-sm text-gray-600">Esta placa no está registrada en el sistema. Debe registrarse antes de ingresar o salir.</p>
                    </div>
                  )}
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Movements Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <CardTitle>Historial de Movimientos</CardTitle>
              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input placeholder="Buscar placa..." className="pl-10 w-48" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="entrada">Entradas</SelectItem>
                    <SelectItem value="salida">Salidas</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
                <Button variant="outline" onClick={handleExport}>
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="today">
              <TabsList className="mb-4">
                <TabsTrigger value="today">Hoy</TabsTrigger>
                <TabsTrigger value="week">Esta Semana</TabsTrigger>
                <TabsTrigger value="month">Este Mes</TabsTrigger>
              </TabsList>

              <TabsContent value="today">
                {renderTable('today')}
              </TabsContent>

              <TabsContent value="week">
                {renderTable('week')}
              </TabsContent>

              <TabsContent value="month">
                {renderTable('month')}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
