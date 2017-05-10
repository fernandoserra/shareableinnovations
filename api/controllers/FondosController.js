/**
 * FondosController
 *
 * @description :: Server-side logic for managing fondos
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {
    create:function(req,res){
		var userObj={
			monto:req.param('monto'),
			estatus:'Pendiente',
			owner:req.session.User
		}
		Fondos.create(userObj,function(err,fondo){
			if(err){
                return res.json({menssage: 'Error no pudo guardar'})
            }
			else{
				return res.json(fondo)
			}
		})
	},
	solicitudes:function(req,res,next){
        Fondos.find({where: { estatus: 'Pendiente' }}).populate('owner').exec(function (err, finn){
            if (err) {
                return res.serverError(err);
            }
            if (!finn) {
                return res.notFound('No se pudo encontrar.');
            }
             return res.json(finn);
        });    
    },
    index:function(req,res,next){
		Fondos.find({where: { owner: req.session.User }},function userFounded(err,fondos){
			if(err){
			    return res.serverError(err);
			}else{
                return res.json(fondos);     
			}
		})
	},
	update:function(req,res,next){
		var userObj={
			monto: req.param('monto'),
			mensaje:req.param('mensaje'),
			estatus:req.param('estatus'),
			id:req.param('id'),
			owner:req.session.User
		}
		Fondos.update({where: { id: userObj.id }},userObj,function userUpdated(err,fondos){
			if(err){
				return res.serverError(err);
			}else{
                return res.json(fondos);     
			}
		})
	}
};

