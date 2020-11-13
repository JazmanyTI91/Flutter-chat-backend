const { response } = require("express");
const bcrypt  = require("bcryptjs");
const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/jwt");

 

const crearUsuario = async (req, res = response) => {

    //Extraer info del body
    const { email, password } = req.body;

    try {

        //Validamos que el email no exista en la bd
        const existeEmail = await Usuario.findOne({ email });
        if( existeEmail ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado'
            });
        }

        //obtenemos el body de la respuesta
        const usuario = new Usuario( req.body );
        
        //Encriptamos la contaraseña 
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        //Almacenamos en la bd
        await usuario.save();

        //Generar JWT
        const token = await generarJWT( usuario.id );

        res.json({
            ok: true,
            //msg: 'Crear usuario...!!'
            body: usuario,
            token
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
    

}


const login = async ( req, res = response ) => {

    const { email, password } = req.body;


    try {
        
        //Validar el usuario
        const usuarioDB = await Usuario.findOne({ email });
        if( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'Email incorrecto'
            });
        }

        //Validar el password
        const passwordDB = bcrypt.compareSync( password, usuarioDB.password );
        if( !passwordDB ) {
            return res.status(404).json({
                ok: false, 
                msg: 'Password incorrecto'
            });
        }

        //Si todo esta bien generamos el JWT
        const token = await generarJWT( usuarioDB.id );
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    } catch (error) {
        return  res.status(500).json({
            ok:  false,
            msg: 'Error login, hable con el administrador'
        });
    }

}


// funcion para renovar y saber quien esta haciendo acciones
const renewToken = async( req, res = response ) => {

    //Recuperamos el ID usuario
    const uid = req.uid;
    //Generamos un nuevo JWT
    const newToken = await generarJWT( uid );
    //Recuperar el usuario por medio del id
    const usuario = await Usuario.findById( uid );

    res.json({
        ok: true,
        usuario,
        newToken
    });
}




module.exports  = {
    crearUsuario,
    login,
    renewToken
}