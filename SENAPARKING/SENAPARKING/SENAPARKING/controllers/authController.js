const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const db = require('../config/db');

const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

// Almacén en memoria para guardar los códigos activos generados
const resetCodes = new Map(); 

// Configuración de servidor de correos real (Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { 
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS 
  },
});

const authController = {
  async register(req, res) {
    try {
      const { idRol, nombreCompleto, documento, correo, telefono, contrasena } = req.body;
      const exists = await User.findByEmail(correo);
      if (exists) return res.status(400).json({ message: 'Correo ya registrado' });
      const hashed = await bcrypt.hash(contrasena, 10);
      const newId = await User.create({ idRol, nombreCompleto, documento, correo, telefono, contrasena: hashed });
      const user = await User.findById(newId);
      res.status(201).json({ message: 'Usuario creado', user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error en registro' });
    }
  },
  async login(req, res) {
    try {
      const { correo, contrasena } = req.body;
      const user = await User.findByEmail(correo);
      
      if (!user) return res.status(400).json({ message: 'El correo no está registrado en el sistema' });
      
      // 🚨 VALIDACIÓN CLAVE: Evita que el servidor colapse si el usuario está dañado en la BD
      if (!user.Contrasena) {
        return res.status(400).json({ message: 'Cuenta dañada: Este usuario no tiene contraseña en la base de datos. Por favor, regístrate de nuevo con otro correo.' });
      }

      const ok = await bcrypt.compare(contrasena, user.Contrasena);
      if (!ok) return res.status(400).json({ message: 'Contraseña incorrecta' });
      
      const payload = { id: user.IdUsuario, idRol: user.IdRol, correo: user.Correo, nombre: user.NombreCompleto, idRolName: user.NombreRol };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '8h' });
      res.json({ token, user: payload });
    } catch (err) {
      console.error("🔥 ERROR EN LOGIN:", err);
      res.status(500).json({ message: 'Error del servidor: ' + (err.message || 'Revisa la consola negra del backend') });
    }
  },

  async forgotPassword(req, res) {
    try {
      const { correo } = req.body;
      const user = await User.findByEmail(correo);
      if (!user) return res.status(404).json({ message: 'No existe una cuenta con este correo' });

      // Crear un código real de 6 dígitos
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      resetCodes.set(correo, code);

      // Enviar el correo usando Nodemailer
      const info = await transporter.sendMail({
        from: '"Soporte Técnico - SenaParkControl" <asistencia.senaparkcontrol@gmail.com>',
        to: correo,
        subject: "SENA Parking - Código de Recuperación",
        html: `<h2>Recuperación de Contraseña</h2><p>Tu código de seguridad de 6 dígitos es:</p><h1 style="color: #16a34a; letter-spacing: 5px;">${code}</h1>`
      });

      console.log("✅ Correo real enviado a:", correo);

      res.json({ message: 'Código enviado exitosamente al correo' });
    } catch (err) {
      console.error("Error al enviar código:", err);
      res.status(500).json({ message: 'Error al enviar el código. Verifica la configuración de correo en el servidor.' });
    }
  },

  async resetPassword(req, res) {
    try {
      const { correo, codigo, nuevaContrasena } = req.body;
      const savedCode = resetCodes.get(correo);
      if (!savedCode || savedCode !== codigo) return res.status(400).json({ message: 'El código ingresado es incorrecto o ha expirado' });

      const hashed = await bcrypt.hash(nuevaContrasena, 10);
      await db.query('UPDATE Usuario SET Contrasena = ? WHERE Correo = ?', [hashed, correo]);
      resetCodes.delete(correo);
      res.json({ message: 'Contraseña actualizada correctamente en la base de datos' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error interno al cambiar la contraseña' });
    }
  }
};

module.exports = authController;
