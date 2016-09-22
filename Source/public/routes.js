app.config(function($routeProvider){
	$routeProvider
	.when('/signup',{
		templateUrl:'html/signup.html',
		controller:'SignUpController'
		
	})
	.when('/dashboard',{
		templateUrl:'html/dashboard.html',
		controller:'DashboardController'
	})
})