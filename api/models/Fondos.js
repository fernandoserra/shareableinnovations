/**
 * Fondos.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    monto:{
      type:'float'
    },
    estatus: {
        type: 'string',
        enum: ['Pendiente', 'Aprobada', 'Denegada'],
        defaultsTo: 'Pendiente'
    },
    mensaje: {
        type: 'string'
    },
    owner:{
      model:'Usuarios'
    }
  }
};

