/* 
  path: api/login

*/

const { Router } = require('express');
const { check } = require('express-validator');

const { crearUsuario, login, renewToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post( '/new', [
  //Verificamos que los campos vengan antes de ejecutar el controller,
  check('nombre','El nombre es obligatorio').not().isEmpty(),
  check('email', 'El email no es valido').isEmail(),
  check('password', 'El password es obligatorio').not().isEmpty(),
  validarCampos
], crearUsuario );



//Creamos ruta para el login
router.post( '/', [
  //Verificamos los campos 
  check('email', 'El email es incorrecto').isEmail(),
  check('password', 'El password es incorrecto').not().isEmpty(),
], login);



//Creamos ruta para manejar la renovacion de JWT
router.get('/renew',validarJWT, renewToken );


module.exports = router;