import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { 
  Shield, 
  Clock, 
  BarChart3, 
  Smartphone, 
  CheckCircle2,
  ArrowRight,
  Car,
  ClipboardCheck,
  Bell,
  User
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full mb-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-sm">Sistema Institucional SENA</span>
              </div>
              <h1 className="text-2xl md:text-3xl mb-2">
                Gestión Inteligente de Parqueaderos
              </h1>
              <p className="text-sm text-green-50 mb-3">
                Control total de entradas, salidas y registro de vehículos para la comunidad educativa del SENA. 
                Seguridad, eficiencia y tecnología en un solo lugar.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                  <Link to="/login">Iniciar Sesión</Link>
                </Button>
                <Button className="bg-white text-green-700 hover:bg-green-50" asChild>
                  <Link to="/register">
                    Registrarse
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
              <div className="flex items-center space-x-6 mt-4">
                <div>
                  <div className="text-2xl">500+</div>
                  <div className="text-green-100 text-xs">Vehículos Registrados</div>
                </div>
                <div>
                  <div className="text-2xl">24/7</div>
                  <div className="text-green-100 text-xs">Monitoreo Activo</div>
                </div>
                <div>
                  <div className="text-2xl">99%</div>
                  <div className="text-green-100 text-xs">Disponibilidad</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-4 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4">
            <h2 className="text-xl md:text-2xl mb-1">Características Principales</h2>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              Todo lo que necesitas para gestionar el parqueadero de tu institución
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            <Card className="border-2 hover:border-green-500 transition-colors">
              <CardContent className="pt-3 pb-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                  <Car className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="mb-1 text-sm">Registro de Vehículos</h3>
                <p className="text-gray-600 text-xs">
                  Registra y gestiona todos los vehículos de estudiantes, instructores y visitantes.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-500 transition-colors">
              <CardContent className="pt-3 pb-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="mb-1 text-sm">Control de Acceso</h3>
                <p className="text-gray-600 text-xs">
                  Registra entradas y salidas en tiempo real con validación automática de permisos.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-500 transition-colors">
              <CardContent className="pt-3 pb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="mb-1 text-sm">Reportes Detallados</h3>
                <p className="text-gray-600 text-xs">
                  Genera reportes y estadísticas completas sobre el uso del parqueadero.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-500 transition-colors">
              <CardContent className="pt-3 pb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="mb-1 text-sm">Seguridad Total</h3>
                <p className="text-gray-600 text-xs">
                  Protege tu institución con un sistema de seguridad robusto y confiable.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-4 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4">
            <h2 className="text-xl md:text-2xl mb-1">¿Cómo Funciona?</h2>
            <p className="text-sm text-gray-600">
              Proceso simple en tres pasos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                1
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <ClipboardCheck className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="mb-1 text-sm">Registra tu Vehículo</h3>
              <p className="text-gray-600 text-xs">
                Completa el formulario con los datos de tu vehículo y obtén tu autorización de acceso.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                2
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Car className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="mb-1 text-sm">Ingresa al Parqueadero</h3>
              <p className="text-gray-600 text-xs">
                El personal de seguridad valida tu ingreso y registra la entrada en el sistema.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                3
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="mb-1 text-sm">Monitoreo Continuo</h3>
              <p className="text-gray-600 text-xs">
                El sistema monitorea tu vehículo y registra la salida cuando abandones las instalaciones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-4 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h2 className="text-xl md:text-2xl mb-3">Beneficios para la Comunidad SENA</h2>
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm mb-0.5">Mayor Seguridad</h4>
                    <p className="text-gray-600 text-xs">Control total sobre quién ingresa y sale del parqueadero</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm mb-0.5">Ahorro de Tiempo</h4>
                    <p className="text-gray-600 text-xs">Proceso de ingreso y salida rápido y eficiente</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm mb-0.5">Trazabilidad Completa</h4>
                    <p className="text-gray-600 text-xs">Historial detallado de todos los movimientos vehiculares</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm mb-0.5">Reportes Automáticos</h4>
                    <p className="text-gray-600 text-xs">Estadísticas y análisis para mejor toma de decisiones</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm mb-0.5">Acceso Móvil</h4>
                    <p className="text-gray-600 text-xs">Consulta información desde cualquier dispositivo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-4 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4">
            <h2 className="text-xl md:text-2xl mb-1">Acceso Según tu Rol</h2>
            <p className="text-sm text-gray-600">
              El sistema se adapta a tus necesidades específicas
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            <Card className="border-2 border-blue-200 hover:border-blue-500 transition-colors">
              <CardContent className="pt-3 pb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="mb-2 text-sm">Estudiante</h3>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-3 h-3 mr-1 mt-0.5 text-blue-600" />
                    <span>Ver mi información</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-3 h-3 mr-1 mt-0.5 text-blue-600" />
                    <span>Registrar vehículos</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-3 h-3 mr-1 mt-0.5 text-blue-600" />
                    <span>Ver historial personal</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 hover:border-purple-500 transition-colors">
              <CardContent className="pt-3 pb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                  <User className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="mb-2 text-sm">Instructor</h3>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-3 h-3 mr-1 mt-0.5 text-purple-600" />
                    <span>Ver mi información</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-3 h-3 mr-1 mt-0.5 text-purple-600" />
                    <span>Registrar vehículos</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-3 h-3 mr-1 mt-0.5 text-purple-600" />
                    <span>Acceso prioritario</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-200 hover:border-orange-500 transition-colors">
              <CardContent className="pt-3 pb-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
                  <Shield className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="mb-2 text-sm">Guardia</h3>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-3 h-3 mr-1 mt-0.5 text-orange-600" />
                    <span>Registrar entradas</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-3 h-3 mr-1 mt-0.5 text-orange-600" />
                    <span>Registrar salidas</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-3 h-3 mr-1 mt-0.5 text-orange-600" />
                    <span>Control de acceso</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 hover:border-green-500 transition-colors">
              <CardContent className="pt-3 pb-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="mb-2 text-sm">Administrador</h3>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-3 h-3 mr-1 mt-0.5 text-green-600" />
                    <span>Acceso total</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-3 h-3 mr-1 mt-0.5 text-green-600" />
                    <span>Gestión de usuarios</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-3 h-3 mr-1 mt-0.5 text-green-600" />
                    <span>Reportes avanzados</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-4 bg-gradient-to-br from-green-600 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl md:text-2xl mb-2">
            ¿Listo para Comenzar?
          </h2>
          <p className="text-sm text-green-50 mb-3 max-w-2xl mx-auto">
            Únete a SenaParkControl y mejora la gestión de tu parqueadero hoy mismo
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <Link to="/login">
                Iniciar Sesión
              </Link>
            </Button>
            <Button className="bg-white text-green-700 hover:bg-green-50" asChild>
              <Link to="/register">
                Registrarse
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
