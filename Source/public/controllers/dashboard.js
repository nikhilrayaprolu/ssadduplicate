
app.controller('DashboardController',['$scope','$http','$location','AuthService',function($scope,$http,$location,AuthService){
	$scope.userid=window.localStorage.user;
	$scope.users=[];
	console.log($scope.userid);
	$scope.getNumber=function(N){
		return Array.apply(null, {length: N}).map(Number.call, Number);
	};

	$scope.findusers=function(){
		AuthService.usertoken();
		$http.get("/users").then(function(response){
			
			$scope.users=response.data;
		});
	};
	$scope.findusers();
	$scope.startVideo=function(){
		window.location="https://localhost:9001/demos/Video-Conferencing.html?roomid="+$scope.userid;
	}
	
	
}]);



