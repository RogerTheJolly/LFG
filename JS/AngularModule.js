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
	$scope.testText = "Test Text";
	
	/*db.collection("groups").get().then((querySnapshot) => {
		querySnapshot.forEach((doc) => {
			//console.log(`${doc.id} => ${doc.data()}`);
			$scope.groupName = doc.id;
			
		});
	});*/
	
	$scope.runJS = true;
	
	// Run after view loaded.
	$scope.loadGroups = function(){
		if($scope.runJS)
		{
			console.log("HOME LAODED");
			//Get groups and set backgrounds
			var grid = document.getElementById('grid');
			
			//Get the Groups from the DB
			db.collection("groups").get().then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					//console.log(`${doc.id} => ${doc.data()}`);
					
					var item = document.createElement("div");
					item.classList.add("item");
					grid.appendChild(item);
					
					var image = doc.data().image.toString();

					/*item.addEventListener("click", function(){
					console.log("clicky");
						groupPopUp.style.display = "block";
					});*/

					image = image.replace('300', item.offsetWidth);
					image = image.replace('200', item.offsetHeight);
					item.style.backgroundImage = "url('" + image +"')";
				});
			});
			$scope.runJS = false;
		}
	};
});

app.controller('BlogController', function($scope)
{
    getData();
});

app.controller('AboutController', function($scope)
{
    getData();
});
