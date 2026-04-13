import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  BarChart3, 
  TrendingUp,
  Download,
  Calendar,
  PieChart,
  Activity
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export function Reports() {
  const vehicles = JSON.parse(localStorage.getItem('sp_vehicles') || '[]');
  const movements = JSON.parse(localStorage.getItem('sp_movements') || '[]');
  const users = JSON.parse(localStorage.getItem('sp_users') || '[]');

  // 1. Datos Diarios (Últimos 7 días)
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const dailyData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayName = days[d.getDay()];
    const entradas = movements.filter((m: any) => m.date === dateStr && m.type === 'Entrada').length;
    const salidas = movements.filter((m: any) => m.date === dateStr && m.type === 'Salida').length;
    return { name: dayName, entradas, salidas };
  });

  // 2. Datos por Hora
  const hourMap: Record<string, number> = {};
  for(let i=6; i<=20; i++) hourMap[`${i}:00`] = 0; // De 6AM a 8PM
  movements.forEach((m: any) => {
    const hourMatch = m.time.match(/\d+/);
    if (hourMatch) {
      const isPM = m.time.toLowerCase().includes('pm');
      let h = parseInt(hourMatch[0]);
      if (isPM && h !== 12) h += 12;
      if (!isPM && h === 12) h = 0;
      const hKey = `${h}:00`;
      if (hourMap[hKey] !== undefined) hourMap[hKey]++;
    }
  });
  const hourlyData = Object.keys(hourMap).sort((a,b) => parseInt(a) - parseInt(b)).map(h => ({ hour: h, vehiculos: hourMap[h] }));

  // 3. Tipos de Vehículos
  const autos = vehicles.filter((v: any) => v.type === 'Automóvil').length;
  const motos = vehicles.filter((v: any) => v.type === 'Motocicleta').length;
  const camionetas = vehicles.filter((v: any) => v.type === 'Camioneta').length;
  const vehicleTypeData = [
    { name: 'Automóviles', value: autos, color: '#16a34a' },
    { name: 'Motocicletas', value: motos, color: '#ea580c' },
    { name: 'Camionetas', value: camionetas, color: '#2563eb' },
  ].filter(d => d.value > 0);
  if(vehicleTypeData.length === 0) vehicleTypeData.push({ name: 'Sin registros', value: 1, color: '#d1d5db' });

  // 4. Datos por Rol
  const roleCount = users.reduce((acc: any, user: any) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});
  const roleColors = ['#16a34a', '#ea580c', '#2563eb', '#9333ea', '#eab308'];
  const roleData = Object.keys(roleCount).map((role, idx) => ({
    name: role || 'Sin Rol',
    value: roleCount[role],
    color: roleColors[idx % roleColors.length]
  }));
  if(roleData.length === 0) roleData.push({ name: 'Sin registros', value: 1, color: '#d1d5db' });

  // KPIs Dinámicos
  const distinctDays = new Set(movements.map((m: any) => m.date)).size || 1;
  const totalEntradas = movements.filter((m:any) => m.type === 'Entrada').length;
  const promedioDiario = Math.round(totalEntradas / distinctDays);
  const maxHour = Object.keys(hourMap).reduce((a, b) => hourMap[a] > hourMap[b] ? a : b, "08:00");
  const maxVehiculos = hourMap[maxHour] || 0;
  const entradas = movements.filter((m: any) => m.type === 'Entrada').length;
  const salidas = movements.filter((m: any) => m.type === 'Salida').length;
  const ocupacionActual = Math.max(0, entradas - salidas);
  const ocupacionPorcentaje = Math.round((ocupacionActual / 130) * 100);
  const userMovements = movements.reduce((acc: any, m: any) => {
    acc[m.owner] = (acc[m.owner] || 0) + 1;
    return acc;
  }, {});
  const topUsers = Object.keys(userMovements)
    .map(owner => ({ name: owner, count: userMovements[owner] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const handleExport = () => {
    const movements = JSON.parse(localStorage.getItem('sp_movements') || '[]');
    const headers = ['Tipo', 'Placa', 'Propietario', 'Rol', 'Fecha', 'Hora', 'Guardia', 'Observaciones'];
    const csvData = movements.map((m: any) => [
      m.type, m.plate, m.owner, m.role, m.date, m.time, m.guard, m.observations || ''
    ]);

    const csvContent = [
      headers.join(';'),
      ...csvData.map((row: any) => row.map((cell: any) => `"${cell}"`).join(';'))
    ].join('\n');

    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `reporte_completo_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl mb-2">Reportes y Estadísticas</h1>
            <p className="text-gray-600">Análisis detallado del uso del parqueadero</p>
          </div>
          <div className="flex space-x-2 mt-4 md:mt-0">
            <Select defaultValue="month">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Esta Semana</SelectItem>
                <SelectItem value="month">Este Mes</SelectItem>
                <SelectItem value="year">Este Año</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Promedio Diario</p>
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-3xl mb-1">{promedioDiario}</p>
              <p className="text-xs text-green-600">Vehículos por día</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Hora Pico</p>
                <Activity className="w-4 h-4 text-orange-600" />
              </div>
              <p className="text-3xl mb-1">{maxHour}</p>
              <p className="text-xs text-gray-600">{maxVehiculos} vehículos promedio</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Ocupación Promedio</p>
                <PieChart className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-3xl mb-1">{ocupacionPorcentaje}%</p>
              <p className="text-xs text-gray-600">{ocupacionActual} de 130 espacios</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Tiempo Promedio</p>
                <Calendar className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-3xl mb-1">{totalEntradas}</p>
              <p className="text-xs text-gray-600">Total histórico</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="daily" className="space-y-6">
          <TabsList>
            <TabsTrigger value="daily">Diario</TabsTrigger>
            <TabsTrigger value="hourly">Por Hora</TabsTrigger>
            <TabsTrigger value="types">Tipos de Vehículos</TabsTrigger>
            <TabsTrigger value="roles">Por Rol</TabsTrigger>
          </TabsList>

          <TabsContent value="daily">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Entradas y Salidas por Día
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="entradas" fill="#16a34a" name="Entradas" />
                    <Bar dataKey="salidas" fill="#2563eb" name="Salidas" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hourly">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Flujo de Vehículos por Hora
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="vehiculos" 
                      stroke="#16a34a" 
                      strokeWidth={3}
                      name="Vehículos"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="types">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="w-5 h-5 mr-2" />
                    Distribución por Tipo de Vehículo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RePieChart>
                      <Pie
                        data={vehicleTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {vehicleTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Detalles por Tipo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {vehicleTypeData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="font-semibold">{item.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl">{item.value}</div>
                          <div className="text-sm text-gray-600">
                            {((item.value / vehicleTypeData.reduce((sum, v) => sum + v.value, 0)) * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="roles">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="w-5 h-5 mr-2" />
                    Distribución por Rol
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RePieChart>
                      <Pie
                        data={roleData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {roleData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Detalles por Rol</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {roleData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="font-semibold">{item.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl">{item.value}</div>
                          <div className="text-sm text-gray-600">
                            {((item.value / roleData.reduce((sum, v) => sum + v.value, 0)) * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Top 5 Usuarios Frecuentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topUsers.length > 0 ? topUsers.map((u: any, idx: number) => (
                  <div key={u.name} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-sm text-green-700">{idx + 1}</span>
                      </div>
                      <span className="text-sm">{u.name}</span>
                    </div>
                    <span className="text-sm font-semibold">{u.count} visitas</span>
                  </div>
                )) : <p className="text-sm text-gray-500 py-4">No hay datos suficientes</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tendencias del Mes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Incremento de uso</span>
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-2xl text-green-700">{totalEntradas > 0 ? '+12%' : '0%'}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Nuevos registros</span>
                    <Activity className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-2xl text-blue-700">{users.length}</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Promedio diario</span>
                    <BarChart3 className="w-4 h-4 text-orange-600" />
                  </div>
                  <p className="text-2xl text-orange-700">{promedioDiario}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recomendaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="font-semibold mb-1">💡 Ampliar capacidad</p>
                  <p className="text-gray-600">La ocupación supera el 80% en horas pico</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="font-semibold mb-1">✅ Buen rendimiento</p>
                  <p className="text-gray-600">El sistema registra el 98% de movimientos</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <p className="font-semibold mb-1">⚠️ Atención</p>
                  <p className="text-gray-600">Considerar horarios alternos de ingreso</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
