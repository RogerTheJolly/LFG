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
					
					(function(i, doc) {	
						item.addEventListener("click", function(){
							$scope.clicked = i;
							$window.location = "/LFG/index.html#/group?" + doc.id;
						});
					})(counter, doc);

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
	
	//Filter function
	/*var docs = db.collection("groups").where("game", "==", "World of Warcraft")
	docs.get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });*/
	
});

app.controller('GroupController', function($scope, $window)
{
    console.log('GroupController');
	var docRef = db.collection("groups").doc($window.location.toString().split("?")[1]);

	docRef.get().then(function(doc) {
		if (doc.exists) {
			$scope.$apply(function () {
				$scope.groupName = doc.data().title.toString();
				$scope.groupImage = doc.data().image.toString();
				$scope.groupDesc = doc.data().about.toString();
				$scope.groupProperties = doc.data().properties;		
				$scope.game = doc.data().game;
				getGameInfo($scope.game);
			});
		} else {
			console.log("No such group!");
		}
	}).catch(function(error) {
		console.log("Error getting group data:", error);
	});
	
	//Get game info
	function getGameInfo(game){
		console.log(game);
		var docRef = db.collection("games").doc($scope.game);

		docRef.get().then(function(doc) {
			if (doc.exists) {
				//console.log(doc.id, " => ", doc.data());
				var properties = doc.data().properties;
				var primaryKeys = Object.keys(properties);
				console.log(primaryKeys);
				
				$scope.$apply(function () {
					$scope.properties = properties;
				});
				
				
				
			} else {
				console.log("No such game!");
			}
		}).catch(function(error) {
			console.log("Error getting game data:", error);
		});
	}
	
	$scope.getProperty = function(path){
		console.log(path);
		path = path.split(".");
		console.log($scope.groupProperties[path[0]][path[1]]);
		return($scope.groupProperties[path[0]][path[1]]);
	}
	
	
	//$scope.groupName = $window.location.toString().split("?")[1];
	
	//Filter function
	/*var docs = db.collection("groups").where("game", "==", "World of Warcraft")
	docs.get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });*/
	
	/*db.collection("groups").doc($scope.groupName).get().then(function(doc) {
			console.log(`${doc.id} => ${doc.data()}`);
			//$scope.groupName[counter] = doc.id;
			//console.log($scope.groupName[counter]);
	});*/
	
	
});

app.controller('AboutController', function($scope)
{
	
});
