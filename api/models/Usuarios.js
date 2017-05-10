/**
 * Usuarios.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    nombre:{
      type:'string',
      required:true
    },
    apellido:{
      type:'string',
      required:true
    },
    nombreUsuario:{
      type:'string',
      required:true
    },
    clave:{
      type:'string',
      required:true
    },
    estatus: {
        type: 'string',
        enum: ['Cliente', 'Administrador'],
        required:true
    },
    
    fondos:{
      collection: 'fondos',
      via: 'owner'
    },
  		toJSON: function(){
  			var obj=this.toObject()
  			delete obj.clave
  			delete obj._csrf
  			delete obj.confirmar
  			return obj
  		}
  },
  beforeCreate:function(values,next){
  		console.log("estre en beforeCreate")
  		var clave = values.clave
  		var confirmar= values.confirmar
  		console.log(clave + ";" + confirmar)
  		if (!clave || !confirmar || clave!=values.confirmar){
  			var passwordDoesNotMatchError = [{
  				name:'passwordDoesNotMatchError',
  				messege : 'Las claves no coincides'
  			}]
  			return next({
  				err: passwordDoesNotMatchError
  			})
  		}
  		require('bcrypt').hash(values.clave, 10, function passwordEncrypted(err,encrytedPassword){
  			values.claveBD=encrytedPassword
  			//values.clave=null
  			//values.confirmar=null
  			next()
  		})
  }
  
};

