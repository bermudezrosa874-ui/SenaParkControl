import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Lock, Mail, ArrowRight, User, UserPlus, Fingerprint, Phone, Camera, CameraOff, Loader2, ShieldCheck, CheckCircle2, RefreshCw, Info } from 'lucide-react';
import { useAuth, UserRole } from '../../contexts/AuthContext';
import { toast } from 'sonner';

export function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [documento, setDocumento] = useState('');
  const [telefono, setTelefono] = useState('');
  const [role, setRole] = useState<UserRole>('Usuario Sena');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [isCaptchaLoading, setIsCaptchaLoading] = useState(false);
  const [showImageCaptcha, setShowImageCaptcha] = useState(false);
  const [selectedCaptchaImages, setSelectedCaptchaImages] = useState<number[]>([]);
  const [captchaError, setCaptchaError] = useState(false);
  const [captchaSeed, setCaptchaSeed] = useState(1);
  const [photoData, setPhotoData] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      setIsCameraOpen(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      toast.error("¡Ups! 📸 No pudimos acceder a tu cámara. Necesitamos ver tu sonrisa para el registro, por favor concede los permisos.");
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
        setPhotoData(dataUrl);
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

  const handleCaptchaClick = () => {
    if (isCaptchaVerified) return;
    setIsCaptchaLoading(true);
    setTimeout(() => {
      setIsCaptchaLoading(false);
      setShowImageCaptcha(true);
      setSelectedCaptchaImages([]);
      setCaptchaError(false);
      setCaptchaSeed(Math.floor(Math.random() * 100));
    }, 800); // Pequeña carga antes de mostrar el reto de imágenes
  };

  const toggleCaptchaImage = (index: number) => {
    if (selectedCaptchaImages.includes(index)) {
      setSelectedCaptchaImages(selectedCaptchaImages.filter(i => i !== index));
    } else {
      setSelectedCaptchaImages([...selectedCaptchaImages, index]);
    }
  };

  const verifyImageCaptcha = () => {
    if (selectedCaptchaImages.length >= 3) {
      setShowImageCaptcha(false);
      setIsCaptchaVerified(true);
    } else {
      setCaptchaError(true);
    }
  };

  const refreshCaptcha = () => {
    setSelectedCaptchaImages([]);
    setCaptchaError(false);
    setCaptchaSeed(prev => prev + 10);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que el nombre solo tenga letras y espacios (incluye tildes y la ñ)
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!nameRegex.test(name)) {
      toast.error('El nombre solo puede contener letras y espacios. No se permiten números.');
      return;
    }

    // Validar contraseña: Mínimo 5 chars, letras y números
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{5,}$/;
    if (!passwordRegex.test(password)) {
      toast.error('La contraseña debe tener al menos 5 caracteres, incluyendo letras y números.');
      return;
    }

    if (!acceptedTerms) {
      toast.error('Debes aceptar el tratamiento de datos personales para poder registrarte.');
      return;
    }
    if (!isCaptchaVerified) {
      toast.error('Por favor, verifica que no eres un robot. 🤖');
      return;
    }
    if (!photoData) {
      toast.error('¡Falta tu foto! 🤳 No podemos registrarte sin verte primero.');
      return;
    }
    setLoading(true);
    try {
      await register({ 
        name, 
        email, 
        password, 
        role, 
        documento, 
        telefono,
        foto: photoData
      });
      // Le damos 300ms al navegador para detectar el envío antes de destruir la página
      setTimeout(() => {
        toast.success('¡Genial! 🎉 Te has registrado con éxito. Bienvenido a la familia SenaParkControl.');
        navigate('/login');
      }, 300);
    } catch (error: any) {
      toast.error('¡Oh no! 🚨 Algo salió mal: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 py-4 px-4">
      <div className="max-w-md w-full">
        <Card className="border-2 shadow-xl">
          <CardContent className="pt-8 pb-8 px-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl mb-2">Crear Cuenta</h2>
              <p className="text-gray-600">Regístrate para acceder al sistema</p>
            </div>

            <form onSubmit={handleSubmit} method="POST" action="#" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Juan Pérez"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="documento">Documento de Identidad *</Label>
                <div className="relative">
                  <Fingerprint className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="documento"
                    type="text"
                    placeholder="1234567890"
                    value={documento}
                    onChange={(e) => setDocumento(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="telefono"
                    type="tel"
                    placeholder="3001234567"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="usuario@sena.edu.co"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Foto de Perfil *</Label>
                <div className="flex flex-col items-center border-2 border-dashed border-gray-300 rounded-lg p-4">
                  {photoData ? (
                    <div className="relative">
                      <img src={photoData} alt="Foto capturada" className="w-full max-w-xs rounded-lg" />
                      <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => setPhotoData(null)}>
                        Tomar otra
                      </Button>
                    </div>
                  ) : isCameraOpen ? (
                    <div className="flex flex-col items-center w-full">
                      <div className="flex space-x-2 mb-3">
                        <Button type="button" onClick={takePhoto} className="bg-green-600 hover:bg-green-700">
                          <Camera className="w-4 h-4 mr-2" /> Capturar
                        </Button>
                        <Button type="button" variant="outline" onClick={stopCamera}>
                          <CameraOff className="w-4 h-4 mr-2" /> Cancelar
                        </Button>
                      </div>
                      <video ref={videoRef} autoPlay playsInline onClick={takePhoto} className="w-full max-w-xs rounded-lg mb-2 bg-black cursor-pointer" />
                      <p className="text-xs text-gray-500 mb-2">Toca el video o el botón para capturar</p>
                    </div>
                  ) : (
                    <Button type="button" variant="outline" onClick={startCamera}>
                      <Camera className="w-4 h-4 mr-2" /> Abrir Cámara
                    </Button>
                  )}
                  <canvas ref={canvasRef} className="hidden" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Rol *</Label>
                <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="Usuario Sena">Usuario Sena</SelectItem>
                    <SelectItem value="Vigilante">Vigilante</SelectItem>
                    <SelectItem value="Visitante">Visitante</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg border border-green-100">
                <Checkbox 
                  id="terms" 
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                  className="mt-1"
                />
                <div className="grid gap-1.5 leading-none">
                  <label htmlFor="terms" className="text-sm font-semibold leading-none cursor-pointer text-green-900">
                    Acepto el Tratamiento de Datos Personales *
                  </label>
                  <p className="text-xs text-gray-700 leading-relaxed mt-1">
                    Autorizo a SenaParkControl la recolección y uso de mis datos personales (documento de identidad, teléfono, foto facial y datos de mis vehículos) estrictamente para fines de seguridad, validación y control de acceso al parqueadero, en cumplimiento con la Ley de Protección de Datos. <Link to="/terms" className="text-green-700 font-semibold hover:underline">Leer términos completos</Link>.
                  </p>
                </div>
              </div>

              {/* reCAPTCHA Visual */}
              <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-300 rounded-sm shadow-sm">
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={handleCaptchaClick}
                    className={`w-7 h-7 rounded-sm border-2 flex items-center justify-center transition-all ${
                      isCaptchaVerified 
                        ? 'bg-green-500 border-green-500' 
                        : 'bg-white border-gray-400 hover:border-gray-500'
                    }`}
                    disabled={isCaptchaLoading || isCaptchaVerified}
                  >
                    {isCaptchaLoading ? (
                      <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                    ) : isCaptchaVerified ? (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : null}
                  </button>
                  <span className="text-sm font-medium text-gray-700">No soy un robot</span>
                </div>
                <div className="flex flex-col items-center">
                  <ShieldCheck className="w-6 h-6 text-blue-600 mb-1" />
                  <span className="text-[10px] text-gray-500">Privacidad - Términos</span>
                </div>
              </div>

              {/* Modal de CAPTCHA de Imágenes */}
              {showImageCaptcha && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                  <div className="bg-white rounded-md shadow-2xl max-w-[350px] w-full overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                    <div className="bg-[#4A90E2] text-white p-4">
                      <p className="text-sm mb-1">Selecciona todas las imágenes con</p>
                      <h3 className="text-2xl font-bold tracking-wide">Semáforos</h3>
                      <p className="text-xs mt-2 font-medium">Si no hay ninguno, haz clic en Omitir</p>
                    </div>
                    <div className="p-1 grid grid-cols-3 gap-1 bg-white">
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
                        <div
                          key={index}
                          onClick={() => toggleCaptchaImage(index)}
                          className={`relative aspect-square cursor-pointer transition-all ${
                            selectedCaptchaImages.includes(index) ? 'p-1.5' : ''
                          }`}
                        >
                          <div className="w-full h-full bg-gray-200 overflow-hidden relative">
                            <img 
                              src={`https://loremflickr.com/150/150/trafficlight?lock=${index + captchaSeed}`} 
                              alt="fragmento captcha"
                              className={`w-full h-full object-cover transition-all ${
                                selectedCaptchaImages.includes(index) ? 'scale-110 opacity-90' : 'hover:scale-105'
                              }`}
                            />
                            {selectedCaptchaImages.includes(index) && (
                              <div className="absolute top-1 right-1 bg-[#4A90E2] text-white rounded-full z-10 shadow-sm border border-white">
                                <CheckCircle2 className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t flex justify-between items-center">
                      <div className="flex gap-3 text-gray-500">
                        <button type="button" onClick={refreshCaptcha}>
                          <RefreshCw className="w-5 h-5 cursor-pointer hover:text-gray-800 transition-colors" title="Obtener un nuevo desafío" />
                        </button>
                        <Info className="w-5 h-5 cursor-pointer hover:text-gray-800 transition-colors" />
                      </div>
                      <div className="flex items-center space-x-3">
                        {captchaError && (
                          <span className="text-xs text-red-500 font-medium">Selecciona al menos 3</span>
                        )}
                        <Button 
                          type="button" 
                          onClick={selectedCaptchaImages.length === 0 ? refreshCaptcha : verifyImageCaptcha} 
                          className="bg-[#4A90E2] hover:bg-blue-600 rounded-sm px-6"
                        >
                          {selectedCaptchaImages.length === 0 ? 'Omitir' : 'Verificar'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" size="lg" disabled={loading}>
                {loading ? 'Registrando...' : 'Registrarse'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <Link to="/login" className="text-sm text-green-600 hover:text-green-700 font-semibold">
                ¿Ya tienes cuenta? Iniciar Sesión
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}