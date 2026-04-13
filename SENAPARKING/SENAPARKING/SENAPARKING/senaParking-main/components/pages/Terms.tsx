import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { FileText, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export function Terms() {
  const [accepted, setAccepted] = useState(false);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (!accepted) {
      toast.error('Debes aceptar los términos y condiciones para continuar.');
      return;
    }
    toast.success('¡Términos aceptados correctamente!');
    navigate('/register'); // Redirige al registro después de aceptar
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8 px-4 flex justify-center items-start">
      <div className="max-w-3xl w-full">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver
        </Button>
        
        <Card className="border-2 shadow-lg">
          <CardHeader className="bg-green-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center text-2xl">
              <FileText className="w-6 h-6 mr-2" />
              Términos y Condiciones de Uso
            </CardTitle>
          </CardHeader>
          
          <CardContent className="pt-6 space-y-6">
            <div className="text-gray-600 space-y-4 h-96 overflow-y-auto pr-4">
              <h3 className="font-bold text-lg text-gray-900">1. Uso del Parqueadero</h3>
              <p>El uso del parqueadero del SENA es exclusivo para la comunidad educativa (Aprendices, Instructores, Administrativos y Visitantes autorizados). Todo vehículo debe estar debidamente registrado en el sistema SenaParkControl.</p>
              
              <h3 className="font-bold text-lg text-gray-900">2. Responsabilidad</h3>
              <p>El SENA no se hace responsable por pérdida, robo o daños a los vehículos, cascos, accesorios ni por los objetos de valor dejados en su interior. El parqueadero se utiliza bajo el propio riesgo del propietario del vehículo.</p>
              
              <h3 className="font-bold text-lg text-gray-900">3. Normas de Circulación</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>La velocidad máxima permitida dentro de las instalaciones es de 10 km/h.</li>
                <li>Se deben respetar obligatoriamente las señales de tránsito y las indicaciones del personal de vigilancia.</li>
                <li>Estacionar únicamente en las áreas asignadas según el tipo de vehículo (Carro, Moto, Bicicleta).</li>
              </ul>

              <h3 className="font-bold text-lg text-gray-900">4. Horarios</h3>
              <p>El parqueadero estará habilitado únicamente durante los horarios establecidos por el centro de formación. No se permite dejar vehículos pernoctando sin autorización previa y escrita de la administración.</p>

              <h3 className="font-bold text-lg text-gray-900">5. Sanciones</h3>
              <p>El incumplimiento de estos términos podrá resultar en la suspensión temporal o definitiva del permiso de ingreso al parqueadero, sin perjuicio de otras sanciones disciplinarias aplicables según el reglamento interno del SENA.</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3">
                <Checkbox 
                  id="accept-terms" 
                  checked={accepted}
                  onCheckedChange={(checked) => setAccepted(checked as boolean)}
                />
                <label 
                  htmlFor="accept-terms" 
                  className="text-sm font-medium text-gray-900 cursor-pointer select-none"
                >
                  He leído detenidamente y acepto los términos y condiciones de SenaParkControl
                </label>
              </div>
            </div>

            <Button 
              onClick={handleContinue} 
              className={`w-full ${accepted ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed'}`}
              size="lg"
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Aceptar y Continuar
            </Button>
            
          </CardContent>
        </Card>
      </div>
    </div>
  );
}