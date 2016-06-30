angular.module('todo.controllers', [])

.controller('DashCtrl', function ($scope, DataService) {
    $scope.todo = {};

    $scope.addTodo = function () {
        DataService.postTodo($scope.todo).success(function (data) {
            console.log($scope.todo);
            console.log(data);
            $scope.todo.title = null;
            $scope.todo.description = null;
            $scope.todo.deadline = null;
            $scope.todo.priority = null;
        });
    }
})

.controller('TodoCtrl', function ($scope, $state, DataService) {
    DataService.getTodos().success(function (res) {
        $scope.todos = res;
    });

    $scope.todoSelect = function (td) {
        //$state.go('tab.todo-detail', td);
    };
})

.controller('LoginCtrl', function ($scope, LoginService, $ionicPopup, $state) {
    $scope.data = {};

    $scope.login = function () {
        var credentials = {
            username: $scope.data.username,
            password: $scope.data.password
        }

        LoginService.loginUser(credentials).success(function (data) {
            $state.go('tab.dash');
        }).error(function (data) {
            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!'
            });
        });
    }
})

.controller('ChatDetailCtrl', function ($scope, $stateParams, DataService) {
    $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function ($scope) {
    $scope.settings = {
        enableFriends: true
    };
});