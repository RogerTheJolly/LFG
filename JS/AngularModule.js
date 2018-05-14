var app = angular.module('myApp', ['ngRoute']);

app.config(function($routeProvider)
{
    $routeProvider

    .when('/',
    {
        templateUrl: 'home.html',
		controller: 'HomeController'
    })

    .when('/group',
    {
        templateUrl: 'group.html',
		controller: 'GroupController'
    })

    .when('/about',
    {
        templateUrl: '/about.html',
    })

    .otherwise(
    {
        redirectTo: '/'
    });
});

app.controller('HomeController', function($scope, $location, $window)
{
	$scope.testText = "Test Text";
	
	$scope.runJS = true;
	
	// Run after view loaded.
	var counter = 0;
	$scope.loadGroups = function(index){
		if($scope.runJS)
		{
			console.log("HOME LOADED");
			
			var grid = document.getElementById('grid');
			
			//Get the Groups from the DB
			db.collection("groups").get().then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					//console.log(`${doc.id} => ${doc.data()}`);
					
					var item = document.createElement("div");
					item.classList.add("item");
					grid.appendChild(item);
					
					var image = doc.data().image.toString();
					
					(function(i) {	
						item.addEventListener("click", function(){
							console.log("event listener " + i);
							$scope.clicked = i;
							//$location.path('/group');
							$scope.groupName = "TEST";
							$window.location = "/LFG/index.html#/group?" + doc.id;
						});
					})(counter);

					image = image.replace('300', item.offsetWidth);
					image = image.replace('200', item.offsetHeight);
					item.style.backgroundImage = "url('" + image +"')";
					counter++;
				});
			});
			$scope.runJS = false;
		}
	};
	$scope.openGroup = function(groupNumber){
		console.log("CLICKED " + groupNumber);
		return "group.html"
	}
	
	$scope.loadGroups();
});

app.controller('GroupController', function($scope, $window)
{
    console.log('GroupController');
	$scope.groupName = $window.location.toString().split("?-")[1];
		/*$scope.groupName = [];
	
	db.collection("groups").get().then((querySnapshot) => {
		querySnapshot.forEach((doc) => {
			//console.log(`${doc.id} => ${doc.data()}`);
			$scope.groupName[counter] = doc.id;
			//console.log($scope.groupName[counter]);
		});
	});*/
});

app.controller('AboutController', function($scope)
{
	
});
