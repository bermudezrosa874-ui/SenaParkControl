import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { 
  Car, 
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  Bike,
  Truck,
  Camera,
  CameraOff
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

export function Vehicles() {
  const { user } = useAuth();
  
  const [vehicles, setVehicles] = useState<any[]>(() => {
    const saved = localStorage.getItem('sp_vehicles');
    return saved ? JSON.parse(saved) : [];
  });

  const [formData, setFormData] = useState({
    plate: '', type: '', owner: user?.name || '', role: user?.role || '', 
    document: '', phone: '', brand: '', model: '', year: '', color: '', observations: '', foto: ''
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setIsCameraOpen(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      toast.error("¡Ups! 📸 No pudimos acceder a tu cámara. Necesitamos una foto de tu nave, por favor concede los permisos.");
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        stopCamera();
        handleChange('foto', dataUrl);
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // ⛔ ESTO EVITA QUE LA PÁGINA SE RECARGUE Y TE SAQUE AL LOGIN
    
    if (!formData.plate || !formData.type || !formData.owner || !formData.document || !formData.phone || !formData.brand || !formData.year || !formData.color || !formData.foto) {
      return toast.error('¡Faltan detalles! 🏎️ No olvides llenar todos los campos obligatorios y subir la foto de tu vehículo.');
    }

    // NUEVA VALIDACIÓN: Evitar placas duplicadas y notificar seguridad
    const duplicate = vehicles.find(v => v.plate === formData.plate.toUpperCase() && v.id !== editingId);
    if (duplicate) {
      const newNotif = {
        id: Date.now(),
        message: `🚨 INTENTO DE DUPLICADO: El usuario ${user?.name} (${user?.role}) intentó registrar la placa ${formData.plate.toUpperCase()}, que ya pertenece a ${duplicate.owner}.`,
        severity: 'high',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        targetRoles: ['Vigilante', 'Administrador']
      };
      const notifs = JSON.parse(localStorage.getItem('sp_notifications') || '[]');
      localStorage.setItem('sp_notifications', JSON.stringify([newNotif, ...notifs]));
      
      toast.error(`¡Alerta de clonación! 🚨 La placa ${formData.plate.toUpperCase()} ya pertenece a otro usuario. Hemos avisado al equipo de seguridad.`);
      return;
    }

    if (editingId) {
      const updatedVehicles = vehicles.map(v => 
        v.id === editingId 
          ? { ...v, plate: formData.plate.toUpperCase(), type: formData.type, owner: formData.owner, role: formData.role, document: formData.document, phone: formData.phone, brand: formData.brand, model: formData.model, year: formData.year, color: formData.color || 'No especificado', observations: formData.observations, foto: formData.foto }
          : v
      );
      setVehicles(updatedVehicles);
      localStorage.setItem('sp_vehicles', JSON.stringify(updatedVehicles));
      toast.success('¡Datos al día! 🛠️ Tu vehículo se ha actualizado correctamente.');
      handleCancel();
      return;
    }

    const newVehicle = {
      id: Date.now(),
      plate: formData.plate.toUpperCase(),
      type: formData.type,
      owner: formData.owner,
      color: formData.color || 'No especificado',
      status: (user?.role === 'Administrador' || user?.role === 'Vigilante') ? 'Activo' : 'Pendiente',
      role: formData.role || 'Usuario Sena',
      foto: formData.foto
    };

    const updatedVehicles = [...vehicles, newVehicle];
    setVehicles(updatedVehicles);
    localStorage.setItem('sp_vehicles', JSON.stringify(updatedVehicles));
    toast.success('¡Nave lista! 🚀 Tu vehículo ha sido registrado exitosamente.');
    handleCancel();
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      plate: '', type: '', owner: user?.name || '', role: user?.role || '', 
      document: '', phone: '', brand: '', model: '', year: '', color: '', observations: '', foto: ''
    });
    stopCamera();
  };

  const handleEdit = (vehicle: any) => {
    setEditingId(vehicle.id);
    setFormData({
      plate: vehicle.plate, type: vehicle.type, owner: vehicle.owner, role: vehicle.role,
      document: vehicle.document || '', phone: vehicle.phone || '', brand: vehicle.brand || '',
      model: vehicle.model || '', year: vehicle.year || '', color: vehicle.color !== 'No especificado' ? vehicle.color : '',
      observations: vehicle.observations || '', foto: vehicle.foto || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás totalmente seguro de despedirte de este vehículo? 🗑️')) {
      const updatedVehicles = vehicles.filter(v => v.id !== id);
      setVehicles(updatedVehicles);
      localStorage.setItem('sp_vehicles', JSON.stringify(updatedVehicles));
    }
  };

  const handleApprove = (id: number) => {
    const updatedVehicles = vehicles.map(v => 
      v.id === id ? { ...v, status: 'Activo' } : v
    );
    setVehicles(updatedVehicles);
    localStorage.setItem('sp_vehicles', JSON.stringify(updatedVehicles));
    toast.success('¡Luz verde! 🟢 Vehículo aprobado y listo para rodar.');
  };

  const displayedVehicles = (user?.role === 'Administrador' || user?.role === 'Vigilante') 
    ? vehicles 
    : vehicles.filter(v => v.owner === user?.name);

  const totalRegistrados = displayedVehicles.length;
  const totalAutos = displayedVehicles.filter(v => v.type === 'Automóvil' || v.type === 'Carro').length;
  const totalMotos = displayedVehicles.filter(v => v.type === 'Motocicleta' || v.type === 'Moto').length;
  const totalPendientes = displayedVehicles.filter(v => v.status === 'Pendiente').length;

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Registro de Vehículos</h1>
          <p className="text-gray-600">Gestiona y registra vehículos autorizados para acceder al parqueadero</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Registration Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="w-5 h-5 mr-2" />
                  {editingId ? 'Editar Vehículo' : 'Registrar Nuevo Vehículo'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="plate">Placa del Vehículo *</Label>
                      <Input id="plate" placeholder="ABC123" className="uppercase" value={formData.plate} onChange={(e) => handleChange('plate', e.target.value)} required />
                    </div>

                    <div className="space-y-2 col-span-1 md:col-span-2">
                      <Label>Tipo de Vehículo *</Label>
                      <div className="grid grid-cols-3 gap-4 mt-1">
                        <div 
                          onClick={() => handleChange('type', 'Carro')}
                          className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.type === 'Carro' || formData.type === 'Automóvil' ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}
                        >
                          <Car className={`w-8 h-8 mb-2 ${formData.type === 'Carro' || formData.type === 'Automóvil' ? 'text-green-600' : 'text-gray-400'}`} />
                          <span className={`font-semibold text-sm ${formData.type === 'Carro' || formData.type === 'Automóvil' ? 'text-green-700' : 'text-gray-600'}`}>Carro</span>
                        </div>
                        <div 
                          onClick={() => handleChange('type', 'Moto')}
                          className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.type === 'Moto' || formData.type === 'Motocicleta' ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}
                        >
                          <Bike className={`w-8 h-8 mb-2 ${formData.type === 'Moto' || formData.type === 'Motocicleta' ? 'text-green-600' : 'text-gray-400'}`} />
                          <span className={`font-semibold text-sm ${formData.type === 'Moto' || formData.type === 'Motocicleta' ? 'text-green-700' : 'text-gray-600'}`}>Moto</span>
                        </div>
                        <div 
                          onClick={() => handleChange('type', 'Bicicleta')}
                          className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.type === 'Bicicleta' ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}
                        >
                          <Bike className={`w-8 h-8 mb-2 ${formData.type === 'Bicicleta' ? 'text-green-600' : 'text-gray-400'}`} />
                          <span className={`font-semibold text-sm ${formData.type === 'Bicicleta' ? 'text-green-700' : 'text-gray-600'}`}>Bicicleta</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="owner">Nombre del Propietario *</Label>
                      <Input id="owner" placeholder="Juan Pérez" value={formData.owner} onChange={(e) => handleChange('owner', e.target.value)} required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="document">Documento de Identidad *</Label>
                      <Input id="document" placeholder="1234567890" value={formData.document} onChange={(e) => handleChange('document', e.target.value)} required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono de Contacto *</Label>
                      <Input id="phone" placeholder="3001234567" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="brand">Marca del Vehículo *</Label>
                      <Input id="brand" placeholder="Toyota, Honda, Yamaha..." value={formData.brand} onChange={(e) => handleChange('brand', e.target.value)} required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="model">Modelo</Label>
                      <Input id="model" placeholder="Corolla, Civic..." value={formData.model} onChange={(e) => handleChange('model', e.target.value)} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="year">Año *</Label>
                      <Input id="year" type="number" placeholder="2024" value={formData.year} onChange={(e) => handleChange('year', e.target.value)} required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="color">Color *</Label>
                      <Input id="color" placeholder="Blanco, Negro, Rojo..." value={formData.color} onChange={(e) => handleChange('color', e.target.value)} required />
                    </div>

                    <div className="space-y-2 col-span-1 md:col-span-2">
                      <Label>Foto del Vehículo (Asegúrese de que la placa sea visible y clara) *</Label>
                      <div className="flex flex-col items-center border-2 border-dashed border-gray-300 rounded-lg p-4">
                        {formData.foto ? (
                          <div className="relative">
                            <img src={formData.foto} alt="Foto del vehículo" className="w-full max-w-xs rounded-lg" />
                            <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => handleChange('foto', '')}>
                              Tomar otra
                            </Button>
                          </div>
                        ) : isCameraOpen ? (
                          <div className="flex flex-col items-center w-full">
                            <video ref={videoRef} autoPlay playsInline onClick={takePhoto} className="w-full max-w-xs rounded-lg mb-2 bg-black cursor-pointer" />
                            <p className="text-xs text-gray-500 mb-2">Toca el video o el botón para capturar</p>
                            <div className="flex space-x-2">
                              <Button type="button" onClick={takePhoto} className="bg-green-600 hover:bg-green-700">
                                <Camera className="w-4 h-4 mr-2" /> Capturar
                              </Button>
                              <Button type="button" variant="outline" onClick={stopCamera}>
                                <CameraOff className="w-4 h-4 mr-2" /> Cancelar
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button type="button" variant="outline" onClick={startCamera}>
                            <Camera className="w-4 h-4 mr-2" /> Abrir Cámara
                          </Button>
                        )}
                        <canvas ref={canvasRef} className="hidden" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="observations">Observaciones</Label>
                    <Textarea 
                      id="observations" 
                      placeholder="Información adicional sobre el vehículo o permisos especiales..."
                      rows={3}
                      value={formData.observations}
                      onChange={(e) => handleChange('observations', e.target.value)}
                    />
                  </div>

                  <div className="flex space-x-4">
                    <Button type="submit" className="bg-green-600 hover:bg-green-700">
                      <Plus className="w-4 h-4 mr-2" />
                      {editingId ? 'Actualizar Vehículo' : 'Registrar Vehículo'}
                    </Button>
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-green-50 to-blue-50">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl mb-2">Información Importante</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <p className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-green-600" />
                    <span>Todos los campos marcados con * son obligatorios</span>
                  </p>
                  <p className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-green-600" />
                    <span>La placa debe estar registrada a nombre del propietario</span>
                  </p>
                  <p className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-green-600" />
                    <span>Documentos de respaldo pueden ser solicitados</span>
                  </p>
                  <p className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-green-600" />
                    <span>El registro será verificado por seguridad</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Estadísticas</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total registrados</span>
                    <span className="font-semibold">{totalRegistrados}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Automóviles</span>
                    <span className="font-semibold">{totalAutos}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Motocicletas</span>
                    <span className="font-semibold">{totalMotos}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Pendientes aprobación</span>
                    <span className="font-semibold text-orange-600">{totalPendientes}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Registered Vehicles List */}
        <Card className="mt-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <CardTitle>Vehículos Registrados</CardTitle>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input placeholder="Buscar placa o propietario..." className="pl-10 w-64" />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Placa</th>
                    <th className="text-left py-3 px-4">Tipo</th>
                    <th className="text-left py-3 px-4">Propietario</th>
                    <th className="text-left py-3 px-4">Rol</th>
                    <th className="text-left py-3 px-4">Color</th>
                    <th className="text-left py-3 px-4">Estado</th>
                    <th className="text-left py-3 px-4">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedVehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          {vehicle.type === 'Motocicleta' || vehicle.type === 'Moto' || vehicle.type === 'Bicicleta' ? (
                            <Bike className="w-4 h-4 mr-2 text-gray-400" />
                          ) : vehicle.type === 'Camioneta' ? (
                            <Truck className="w-4 h-4 mr-2 text-gray-400" />
                          ) : (
                            <Car className="w-4 h-4 mr-2 text-gray-400" />
                          )}
                          <span className="font-semibold">{vehicle.plate}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">{vehicle.type}</td>
                      <td className="py-3 px-4">{vehicle.owner}</td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary">{vehicle.role}</Badge>
                      </td>
                      <td className="py-3 px-4">{vehicle.color}</td>
                      <td className="py-3 px-4">
                        <Badge 
                          className={
                            vehicle.status === 'Activo' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-orange-100 text-orange-700'
                          }
                        >
                          {vehicle.status === 'Activo' ? (
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                          ) : (
                            <Clock className="w-3 h-3 mr-1" />
                          )}
                          {vehicle.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          {(user?.role === 'Administrador' || user?.role === 'Vigilante') && vehicle.status === 'Pendiente' && (
                            <Button variant="outline" size="sm" className="text-green-600 border-green-600 hover:bg-green-50" onClick={() => handleApprove(vehicle.id)}>Aprobar</Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(vehicle)}>Editar</Button>
                          <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDelete(vehicle.id)}>Eliminar</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
