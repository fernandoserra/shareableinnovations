var demoApp= angular.module('r1', ['ngRoute','ngCookies','ngDialog']);
 demoApp.config(function($routeProvider, $locationProvider){
 	$routeProvider
 	.when('/signin',{
 		templateUrl : 'templates/signin.html',
        controller  : 'validarCtrl'
 	})
	 .when('/',{
 		templateUrl : 'templates/inicio.html',
        controller  : 'mainCtrl'
 	})
	.when('/registrar',{
 		templateUrl : 'templates/registrar.html' ,
        controller  : 'regCtrl'
 	})
	.when('/listar',{
 		templateUrl : 'templates/listar.html',
        controller  : 'listarCtrl'
 	})
	.when('/solicitudes', {
 		templateUrl:'templates/solicitudes.html',
 		controller: 'solicitudesCtrl'
 	}) 
	.when('/fondos', {
 		templateUrl:'templates/fondos.html',
 		controller: 'fondosCtrl'
 	}) 
	.when('/perfil', {
 		templateUrl:'templates/perfil.html',
 		controller: 'perfilCtrl'
 	}) 
	.when('/salir', {
 		templateUrl:'templates/salir.html',
 		controller: 'salirCtrl'
 	})
 	.otherwise({
	    redirectTo: '/'
	});
 });

demoApp.factory("autentificar", function($cookies,$cookieStore,$http,$location){
	return{
		login:function(nombre,tu,aut){
			console.log("dentro de login")
			$cookieStore.put('nombre',nombre)
			$cookieStore.put('tu',tu)
			$cookieStore.put('auth',aut)
			$location.path("/");
		},
		getUser:function(){
			return  $cookieStore.get('nombre') +' (' + $cookieStore.get('tu') +')'
		},
		getN:function(){
			return  $cookieStore.get('tu')
		},
		checkStatus : function(){
            var rutasPrivadas = ["/","/fondos","/perfil","/registrar","/listar"];
            if(this.in_array($location.path(),rutasPrivadas) && typeof($cookieStore.get('nombre')) == "undefined"){
                $location.path("/signin");
            }
			var rPrivadasAdm = ["/listar","/registrar"];
			if( (this.in_array($location.path(),rPrivadasAdm)) && (($cookieStore.get('tu')) == "Cliente")) {
				 $location.path("/");
			}
            if(this.in_array("/signin",rutasPrivadas) && typeof($cookieStore.get('nombre')) != "undefined"){
                $location.path("/");
            }
        },
        in_array : function(needle, haystack){
            var key = '';
            for(key in haystack){
                if(haystack[key] == needle){
                    return true;
                }
            }
            return false;
        },
		logout:function(){
			$http.post("http://localhost:1337/session/destroy",{})
			.then(function successCallback(response) {
				if(response.data.code==200){
					$cookieStore.remove('nombre')
					$cookieStore.remove('tu')
					$cookieStore.remove('auth')
					$location.path("/signin")
				}
			}, function errorCallback(response) {
				console.log(response.data);
			});	
		}
	}
})
demoApp.controller('validarCtrl', function($scope,$http,autentificar) {
	 $scope.usuarioValidar=function(){
        $http.post("http://localhost:1337/session/create",{
        	nombreUsuario: $scope.valUser.nombreUsuario,
			clave: $scope.valUser.clave
        })
        	.then(function successCallback(response) {
            $scope.resultado=response.data;
			if(response.data.code==200){
				console.log("entramos")
				autentificar.login(nombre=response.data.usuario,tu=response.data.estatus, auth=true)	
			}
		}, function errorCallback(response) {
			    console.log(response.data);
		});
	}
});

demoApp.controller('fondosCtrl', function($scope,$http,autentificar) {
   	$scope.salir=function(){ autentificar.logout()}
	$scope.motrarCookie=autentificar.getUser()
	$scope.nv=autentificar.getN()
	$scope.addFondos=function(){
        $http.post("http://localhost:1337/fondos/create",{
        	monto: $scope.fondo.monto
        })
        	.then(function successCallback(response) {
            $scope.resultado=response.data;
            console.log(response.data);
		}, function errorCallback(response) {
			    console.log(response.data);
		});
	}
});

