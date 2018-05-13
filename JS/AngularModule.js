var app = angular.module('myApp', ['ngRoute']);

app.config(function($routeProvider)
{
    $routeProvider

        .when('/',
    {
        templateUrl: '/LFG/home.html'
    })

    .when('/blog',
    {
        templateUrl: '/blog.html',
        controller: 'BlogController'
    })

    .when('/about',
    {
        templateUrl: '/about.html',
        controller: 'AboutController'
    })

    .otherwise(
    {
        redirectTo: '/'
    });
});

app.controller('HomeController', function($scope)
{
    console.log("ANGULAR!");
	$scope.testText = "Test Text";
	
	db.collection("groups").get().then((querySnapshot) => {
		querySnapshot.forEach((doc) => {
			//console.log(`${doc.id} => ${doc.data()}`);
			$scope.groupName = doc.id;
			
		});
	});
});

app.controller('BlogController', function($scope)
{
    getData();
});

app.controller('AboutController', function($scope)
{
    getData();
});
