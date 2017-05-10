/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var bcrypt=require('bcrypt')
module.exports = {

    create:function(req,res,next){
		var nombreUsuario =req.param('nombreUsuario')
        console.log(nombreUsuario)
		var clave =req.param('clave')
        console.log(clave)
		if(!nombreUsuario || !clave){
            console.log('debe ingresar un usuario y contraseña');
		}
        Usuarios.findOne({nombreUsuario}).exec(function (err, finn){
            if (err) {
                return res.serverError(err);
            }
            if (!finn) {
                return res.notFound('Could not find Finn, sorry.');
            }
            sails.log('Found "%s"', finn.id);
            bcrypt.compare(clave,finn.claveBD, function passwordMatch(err,valid){										 
				if(err){
                 return   console.log('primer error en la clave')	
				}
				if(!valid){
                  return  console.log('las claves no coincider')
				}
				req.session.authenticated=true
				req.session.User=finn.id
				console.log("id session:" + req.session.User)
                req.session.Usuarios=finn
                return res.json(200, { menssage: 'Usuario Valido', code: 200, usuario:finn.nombre, estatus:finn.estatus })    
			})
        });
	},
	destroy:function(req,res,next){
		req.session.destroy()
        console.log('session destroy')
        return res.json({menssage: 'Session Destroy', code: 200});
	}
};

