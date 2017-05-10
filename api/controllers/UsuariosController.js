/**
 * UsuariosController
 *
 * @description :: Server-side logic for managing usuarios
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create:function(req,res){
		var userObj={
			nombre:req.param('nombre'),
			apellido:req.param('apellido'),
			nombreUsuario:req.param('nombreUsuario'),
			clave:req.param('clave'),
			confirmar:req.param('confirmar'),
			estatus:req.param('estatus')
		}
		Usuarios.create(userObj,function(err,user){
			if(err){
				console.log(JSON.stringify(err))
				//req.session.flash={
				//	err:err
				//}
				//return res.redirect('user/new')
			}else{
                console.log(JSON.stringify(user))
				res.json(200, { menssage: 'Se guardo el registro' })
                //res.redirect('user/show/'+user.id)
			}

		})
	}
};

