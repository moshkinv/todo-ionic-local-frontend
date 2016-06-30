angular.module('todo.services', [])

.service('LoginService', function ($q, $http, $localStorage) {

    return {
        loginUser: function (credentials) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            $http.post("http://ec2-52-208-152-192.eu-west-1.compute.amazonaws.com:27019/api/authenticate", credentials).then(function (response) {
                if (response.data.success) {
                    $localStorage.setObject('user', response.data.user);
                    $localStorage.set('token', response.data.token);

                    deferred.resolve('Welcome ' + credentials.username + '!');
                } else {
                    deferred.reject('Wrong credentials.');
                }
            });

            promise.success = function (fn) {
                promise.then(fn);

                return promise;
            }
            promise.error = function (fn) {
                promise.then(null, fn);

                return promise;
            }

            return promise;
        }
    }
})

.factory('$localStorage', function ($window) {
    return {
        set: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            return $window.localStorage.getItem(key) || defaultValue;
        },
        setObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key) {
            return JSON.parse($window.localStorage[key] || '{}');
        }
    }
})

.factory('AccessTokenHttpInterceptor', function ($localStorage) {
    return {
        //For each request the interceptor will set the bearer token header.
        request: function ($config) {
            //set authorization header
            $config.headers['x-access-token'] = $localStorage.get('token');

            return $config;
        },
        response: function (response) {
            //if you get a token back in your response you can use 
            //the response interceptor to update the token in the 
            //stored in the cookie
            if (response.config.headers['x-access-token']) {
                //fetch token
                var token = response.config.headers.yourTokenProperty;

                //set token
                $cookies.put('token', token);
            }

            return response;
        }
    };
})

.factory('DataService', function ($http, $localStorage) {

    return {
        getTodos: function () {
            return $http.get('http://ec2-52-208-152-192.eu-west-1.compute.amazonaws.com:27019/api/todos', {
                headers: {
                    'x-access-token': $localStorage.get('token')
                }
            });
        },

        getTodoById: function () {
            // code here
        },

        postTodo: function (todo) {
            return $http.post('http://ec2-52-208-152-192.eu-west-1.compute.amazonaws.com:27019/api/addtodo', todo, {
                headers: {
                    'x-access-token': $localStorage.get('token')
                }
            });
        }
    }

});