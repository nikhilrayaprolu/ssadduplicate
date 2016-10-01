var app=angular.module('WebDoc',['ngRoute','ngAnimate']);
app.controller('MainController',['$location','$scope','$http','$routeParams','AuthService',function($location,$scope,$http,$routeParams,AuthService){
	$scope.isAuthenticated=function(){
		return AuthService.isAuthenticated()};
	$scope.username=window.localStorage.user;
	console.log($scope.username);
	AuthService.usertoken();
	
	$scope.LogOut=function(){
		AuthService.logout();
		window.location='/index.html'
	}
	
	var socket = io.connect();
	$scope.socket=socket;
	socket.on('connect',function(){
		if($scope.username){
			socket.emit('username',$scope.username);
		}else{
			
		}
	});
	socket.on('usersonline',function(data){
		$scope.usersonline=data;
		$scope.$digest();
		console.log(data);
	})

	socket.on('online',function(data){
		$scope.usersonline[data]=true;
		$scope.$digest();
		console.log(data);
	})

	socket.on('offline',function(data){
		$scope.usersonline[data]=false;
		$scope.$digest();
		console.log(data);
	})
	socket.on('notification',function(data){
		console.log("success");
		alert(data.msg);
	})
	$scope.LogOut=function(){
		AuthService.logout();
		window.location='/index.html'
	}

	}]);
