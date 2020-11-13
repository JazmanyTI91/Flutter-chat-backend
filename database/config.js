const mongoose = require('mongoose');

const dbConnection = async() => {
  
    try {
        
      //Creamos la conexion a mongo 
      await mongoose.connect( process.env.DB_CNN, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true
      });

      console.log('DB Online');

  } catch (error) {
      console.log(error);
      throw new Error('Error con la base de datos, contacte al administrador');
  }

}

module.exports = {
    dbConnection
};