const authController = require('../controllers/authController');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../models/userModel');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../config/db');
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue(true)
  })
}));

describe('SUITE 2 — CONTROLADOR DE AUTENTICACION', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  it('TC-AUTH-01: Rechaza registro con correo ya existente en BD', async () => {
    req.body = { correo: 'test@sena.edu.co' };
    User.findByEmail.mockResolvedValue({ id: 1 }); // Simula que existe

    await authController.register(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Correo ya registrado' });
  });

  it('TC-AUTH-02: Registra usuario nuevo exitosamente', async () => {
    req.body = { correo: 'nuevo@sena.edu.co', contrasena: '1234' };
    User.findByEmail.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue('hashed_pass');
    User.create.mockResolvedValue(1);
    User.findById = jest.fn().mockResolvedValue({ id: 1, correo: 'nuevo@sena.edu.co' });

    await authController.register(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Usuario creado' }));
  });

  it('TC-AUTH-03: Maneja error interno de BD durante registro', async () => {
    User.findByEmail.mockRejectedValue(new Error('DB Error'));
    await authController.register(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error en registro' });
  });

  it('TC-AUTH-04: Rechaza login con correo inexistente', async () => {
    req.body = { correo: 'noexiste@sena.edu.co' };
    User.findByEmail.mockResolvedValue(null);
    await authController.login(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringMatching(/correo no está registrado|Credenciales inválidas/i) }));
  });

  it('TC-AUTH-05: Rechaza login con contrasena incorrecta', async () => {
    req.body = { correo: 'test@sena.edu.co', contrasena: 'mal' };
    User.findByEmail.mockResolvedValue({ Contrasena: 'hash' });
    bcrypt.compare.mockResolvedValue(false);
    await authController.login(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringMatching(/Contraseña incorrecta|Credenciales inválidas/i) }));
  });

  it('TC-AUTH-06: Login exitoso retorna token JWT valido', async () => {
    req.body = { correo: 'test@sena.edu.co', contrasena: 'bien' };
    User.findByEmail.mockResolvedValue({ IdUsuario: 1, Contrasena: 'hash', Correo: 'test@sena.edu.co' });
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('token_jwt_valido');

    await authController.login(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ token: 'token_jwt_valido' }));
  });

  it('TC-AUTH-07: Token generado contiene datos correctos del usuario', async () => {
    req.body = { correo: 'test@sena.edu.co', contrasena: 'bien' };
    User.findByEmail.mockResolvedValue({ IdUsuario: 1, IdRol: 2, Correo: 'test@sena.edu.co' });
    bcrypt.compare.mockResolvedValue(true);
    
    await authController.login(req, res);
    expect(jwt.sign).toHaveBeenCalledWith(expect.objectContaining({ id: 1, idRol: 2, correo: 'test@sena.edu.co' }), expect.any(String), expect.any(Object));
  });
});