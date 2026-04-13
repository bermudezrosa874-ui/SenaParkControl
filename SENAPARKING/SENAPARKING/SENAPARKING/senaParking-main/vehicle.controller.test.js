const vehicleController = require('../controllers/vehicleController');
const Vehicle = require('../models/vehicleModel');

jest.mock('../models/vehicleModel');

describe('SUITE 3 — CONTROLADOR DE VEHICULOS', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, user: { id: 1 }, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  it('TC-VEH-01: Rechaza registro de placa duplicada', async () => {
    req.body = { placa: 'ABC123' };
    Vehicle.findByPlaca.mockResolvedValue({ id: 5, placa: 'ABC123' });

    await vehicleController.create(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Placa ya registrada' });
  });

  it('TC-VEH-02: Registra vehiculo nuevo exitosamente', async () => {
    req.body = { placa: 'XYZ987', idUsuario: 2 };
    Vehicle.findByPlaca.mockResolvedValue(null);
    Vehicle.create.mockResolvedValue(10);

    await vehicleController.create(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Vehículo registrado', id: 10 });
  });

  it('TC-VEH-03: Usa el id del usuario autenticado si no hay idUsuario en body', async () => {
    req.body = { placa: 'DEF456' }; // sin idUsuario
    Vehicle.findByPlaca.mockResolvedValue(null);
    
    await vehicleController.create(req, res);
    expect(Vehicle.create).toHaveBeenCalledWith(expect.objectContaining({
      idUsuario: 1 // Toma req.user.id (seteado en el beforeEach)
    }));
  });

  it('TC-VEH-04: Lista los vehiculos del usuario autenticado', async () => {
    const misVehiculos = [{ placa: 'ABC123' }];
    Vehicle.listByUser.mockResolvedValue(misVehiculos);

    await vehicleController.listByUser(req, res);
    expect(Vehicle.listByUser).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith(misVehiculos);
  });

  it('TC-VEH-05: Lista todos los vehiculos (modo administrador)', async () => {
    const todosVehiculos = [{ placa: 'ABC123' }, { placa: 'XYZ987' }];
    Vehicle.listAll.mockResolvedValue(todosVehiculos);

    await vehicleController.listAll(req, res);
    expect(Vehicle.listAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(todosVehiculos);
  });

  it('TC-VEH-06: Elimina un vehiculo por ID', async () => {
    req.params.id = 15;
    await vehicleController.remove(req, res);
    expect(Vehicle.remove).toHaveBeenCalledWith(15);
    expect(res.json).toHaveBeenCalledWith({ message: 'Vehículo eliminado' });
  });
});