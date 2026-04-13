const authenticate = require('../middlewares/auth');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');

describe('SUITE 1 — MIDDLEWARE DE AUTENTICACION', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('TC-MW-01: Rechaza solicitud sin header Authorization', () => {
    authenticate(req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token missing' });
    expect(next).not.toHaveBeenCalled();
  });

  it('TC-MW-02: Rechaza token invalido o manipulado', () => {
    req.headers.authorization = 'Bearer token_invalido';
    jwt.verify.mockImplementation(() => { throw new Error('Invalid token'); });

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
  });

  it('TC-MW-03: Acepta token JWT valido y llama next()', () => {
    req.headers.authorization = 'Bearer token_valido';
    jwt.verify.mockReturnValue({ id: 1, correo: 'test@sena.edu.co' });

    authenticate(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toBeDefined();
  });

  it('TC-MW-04: Rechaza token con firma expirada', () => {
    req.headers.authorization = 'Bearer token_expirado';
    jwt.verify.mockImplementation(() => { throw new Error('TokenExpiredError'); });

    authenticate(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('TC-MW-05: Asigna id, idRol y correo correctos al request', () => {
    req.headers.authorization = 'Bearer token_valido';
    const payload = { id: 5, idRol: 2, correo: 'admin@sena.edu.co' };
    jwt.verify.mockReturnValue(payload);
    authenticate(req, res, next);
    expect(req.user).toEqual(payload);
  });
});