angular.module("githubprofiles", []);


// (function () { ... }());
// This isolates the next section of code. Normally each of these would
// be in a separate file during development, and combined as part of the
// application's build process -- eg, using require.js
(function () {
    
    // A controller handles data and events
    // Any variables it sets on $scope are available to the template
    var controller = [ "$scope", "$http", function($scope, $http) {
        $scope.profile = null        
        $scope.status = null;

        // As submit is on $scope, it's available to the template.
        // It is a function, called by clicking the submit button
        // bound by ng-click='submit()'
        $scope.submit = function () { 
          $scope.profile = null
          $scope.status = "Fetching..."
          var url = "https://api.github.com/users/" + $scope.username
          
          // $http is a wrapper around XMLHttpRequest.
          // $http.get(url) immediately returns a "promise" object. 
          // However the HTTP GET request itself takes some time -- the promise
          // object has a 'then' method which takes two callback function. The first
          // for if the request succeeeded, and the second for if the request failed.
          // The unique part about promises is that it's possible to chain them together --
          // to have the 'then' method produce another promise. Though we don't do that here.
          $http.get(url).then(
              // On success...
              function (result) {
                $scope.status = null
                $scope.profile = result.data
              },
              // On error...
              function (error) {
                $scope.status = error.data   
              }
          );
        }
    } ];
    
    angular.module("githubprofiles").directive("profileFetcher", function() {
        return {
            // This means the directive must be an Element -- ie we're declaring what the
            // <profile-fetcher></profile-fetcher> tag should do
            restrict: "E",
            
            // Link the controller we declared before
            controller: controller,
            
            // And here's the template to show for this element
            // Note that we've included a few more angular directives in the template:
            // <profile-details> (declared below)
            // ng-show, which is a built-in directive that sets the element visible if the expression 
            // is true.
            // ng-click, which binds the button's onClick action to $scope.submit()
            template: "<div class='form'>"                                          +
                      "  <div class='form-group'>"                                  +
                      "    <label>Username</label> <input ng-model='username' />"   +
                      "    <button ng-click='submit()' class='btn btn-primary'>"    +
                      "      Look up"                                               +
                      "    </button>"                                               +
                      "  </div>"                                                    +
                      "</div>"                                                      +
                      "<div class='alert' ng-if='status'>{{status}}</div>"          +
                      "<profile-details profile='profile' ng-show='profile'></profile-details>"
        }
    });
    
}());


(function () {
    
    angular.module("githubprofiles").directive("profileDetails", function() {
        return {
            restrict: "E",
            
            // This declares that this directive has its own $scope, but that the 
            // value of $scope.profile should be kept in sync with a variable in the
            // parent's scope
            // If you look back at line 69, you'll see
            // <profile-details profile="profile"...
            // which is where we bind the parent's $scope.profile to this $scope.profile
            scope: { "profile" : "=" },
            template: "<p>                                                      " +
                      "  <label>user ID</label> <span>{{ profile.id }}</span>   " +
                      "</p>                                                     " +
                      "<h4>JSON data</h4>                                       " +
                      "<p>{{ profile }}</p>                                     "
        }
    });
    
}());
