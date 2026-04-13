import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { Terms } from './components/pages/Terms';

// Mockeamos la librería 'sonner' para que las alertas (toast) no rompan la prueba
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  }
}));

// Limpiamos la pantalla virtual después de cada prueba para que no se acumulen
afterEach(cleanup);

describe('Pruebas Unitarias - Componente Terms (Frontend)', () => {
  
  it('Debe renderizar el título correctamente', () => {
    render(
      <MemoryRouter>
        <Terms />
      </MemoryRouter>
    );
    
    // Verifica que el texto exista en la pantalla
    const titulo = screen.getByText('Términos y Condiciones de Uso');
    expect(titulo).toBeDefined();
  });

  it('El botón de continuar debe estar bloqueado (gris) por defecto', () => {
    render(
      <MemoryRouter>
        <Terms />
      </MemoryRouter>
    );
    
    const botonContinuar = screen.getByText('Aceptar y Continuar');
    expect(botonContinuar.className).toContain('bg-gray-400');
  });
});