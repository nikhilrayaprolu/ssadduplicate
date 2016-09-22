app
.service('AuthService',function($q,$http,API_ENDPOINT){
	var LOCAL_TOKEN_KEY='yourTokenKey';
	var LOCAL_GROUP='group';
	var LOCAL_USER='user';
	var isAuthenticated=false;
	var authToken;
	function loadUserCredentials(){
		var token =window.localStorage.getItem(LOCAL_TOKEN_KEY);
		var group =window.localStorage.getItem(LOCAL_GROUP);
		var user=window.localStorage.getItem(LOCAL_USER);
		var profilepic=window.localStorage.getItem('profilepic')
		if(token){
			useCredentials(token,group);
		}
	}
	function storeUserCredentials(token,group,user,profilepic,userfull){
		console.log(user);
		window.localStorage.setItem(LOCAL_TOKEN_KEY,token);
		window.localStorage.setItem(LOCAL_GROUP,group);
		window.localStorage.setItem(LOCAL_USER,user);
		useCredentials(token);
	}
	function useCredentials(token){
		isAuthenticated =true;
		authToken=token;
		$http.defaults.headers.common.Authorization=authToken;
	}
	function destroyUserCredentials(){
		authToken = undefined;
		isAuthenticated =false;
		$http.defaults.headers.common.Authorization=undefined;
		window.localStorage.removeItem(LOCAL_TOKEN_KEY);
		window.localStorage.removeItem(LOCAL_GROUP);
		window.localStorage.removeItem(LOCAL_USER);
		window.localStorage.removeItem('profilepic');
	}
	var register = function(user){
		return $q(function(resolve,reject){
			$http.post(API_ENDPOINT.url+'signup',user).then(function(result){
				if(result.data.success){
					resolve(result.data.msg);
				}else{
					reject(result.data.msg);
				}
			});
		});
	};
	var login = function(user){

		return $q(function(resolve,reject){
			$http.post(API_ENDPOINT.url+'authenticate',user).then(function(result){
				console.log(result);
				if(result.data.success){
					console.log(result.data);
					storeUserCredentials(result.data.token,result.data.group,result.data.username,result.data.profilepic,result.data.user);
					resolve(result.data.group);
				}else{
					resolve(result.data.msg);

				}
			});
		});
	};
	var logout = function(){
		destroyUserCredentials();
	};
	var usertoken = function(){
		var token =window.localStorage.getItem(LOCAL_TOKEN_KEY);
		if(token){
			useCredentials(token);
		}	
	};
	loadUserCredentials();
	return{
		login: login,
		register:register,
		logout:logout,
		usertoken : usertoken,
		isAuthenticated:function(){
			return isAuthenticated;},
	};

})
.factory('AuthInterceptor',function($rootScope,$q,AUTH_EVENTS){
	return {
		responseError: function(response){
			$rootScope.$broadcast({
				401:AUTH_EVENTS.notAuthenticated,
			}[response.status],response);
			return $q.reject(response);
		}
	};
})
.config(function($httpProvider){
	$httpProvider.interceptors.push('AuthInterceptor');
});
app.config(function($locationProvider) {
	$locationProvider.html5Mode(true); 
});
