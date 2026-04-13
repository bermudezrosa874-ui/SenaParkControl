import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { 
  Car, 
  LayoutDashboard, 
  ClipboardList, 
  ArrowRightLeft, 
  BarChart3,
  LucideIcon, 
  Settings, 
  User,
  LogOut,
  Shield,
  UserCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useAuth } from '../contexts/AuthContext';
import { Badge } from './ui/badge';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const isLoggedIn = isAuthenticated;
  const isHomePage = location.pathname === '/';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Determinar qué enlaces mostrar según el rol
  const getNavigationLinks = () => {
    if (!user) return [];

    const allLinks = [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Panel', roles: ['Usuario Sena', 'Vigilante', 'Administrador', 'Visitante'] },
      { to: '/vehicles', icon: ClipboardList, label: 'Vehículos', roles: ['Usuario Sena', 'Administrador'] },
      { to: '/entries-exits', icon: ArrowRightLeft, label: 'Entradas/Salidas', roles: ['Vigilante', 'Administrador'] },
      { to: '/reports', icon: BarChart3, label: 'Reportes', roles: ['Administrador'] },
      { to: '/admin', icon: Shield, label: 'Administración', roles: ['Administrador'] },
    ];

    return allLinks.filter(link => link.roles.includes(user.role));
  };

  const navigationLinks = getNavigationLinks();

  const getRoleBadgeColor = () => {
    switch (user?.role) {
      case 'Administrador': return 'bg-green-100 text-green-700';
      case 'Vigilante': return 'bg-orange-100 text-orange-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  const getRoleName = () => {
    switch (user?.role) {
      case 'Administrador': return 'Administrador';
      case 'Vigilante': return 'Guardia de Seguridad';
      case 'Usuario Sena': return 'Usuario Sena';
      default: return 'Usuario';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to={isLoggedIn ? '/dashboard' : '/'} className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900">SenaParkControl</span>
                <span className="text-xs text-gray-500">Sistema de Parqueaderos</span>
              </div>
            </Link>

            {/* Navigation Menu */}
            {isLoggedIn && (
              <nav className="hidden md:flex items-center space-x-1">
                {navigationLinks.map((link) => (
                  <NavLink key={link.to} to={link.to} icon={link.icon}>
                    {link.label}
                  </NavLink>
                ))}
              </nav>
            )}

            {/* Right side buttons */}
            <div className="flex items-center space-x-3">
              {!isLoggedIn ? (
                <>
                  {isHomePage && (
                    <>
                      <Button variant="ghost" asChild>
                        <Link to="/login">Iniciar Sesión</Link>
                      </Button>
                      <Button className="bg-green-600 hover:bg-green-700" asChild>
                      <Link to="/register">Registrarse</Link>
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar>
                        {user?.foto && <AvatarImage src={user.foto} alt={user.name} className="object-cover" />}
                        <AvatarFallback className={user?.role === 'Administrador' ? 'bg-green-600 text-white' : user?.role === 'Vigilante' ? 'bg-orange-600 text-white' : 'bg-blue-600 text-white'}>
                          {user?.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64" align="end">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-2">
                        <p>{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                        <Badge className={getRoleBadgeColor()}>
                          <UserCircle className="w-3 h-3 mr-1" />
                          {getRoleName()}
                        </Badge>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Mi Perfil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="flex items-center cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Configuración
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="flex items-center cursor-pointer text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* About */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <span className="font-semibold text-white">SenaParkControl</span>
              </div>
              <p className="text-sm mb-2">
                Sistema de Gestión de Parqueaderos del Servicio Nacional de Aprendizaje - SENA. 
                Innovación y tecnología al servicio de la comunidad educativa.
              </p>
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-orange-500">🟢</span>
                <span>Alison y Rosalinda</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-2">Enlaces Rápidos</h3>
              <ul className="space-y-1 text-sm">
                <li><Link to="/" className="hover:text-white transition-colors">Inicio</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Iniciar Sesión</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Soporte</a></li>
                <li><a href="mailto:asistencia.senaparkcontrol@gmail.com" className="hover:text-white transition-colors">Soporte Técnico</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentación</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white font-semibold mb-2">Contacto</h3>
              <ul className="space-y-1 text-sm">
                <li>Línea Nacional: 5925555</li>
                <li>servicioalciudadano@sena.edu.co</li>
                <li>asistencia.senaparkcontrol@gmail.com</li>
                <li>Calle 57 No. 8 - 69 Bogotá D.C.</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-4 pt-4 flex flex-col md:flex-row justify-between items-center text-sm">
            <p>&copy; 2025 SENA - Todos los derechos reservados</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Términos de Uso</a>
              <a href="#" className="hover:text-white transition-colors">Política de Privacidad</a>
              <a href="#" className="hover:text-white transition-colors">Accesibilidad</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface NavLinkProps {
  to: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

function NavLink({ to, icon: Icon, children }: NavLinkProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors ${
        isActive
          ? 'bg-green-50 text-green-700'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{children}</span>
    </Link>
  );
}
