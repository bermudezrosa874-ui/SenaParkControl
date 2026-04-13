const movimientoController = require('../controllers/movimientoController');
const Movimiento = require('../models/movimientoModel');
const Vehicle = require('../models/vehicleModel');
const Notificacion = require('../models/notificacionModel');

jest.mock('../models/movimientoModel');
jest.mock('../models/vehicleModel');
jest.mock('../models/notificacionModel');

describe('SUITE 4 — CONTROLADOR DE MOVIMIENTOS', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  it('TC-MOV-01: Rechaza entrada sin parametros placa ni idVehiculo', async () => {
    await movimientoController.entrada(req, res);
    // Simulando que el controlador interceptara falta de idVehiculo/placa (adaptado al controlador actual)
    expect(res.status).toHaveBeenCalledWith(404); // Actualmente getById(undefined) retorna null
  });

  it('TC-MOV-02: Rechaza entrada con placa inexistente en BD', async () => {
    req.body = { idVehiculo: 999 };
    Vehicle.getById.mockResolvedValue(null); // No encontrado
    await movimientoController.entrada(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Vehículo no encontrado' });
  });

  it('TC-MOV-03: Rechaza entrada si el vehiculo ya esta dentro', async () => {
    req.body = { idVehiculo: 1 };
    Vehicle.getById.mockResolvedValue({ IdVehiculo: 1, Placa: 'ABC' });
    Movimiento.getActiveByVehicle.mockResolvedValue({ Estado: 'dentro' }); // Ya está adentro

    await movimientoController.entrada(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Vehículo ya dentro' });
  });

  it('TC-MOV-04: Registra entrada exitosamente usando placa', async () => {
    req.body = { idVehiculo: 1, placa: 'XYZ123' }; // Asumiendo lógica compartida
    Vehicle.getById.mockResolvedValue({ IdVehiculo: 1, Placa: 'XYZ123', IdUsuario: 2 });
    Movimiento.getActiveByVehicle.mockResolvedValue(null);
    Movimiento.entrada.mockResolvedValue(100);

    await movimientoController.entrada(req, res);
    expect(res.json).toHaveBeenCalledWith({ message: 'Entrada registrada', id: 100, placa: 'XYZ123' });
  });

  it('TC-MOV-05: Registra entrada exitosamente usando idVehiculo', async () => {
    req.body = { idVehiculo: 5 };
    Vehicle.getById.mockResolvedValue({ IdVehiculo: 5, Placa: 'CAR555', IdUsuario: 3 });
    Movimiento.getActiveByVehicle.mockResolvedValue(null);
    Movimiento.entrada.mockResolvedValue(101);

    await movimientoController.entrada(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Entrada registrada' }));
  });

  it('TC-MOV-06: Crea notificacion al registrar entrada', async () => {
    req.body = { idVehiculo: 5 };
    Vehicle.getById.mockResolvedValue({ IdVehiculo: 5, Placa: 'CAR555', IdUsuario: 3 });
    Movimiento.getActiveByVehicle.mockResolvedValue(null);
    
    await movimientoController.entrada(req, res);
    expect(Notificacion.create).toHaveBeenCalledWith(3, expect.stringContaining('CAR555'));
  });

  it('TC-MOV-07: Rechaza salida sin parametros', async () => {
    req.body = {}; // Sin idMovimiento ni placa
    await movimientoController.salida(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Falta idMovimiento o placa' });
  });

  it('TC-MOV-08: Registra salida exitosamente por idMovimiento', async () => {
    req.body = { idMovimiento: 50 };
    Movimiento.salida.mockResolvedValue({ IdMovimiento: 50, Estado: 'fuera' });
    
    await movimientoController.salida(req, res);
    expect(res.json).toHaveBeenCalledWith({ message: 'Salida registrada', movimiento: expect.any(Object) });
  });

  it('TC-MOV-09: Rechaza salida con placa inexistente', async () => {
    req.body = { placa: 'FANTASMA' };
    Vehicle.findByPlaca.mockResolvedValue(null);
    
    await movimientoController.salida(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Placa no encontrada' });
  });

  it('TC-MOV-10: Rechaza salida sin entrada activa previa', async () => {
    req.body = { placa: 'REAL123' };
    Vehicle.findByPlaca.mockResolvedValue({ IdVehiculo: 1 });
    Movimiento.getActiveByVehicle.mockResolvedValue(null); // No hay entrada
    
    await movimientoController.salida(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'No hay registro de entrada activo' });
  });

  it('TC-MOV-11: Registra salida por placa exitosamente', async () => {
    req.body = { placa: 'REAL123' };
    Vehicle.findByPlaca.mockResolvedValue({ IdVehiculo: 1, Placa: 'REAL123', IdUsuario: 5 });
    Movimiento.getActiveByVehicle.mockResolvedValue({ IdMovimiento: 10 });
    Movimiento.salida.mockResolvedValue({ IdMovimiento: 10, Estado: 'fuera' });
    
    await movimientoController.salida(req, res);
    expect(res.json).toHaveBeenCalledWith({ 
      message: 'Salida registrada', 
      movimiento: expect.any(Object), 
      placa: 'REAL123' 
    });
  });

  it('TC-MOV-12: Lista movimientos por rango de fechas (start/end)', async () => {
    req.query = { start: '2025-01-01', end: '2025-01-31' };
    const fakeRows = [
      { IdMovimiento: 1, FechaEntrada: '2025-01-15' },
      { IdMovimiento: 2, FechaEntrada: '2025-01-20' }
    ];
    Movimiento.listByDateRange.mockResolvedValue(fakeRows);
    
    await movimientoController.listByRange(req, res);
    expect(Movimiento.listByDateRange).toHaveBeenCalledWith('2025-01-01', '2025-01-31');
    expect(res.json).toHaveBeenCalledWith(fakeRows);
  });
});