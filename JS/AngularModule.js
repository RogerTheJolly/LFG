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
	
	.when('/message',
    {
        templateUrl: 'message.html',
		controller: 'MessageController'
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
app.controller('MessageController', function($scope, $rootScope, $window, StoreService)
{
	//TODO: make this global
	$scope.setUser = function(user){
		$scope.user = {};
		$scope.user[user] = true;
	};
	
	var docRef = db.collection("groups").doc($window.location.toString().split("message?")[1]);

	docRef.get().then(function(doc) {
		if (doc.exists) {
			$scope.$apply(function () {
				$scope.groupName = doc.data().title.toString();
				$scope.groupImage = doc.data().image.toString();
				$scope.groupDesc = doc.data().about.toString();
				$scope.groupProperties = doc.data().properties;		
				$scope.game = doc.data().game;
			});
		} else {
			console.log("No such group!");
		}
	}).catch(function(error) {
		console.log("Error getting group data:", error);
	});
	
});
app.controller('loginController', function($scope, $rootScope, StoreService)
{
	//This will trigger the loader div
	$scope.setLogIn = function(bool){
		
		sessionStorage.loggingIn = bool;
		console.log(sessionStorage.loggingIn);
		
	};
	if(sessionStorage.loggingIn == "true")
		{
			document.getElementById('loginOverlay').style.display = "block";
		}
	else
	{
		document.getElementById('loginOverlay').style.display = "none";
	}
});
app.controller('HomeController', function($scope, $location, $window, $rootScope, StoreService)
{
	var firstLoad = true;
	
	//TODO: make this global
	$scope.setUser = function(user){
		$scope.user = {};
		$scope.user[user] = true;
	};
	
	$scope.clearLoadedGroups = function(){
		StoreService.clearLoadedGroups();
		$scope.loadGroups();
	};
	$scope.createGroup = function(){
		console.log("CREATING GROUP", $rootScope.optionValues);
		
		var keyArray = [];
		var keyCounts = [];
		var dataObject = {};
		for(i = 1; i < Object.keys($rootScope.optionValues).length; i++)
		{
			console.log(Object.keys($rootScope.optionValues)[i]);
			
			var key = Object.keys($rootScope.optionValues)[i];
			var keySplit = key.split('.');
			
			if($.inArray(keySplit[0], keyArray) == -1)
			{
				keyArray.push(keySplit[0]);
			}	
		}
		//dataObject[keyArray[0]] = {1: true, 2: false ,3: true,4: false,5: true};
		console.log(keyArray);
		console.log(dataObject);
		
		var countArray = [];
		for(i = 0; i < keyArray.length; i++)
		{
			countArray[i] = 0;
			var key = Object.keys($rootScope.optionValues)[i];
			var keySplit = key.split('.');
			
			for(j = 0; j < Object.keys($rootScope.optionValues).length; j++)
			{
				if(Object.keys($rootScope.optionValues)[j].split('.')[0] == keyArray[i])
				{
					//console.log(Object.keys($rootScope.optionValues)[j].split('.')[0]);
					countArray[i]++;
				}
			}
		}
		console.log(countArray);
		
		for(i = 0; i < keyArray.length; i++)
		{
			console.log(i, countArray[i]);
			var temp = "{";
			
			for(j = 0; j <= countArray[i]; j++)
			{
				var key = Object.keys($rootScope.optionValues)[j];
				var key2 = Object.keys($rootScope.optionValues)[j+1];
				var keySplit = key.split('.');
				var keySplit2 = key2.split('.');
				//console.log(key);
				
				if(key != "game")
				{
					if(keySplit[0] == keyArray[i])
					{
						if(keySplit.length == 2)
						{
							var path = keyArray[i] + "." + keySplit[1];
							//console.log(path, $rootScope.optionValues[path]);
							//console.log($rootScope.optionValues.Type.Offline)
							temp += '"' + keySplit[1] + '":' + $rootScope.optionValues[path];
							
							if(j != countArray[i])
								temp += ",";
							else
								temp += "}";
							//console.log(temp);
						}
						//dataObject[Roles] = {"DPS":{"have":true, "need":true},"Healer":{"have":true, "need":true},"Tank":{"have":true, "need":true}}
						else if(keySplit.length == 3)
						{
							//console.log(keySplit[2]);
							var path = keyArray[i] + "." + keySplit[1] + "." + keySplit[2];
							var path2 = keyArray[i] + "." + keySplit2[1] + "." + keySplit2[2];
							//console.log($rootScope.optionValues[path]);
							//       "    Tank           ":{"  have           ":     true                             , "    need            ":    false
							temp += '"' + keySplit[1] + '":{"' + keySplit[2] + '":' +  $rootScope.optionValues[path] + ', "' + keySplit2[2] + '":' + $rootScope.optionValues[path2] + '}';
							
							if(j != countArray[i] - 1)
							{
								temp += ",";
							}
							else
								temp += "}";
							
							console.log(temp);
							
							j++;
							
						}
					}
					else
					{
						countArray[i]++;
					}
				}
				else
				{
					continue;
				}
			}
			dataObject[keyArray[i]] = JSON.parse(temp);
		}
		console.log(dataObject);
		console.log($scope.user);
		
		
		db.collection("groups").doc().set({
			title: $rootScope.title,
			about: $rootScope.about,
			game: $rootScope.optionValues.game,
			image: "https://picsum.photos/300/200/?random?2018-05-16 07:29:27.380355",
			properties: dataObject,
			users: $scope.user,
		})
		.then(function() {
			console.log("Document successfully written!");
		})
		.catch(function(error) {
			console.error("Error writing document: ", error);
		});
	};
	
	/*$scope.getMessages = function()
	{
		var docs = db.collection("groups").where("users." + userID, "==", true);
		docs.get()
			.then(function(querySnapshot) {
					//TODO: Make this a function!
					var item = document.createElement("div");
					item.classList.add("message");
					grid.appendChild(item);
					
					var image = doc.data().image.toString();
					
					(function(i, doc) {	
						item.addEventListener("click", function(){
							$scope.clicked = i;
							navigate('index.html#/group?' +  doc.id);
						});
					})(counter, doc);

					image = image.replace('300', item.offsetWidth);
					image = image.replace('200', item.offsetHeight);
					item.style.backgroundImage = "url('" + image +"')";	
					loadedGroups.push(item);
				});
			})
			.catch(function(error) {
				console.log("Error getting documents for user: ", error);
			});
	};*/
	//Filter by My Groups
	$scope.loadMyGroups = function()
	{
		var userID = firebase.auth().currentUser.uid;
		
		console.log(userID);
		
		//TODO: Merge this into a function
		var items = document.getElementsByClassName('item');
		var loopEnd = items.length;
		
		for(i = loopEnd; i > 0; i--)
		{
			items[i-1].remove();
		}
		var loadedGroups = [];
		var docs = db.collection("groups").where("users." + userID, "==", true);
		docs.get()
			.then(function(querySnapshot) {
				querySnapshot.forEach(function(doc) {
					// doc.data() is never undefined for query doc snapshots
					console.log(doc.id, " => ", doc.data());
					
					//TODO: Make this a function!
					var item = document.createElement("div");
					item.classList.add("item");
					grid.appendChild(item);
					
					var image = doc.data().image.toString();
					
					(function(i, doc) {	
						item.addEventListener("click", function(){
							$scope.clicked = i;
							navigate('index.html#/group?' +  doc.id);
						});
					})(counter, doc);
					
					var title = document.createElement("div");
						title.classList.add("groupTitle");
						
						if(doc.data().title.length > 0)
							title.innerHTML = doc.data().title + ": " + doc.data().game;
						else
							title.innerHTML = doc.data().game;

					image = image.replace('300', item.offsetWidth);
					image = image.replace('200', item.offsetHeight);
					item.style.backgroundImage = "url('" + image +"')";	
					item.appendChild(title);
					loadedGroups.push(item);
				});
			})
			.catch(function(error) {
				console.log("Error getting documents for user: ", error);
			});
			StoreService.saveLoadedGroups(loadedGroups);
		
	};
	// Run after view loaded.
	var counter = 0;
	$scope.loadGroups = function(index){
		//{
			//console.log($rootScope.optionValues);
			var loadedGroups = StoreService.getLoadedGroups();
			
			//If there are previously loaded groups, restore those instead of doing a full load
			if(typeof loadedGroups != 'undefined' || loadedGroups == {})
			{
				StoreService.restoreLoadedGroups();
			}
			else
			{
				//TODO: Merge this into a function
				var items = document.getElementsByClassName('item');
				var loopEnd = items.length;
				
				for(i = loopEnd; i > 0; i--)
				{
					items[i-1].remove();
				}
				
				var grid = document.getElementById('grid');
				
				console.log("FIRST LOAD");
				
				loadedGroups = [];
				//Get the Groups from the DB
				db.collection("groups").get().then((querySnapshot) => {
					querySnapshot.forEach((doc) => {
						//console.log(`${doc.id} => ${doc.data()}`);
						
						//TODO: Make this a function!
						var item = document.createElement("div");
						item.classList.add("item");
						grid.appendChild(item);
						
						var title = document.createElement("div");
						title.classList.add("groupTitle");
						
						if(doc.data().title.length > 0)
							title.innerHTML = doc.data().title + ": " + doc.data().game;
						else
							title.innerHTML = doc.data().game;
						
						var image = doc.data().image.toString();
						
						(function(i, doc) {	
							item.addEventListener("click", function(){
								$scope.clicked = i;
								//$window.location = "/LFG/index.html#/group?" + doc.id;
								navigate('index.html#/group?' +  doc.id);
							});
						})(counter, doc);

						image = image.replace('300', item.offsetWidth);
						image = image.replace('200', item.offsetHeight);
						item.style.backgroundImage = "url('" + image +"')";
						item.appendChild(title);
						loadedGroups.push(item);
						
						counter++;
					});
				});
				//console.log(loadedGroups);
				StoreService.saveLoadedGroups(loadedGroups);
			}
	};
	
	if(document.getElementsByClassName('item').length == 0) 
		$scope.loadGroups();
	
	
	$scope.loadGroupsFilter = function(index){
		//{
			console.log($rootScope.optionValues);
			
			var grid = document.getElementById('grid');
			//Filter loads
			var items = document.getElementsByClassName('item');
			var loopEnd = items.length;
			
			for(i = loopEnd; i > 0; i--)
			{
				items[i-1].remove();
			}
			if($rootScope.optionValues)
			{
				var loadedGroups = [];
				StoreService.clearLoadedGroups();
				var docs = db.collection("groups").where("game", "==", $rootScope.optionValues.game)
					docs.get()
					.then(function(querySnapshot) {
						querySnapshot.forEach(function(doc) {
							// doc.data() is never undefined for query doc snapshots
							//console.log(doc.id, " => ", doc.data());
							
							var counter = 0;
							var match = true;
							for(var key in $rootScope.optionValues)
							{
								//console.log("key " + key);
								if(counter == 0)
								{
									counter++;
									continue;
								}
								else{
									var data = doc.data().properties;
									//console.log(key);
									var keySplit = key.split(".");
									//console.log(keySplit);
									
									if(keySplit.length == 2)
									{
										if(data[keySplit[0]][keySplit[1]] != $rootScope.optionValues[key])
										{
											match = false;
											counter++;
										}
										else
										{
											//console.log(key + " MATCHED")
										}
									}
									else if(keySplit.length == 3)
									{
										if(data[keySplit[0]][keySplit[1]][keySplit[2]] != $rootScope.optionValues[key])
										{
											match = false;
											counter++;
										}
										else
										{
											//console.log(key + " MATCHED")
										}
									}
								}
								counter++;
							}
							console.log("MATCH: " + match);
							
							if(match)
							{
								//TODO: Make this a function!
								var item = document.createElement("div");
								item.classList.add("item");
								grid.appendChild(item);
								
								var image = doc.data().image.toString();
								
								(function(i, doc) {	
									item.addEventListener("click", function(){
										$scope.clicked = i;
										//$window.location = "/LFG/index.html#/group?" + doc.id;
										navigate('index.html#/group?' +  doc.id);
									});
								})(counter, doc);

								image = image.replace('300', item.offsetWidth);
								image = image.replace('200', item.offsetHeight);
								item.style.backgroundImage = "url('" + image +"')";	
								loadedGroups.push(item);
							}
							
						});
					})
					.catch(function(error) {
						console.log("Error getting documents: ", error);
					});
					StoreService.saveLoadedGroups(loadedGroups);
			}
					
	};
	
});

app.controller('GroupController', function($scope, $window, StoreService)
{
	//TODO: make this global
	$scope.setUser = function(user){
		$scope.user = {};
		$scope.user[user] = true;
	};
	
    console.log('GroupController', $window.location.toString().split("?")[1]);
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
		//console.log(path, $scope.groupProperties);
		path = path.split(".");
		return($scope.groupProperties[path[0]][path[1]]);
	}	
});

app.controller('popUpController', function($scope, $rootScope, StoreService)
{
	var gamesArray = [];
	db.collection("game_list").get().then((querySnapshot) => {
		querySnapshot.forEach((doc) => {
			//console.log(`${doc.id} => ${doc.data()}`);
			//console.log(doc.data().gamesArray[counter]);
			console.log("load games");
			$scope.$apply(function () {
				$scope.gamesArray = doc.data().gamesArray;
			});
		});
		console.log("Games Ready");
		autocomplete(document.getElementById("gameSearch"), $scope.gamesArray);
	});
	$scope.gameChanged = function(game) {
		//$scope.itemList.push(item.name);
		console.log(game);
		//Get game info
		var docRef = db.collection("games").doc(game);

		docRef.get().then(function(doc) {
			if (doc.exists) {
				var properties = doc.data().properties;
				
				$scope.$apply(function () {
					$scope.filterGame = game;
					$scope.properties = properties;
				});
				
				
				
			} else {
				console.log("No such game!");
			}
		}).catch(function(error) {
			console.log("Error getting game data:", error);
		});
	}    
	
	$scope.optionChanged = function(value, path){
		console.log("CHANGE", value, path);
		var options = document.getElementsByClassName('option');
		var optionValues = {};
		
		optionValues["game"] = $scope.filterGame;
		
		for(i = 0; i < options.length; i++)
		{
			if(options[i].tagName.toLowerCase() == 'input')
			{
				optionValues[options[i].id] = options[i].checked;
			}
			else{
				if(options[i].value == "true")
				{
					optionValues[options[i].id] = true;
				}
				//if(options[i].value == "true")
				else
				{
					optionValues[options[i].id] = false;
				}
			}
		}
		$rootScope.optionValues = optionValues;	
	}
	
	$scope.titleChanged = function(value){
		$rootScope.title = value;
	}
	$scope.aboutChanged = function(value){
		$rootScope.about = value;
	}
});
app.service('StoreService',function(){

	var loadedGroups={};
	this.saveLoadedGroups=function(groups){        
		this.loadedGroups=groups;
		console.log(this.loadedGroups);
	};
	this.restoreLoadedGroups=function(){
		if(this.loadedGroups)
		{
			for(i = 0; i < this.loadedGroups.length; i++)
			{
				grid.appendChild(this.loadedGroups[i]);
			}
			console.log("RESTORING");
		}
	};
	this.getLoadedGroups=function(){
		return this.loadedGroups;  
	};
	this.clearLoadedGroups=function(){
		this.loadedGroups = undefined;
	};
});