module.exports = {
  // Le decimos al robot exactamente cuáles son los 5 archivos que debe evaluar
  testMatch: [
    "**/auth.middleware.test.js",
    "**/auth.controller.test.js",
    "**/vehicle.controller.test.js",
    "**/movimiento.controller.test.js",
    "**/user.controller.test.js"
  ],
  // Esto genera automáticamente la tabla de porcentajes verde
  collectCoverage: true
};