demoApp.controller('solicitudesCtrl',function($scope,$http,autentificar,ngDialog){
	$scope.salir=function(){ autentificar.logout()}
	$scope.motrarCookie=autentificar.getUser()
	$scope.nv=autentificar.getN()
	$http.get("http://localhost:1337/fondos/solicitudes")
    	.then(function successCallback(response) {
            $scope.solicitudes=response.data;
            $scope.loading=false;
		}, function errorCallback(response) {
		    $scope.loading=false;
	});
	$scope.DetallesRegSol = function(post_r){
		ngDialog.open({ template: 'DetallesRegistroS', className: 'ngdialog-theme-default', scope: $scope });
			$scope.post_r=post_r
		};
	$scope.modificarRegSol = function(post_r){
			ngDialog.open({ template: 'modificarRegistroS', className: 'ngdialog-theme-default',scope: $scope});
			$scope.post_r=post_r;
	};
	$scope.modificarSol=function(){
		 $http.post("http://localhost:1337/fondos/update",{
        	monto: $scope.post_r.monto,
			mensaje: $scope.post_r.mensaje,
			estatus: $scope.post_r.estatus,
			id: $scope.post_r.id
        })
        .then(function successCallback(response) {
            $scope.resultado=response.data;
		}, function errorCallback(response) {
			console.log(response.data);
		});
	 }
})
demoApp.controller('mainCtrl', function($scope,$http,ngDialog,autentificar) {
	 $scope.salir=function(){ autentificar.logout()}
	 $scope.motrarCookie=autentificar.getUser()
	 $scope.nv=autentificar.getN()
	  $http.get("http://localhost:1337/fondos")
    	.then(function successCallback(response) {
            $scope.fondos=response.data;
            $scope.loading=false;
		}, function errorCallback(response) {
		    $scope.loading=false;
		});
		$scope.detallesFdo = function(post_r){
			ngDialog.open({ template: 'DetallesFd', className: 'ngdialog-theme-default', scope: $scope});
			$scope.post_r=post_r;
		};
		$scope.modificarRegIni = function(post_r){
			ngDialog.open({ template: 'ModificarFd', className: 'ngdialog-theme-default', scope: $scope });
			$scope.post_r=post_r;
		};
		$scope.modificarPri=function(){
			console.log( $scope.post_r.id)
			$http.post("http://localhost:1337/fondos/update",{
				monto: $scope.post_r.monto,
				mensaje: $scope.post_r.mensaje,
				estatus: $scope.post_r.estatus,
				id: $scope.post_r.id
			})
			.then(function successCallback(response) {
				$scope.resultado=response.data;
			}, function errorCallback(response) {
				console.log(response.data);
			});
		 }
 });

demoApp.controller('listarCtrl',function($scope,$http,autentificar,ngDialog){
	$scope.message="Lista de Usuarios";
	$scope.salir=function(){ autentificar.logout()}
	$scope.motrarCookie=autentificar.getUser()
	$scope.nv=autentificar.getN()
	$scope.posts=[];
	$scope.newPost={};
	$scope.loading=true;
	$http.get("http://localhost:1337/usuarios")
    	.then(function successCallback(response) {
            $scope.posts=response.data;
            $scope.loading=false;
		}, function errorCallback(response) {
		    $scope.loading=false;
		});
		$scope.detallesUsuarios = function(post_u){
			ngDialog.open({
					template: 'DetallesUsuarios',
					className: 'ngdialog-theme-default',
					scope: $scope
				});
			$scope.post_u=post_u;
			console.log(post_u)
		};
		$scope.ModificarUsuarios = function(post_u){
			ngDialog.open({
					template: 'ModificarUsuaP',
					className: 'ngdialog-theme-default',
					scope: $scope
				});
			$scope.post_u=post_u;
			console.log(post_u)
		};
	
	$scope.EliminarUsuarios=function(id){
		console.log("eliminar al usuario: " + id)
		$http({
		    method: 'DELETE',
		    url: 'http://localhost:1337/usuarios/destroy?id='+ id,
		    data: {id: id},
		    headers: {'Content-type': 'application/json;charset=utf-8'}
		})
		.then(function(response) {
			$scope.posts.splice($scope.posts.indexOf(id));
		}, function(rejection) {
		    console.log(rejection.data);
		});
	}
});

demoApp.controller('regCtrl',function($scope,$http,autentificar){
	$scope.message="Registrar usuario";
	$scope.salir=function(){ autentificar.logout()}
	$scope.motrarCookie=autentificar.getUser()
	$scope.nv=autentificar.getN()
	$scope.addPost=function(){
        $http.post("http://localhost:1337/usuarios/create",{
        	nombre: $scope.newPost.nombre,
			apellido: $scope.newPost.apellido,
			nombreUsuario: $scope.newPost.nombreUsuario,
			clave: $scope.newPost.clave,
			confirmar: $scope.newPost.confirmar,
			estatus: $scope.newPost.estatus
        })
        	.then(function successCallback(response) {
            $scope.resultado=response.data;
		}, function errorCallback(response) {
			    console.log(response.data);
		});
	}
});

demoApp.controller('perfilCtrl',function($scope,autentificar){
	$scope.salir=function(){ autentificar.logout()}
	$scope.motrarCookie=autentificar.getUser()
	$scope.nv=autentificar.getN()
});

demoApp.run(function($rootScope, autentificar)
{
    $rootScope.$on('$routeChangeStart', function(){
        autentificar.checkStatus();
    })
})