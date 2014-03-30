'use strict';

var viewCtrl = function($scope, $http, $location, $modal, $routeParams) {
    var id = $routeParams.id;
    $http.get('/goals/' + id).success(function (data, status, headers, config) {
        $scope.goal = clientUtil.bindGoalView(data.goal, 'notes');
    });

    $scope.toggleAddNoteForm = function () {
        var formDiv = $('#add-note-form');
        if (formDiv.hasClass('hidden')) {
            formDiv.removeClass('hidden');
            formDiv.fadeIn();
            $scope.comment = {
                date    : new Date(),
                content : null
            };
        } else {
            formDiv.addClass('hidden');
            formDiv.fadeOut();
        }
    };

    $scope.saveNote = function () {
        $http.post('/goal/notes/' + id, {
            'comment' : $scope.comment 
        }).success(function (data) {
            $scope.toggleAddNoteForm();
            $http.get('/goals/' + id).success(function (data, status, headers, config) {
                $scope.goal = clientUtil.bindGoalView(data.goal, 'notes');
            });
        });
    };

    $scope.deleteNote = function() {
        var noteId = this.comment._id,
        modalInstance = $modal.open({
            templateUrl: '/templates/modal',
            controller: modalInstanceCtrl,
            resolve: {
                modalData: function () {
                    return {
                        title : "Do you really want to delete this note?",
                        body  : "This deletion operation can not be undo",
                        yesLabel: "Delete it",
                        noLabel: "Dismiss",
                        id: noteId
                    };
                }
            }
        });
        modalInstance.result.then(function (noteId) {
            $http.delete('/goal/notes/' + id + '/' + noteId).success(function (data) {
                $http.get('/goals/' + id).success(function (data, status, headers, config) {
                    $scope.goal = clientUtil.bindGoalView(data.goal, 'notes');
                });
            });
        }, function () {
            console.debug('Modal dismissed at: ' + new Date());
        });
    };
};

viewCtrl.$inject = ['$scope', '$http', '$location', '$modal', '$routeParams'];

angular.module('mainApp').controller('viewCtrl', viewCtrl);