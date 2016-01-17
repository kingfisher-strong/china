'use strict';

angular.module('lessons', [])
    .service('Cores', ['$http', '$q', '$rootScope', function ($http, $q, $rootScope) {

        this.setViewedVideo = function (videoId, callback) {
            return $http({
                url: 'viewed_video',
                method: 'POST',
                data: {videoId: videoId}
            }).success(function (res) {
                if (typeof callback === 'function') {
                    callback(res);
                }

            }).error(function (res) {
                if (typeof callback === 'function') {
                    callback(res);
                }
            });
        };

        this.setLessonPassed = function (lessonId, callback) {
            return $http({
                url: 'lesson_passed',
                method: 'POST',
                data: {lessonId: lessonId}
            }).success(function (res) {
                if (typeof callback === 'function') {
                    callback(res);
                }

            }).error(function (res) {
                if (typeof callback === 'function') {
                    callback(res);
                }
            });
        };

        this.setLevelPassed = function (levelId, callback) {
            return $http({
                url: 'level_passed',
                method: 'POST',
                data: {levelId: levelId}
            }).success(function (res) {
                if (typeof callback === 'function') {
                    callback(res);
                }

            }).error(function (res) {
                if (typeof callback === 'function') {
                    callback(res);
                }
            });
        };
    }]);
