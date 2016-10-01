
app.controller('SignUpController',['$scope','$http','AuthService','$location',function($scope,$http,AuthService,$location){
	if(AuthService.isAuthenticated()){
		console.log(AuthService.isAuthenticated());
		$location.path('/dashboarduser');
	}
	
	$scope.name='',
	$scope.password='',
	$scope.FirstName='',
	$scope.LastName='',
	$scope.email='',
	$scope.phone='',
	$scope.dob='',
	
	
$scope.submit=function(){
AuthService.register({
	name:$scope.name,
	password:$scope.password,
	FirstName:$scope.FirstName,
	LastName:$scope.LastName,
	email:$scope.email,
	phone:$scope.phone,
	dob:$scope.dob,
	
}).then(function(msg) {
   AuthService.login({
	name:$scope.name,
	password:$scope.password,

}).then(function(msg) {
	console.log(msg);
      if(msg=='Doctor'){
      	$location.path('/profile');
      	//window.location="http://localhost:8080/coursesfaculty";

      }else if(msg=='Client'){
      	//window.location="/coursesstudent";
      	$location.path('/profile')
      }else{
      	$location.path('/profile')

      };

    }, function(errMsg) {
      alert("unsuccess");
    });
    }, function(errMsg) {
      alert("registration is not successfull")
    });		
		

 

  };	



}]);
		

app.controller('SignInController',['$scope','$http','AuthService','$location',function($scope,$http,AuthService,$location){
	
	$scope.password='',
			$scope.user={
	name:$scope.name,
	password:$scope.password,

};
$scope.forgotpassword=function(){
	$location.path('/forgotpasswordrequest');
}
$scope.submit=function(){

    AuthService.login({
	name:$scope.name,
	password:$scope.password,

}).then(function(msg) {
	$scope.username=window.localStorage.user;
	$scope.profilepic=window.localStorage.profilepic;
	$scope.group=window.localStorage.group;
	$scope.$digest();
	console.log(msg);
      if(msg=='Faculty'){
      	//$location.path('/dashboarduser');
      	window.location="/dashboarduser";

      }else if(msg=='Student'){
      	window.location="/dashboarduser";
      	//$location.path('/dashboarduser')
      }else{
      	alert("LOGIN WRONG");
      	window.location='/signup';
      };

    }, function(errMsg) {
      alert("unsuccess");
    });

};

	$scope.$on('auth-not-authenticated',function(event){
		AuthService.logout();
	alert("login again");
	});

}]);