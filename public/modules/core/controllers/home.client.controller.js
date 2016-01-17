'use strict';
/*global public_url:false */
/*global toastr:false */
/*global jQuery:false */
/*global current_level:false */
console.log('asdasd')
angular.module('core').controller('HomeController',
    function ($scope, $http, $rootScope, Authentication, $stateParams, $location, $modal, $log, Lessons, Levels, $timeout) {
        // This provides Authentication context.
        $scope.authentication = Authentication;
        $scope.lessons = [];
        $rootScope.currentLevel = current_level;
        $scope.itemsPerPage = 4;
        $scope.currentPage = 0;
        $scope.subscribe = false;
        $scope.public_url = public_url;
        $scope.showStoryTime = false;

        if (!$scope.authentication.user) {
            $location.path('index2');
        }
        if ( jQuery.cookie('deal') !== null ) {
            $scope.showDeal = true;
        }
        if ($scope.authentication.user && ($scope.authentication.user.subscribed === true || $scope.authentication.user.roles.indexOf('admin') !== -1)) {
            $scope.accessLevel = true;
        }

        $scope.isAdmin = function () {
            return $scope.authentication.user.roles.indexOf('admin') !== -1;
        };

        $scope.passedLesson = function (lesson) {
            return $scope.authentication.user.lesson_passed.indexOf(lesson._id) !== -1;
        };

        $scope.viewLesson = function (lessonId) {
            $location.path('lesson/' + lessonId);
        };

        $scope.proveLessonMastery = function (lessonId) {
            $location.path('lesson_mastery/' + lessonId);
        };

        $scope.openStoryTime = function (lesson) {
            $rootScope.embedcode = lesson.story_time;
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'modules/core/views/show_video.client.view.html',
                size: 'lg'
            });

            modalInstance.result.then(function (selectedItem) {}, function () {

            });
        };


        $scope.subscribe = function () {
            //$location.path('subscribe');
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'modules/core/views/subscribe_modal.client.view.html',
                controller: 'SubscriptionModalCtrl',
                size: 'md'
            });



            modalInstance.result.then(function (selectedItem) {

            }, function () {
                if (jQuery.cookie('deal') === 'null') {
                    $log.info('Modal subscribe dismissed at: ' + new Date());
                    $http.get('/users/me').then(function (res) {
                        $scope.current_user = res.data;
                        if (!$scope.current_user.subscribed && !$scope.current_user.superdeal) {
                            var currentTime = new Date();
                            var futureTime = (new Date()).addMinutes(20);
                            jQuery.cookie('deal', futureTime.getTime());
                            $http.get('/superdeal').then(function (res) {});
                            window.location.reload();
                        }
                    });
                }

            });
        };


        var viewed_videos = $scope.authentication.user.viewed_video;
        $scope.viewed_video_ids = [];
        angular.forEach(viewed_videos, function (video) {
            $scope.viewed_video_ids.push(video.video);
        });

        $scope.lessionStatus = function (lesson) {
            var status = 'Not started yet';
                if ($scope.authentication.user.lesson_passed.indexOf(lesson._id) !== -1) {
                    status = 'Mastered';
                    return status;
                }

                angular.forEach(lesson.videos, function (video) {
                    if ($scope.viewed_video_ids.indexOf(video._id) !== -1) {
                        status = 'Have started';
                        return status;
                    }
                });
                return status;
        };

        $scope.haveStarted = function (lesson) {
            var status = false;
            if ($scope.authentication.user.lesson_passed.indexOf(lesson._id) !== -1) {
                    return true;
                }
            angular.forEach(lesson.videos, function (video) {
                if ($scope.viewed_video_ids.indexOf(video._id) !== -1) {
                    status = true;
                    return status;
                }
            });
            return status;
        };

        $scope.getLessons = function () {
            Lessons.query({
                level: $rootScope.currentLevel
            }, function (lessons) {
                angular.forEach(lessons, function (lesson) {
                    $scope.getVideos(lesson);
                });
            });
        };





        $scope.getVideos = function (lesson) {
            Lessons.get({
                lessonId: lesson._id
            }, function (data) {
                $scope.lessons.push(data);
            });
        };

        $scope.viewVideo = function (lesson, video) {
            $location.path('lessons/' + lesson._id + '/video/' + video._id);
        };

        $scope.showLevelModal = function () {
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'modules/core/views/level_modal.client.view.html',
                controller: 'ChangeLevelCtrl',
                size: 'lg',
                resolve: {
                    levels: function () {
                        return $scope.levels;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };


    }
);

angular.module('core').controller('ChangeLevelCtrl',
    function ($scope, $http, $rootScope, Authentication, $stateParams, $location, $modal, $modalInstance, Levels) {
        $scope.closeModal = function () {
            $modalInstance.dismiss('cancel');
        };
        $scope.subscribe = function () {
            //$location.path('subscribe');
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'modules/core/views/subscribe_modal.client.view.html',
                controller: 'SubscriptionModalCtrl',
                size: 'md'
            });



            modalInstance.result.then(function (selectedItem) {

            }, function () {
                if (!jQuery.cookie('deal')) {
                    var currentTime = new Date();
                    var futureTime = (new Date()).addMinutes(20);
                    jQuery.cookie('deal', futureTime.getTime());
                    window.location.reload();
                }

            });
        };
        $scope.all_levels = Levels.query();
        $scope.authentication = Authentication;
    
        $scope.passedLevel = function (level) {
            return $scope.authentication.user.level_passed.indexOf(level.order) !== -1;
        };
    
        $scope.setCurrentLevel = function (level) {
            if ($scope.authentication.user.subscribed || $scope.authentication.user.roles.indexOf('admin') !== -1) {
                if (level.order === 1 || level.is_published || $scope.authentication.user.roles.indexOf('admin') !== -1) {
                    $http.get('set_current_level?level=' + level.order).then(function (res) {
                        $rootScope.currentLevel = level.order;
                        $modalInstance.dismiss('cancel');
                        window.location.reload();
                    });
                } else {
                    toastr.error('Available soon');
                }
            } else {
                if (level.order !== 1) {
                    $scope.subscribe();
                } else {
                    $http.get('set_current_level?level=' + level.order).then(function (res) {
                        $rootScope.currentLevel = level.order;
                        $modalInstance.dismiss('cancel');
                        window.location.reload();
                    });
                }
            }



        };
    }
);

angular.module('core').controller('SubscriptionModalCtrl',
    function ($scope, $http, $rootScope, Authentication, $stateParams, $location, $modal, $modalInstance) {
        $scope.closeModal = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.goToSubscription = function () {
            $scope.closeModal();
            $location.path('subscribe');
        };

    }
);

angular.module('core').controller('ThankYouCtrl',
    function ($scope, $http, Lessons) {

        $http.get('/users/me').then(function (res) {
            $scope.current_user = res.data;
        });

        Lessons.query({
            level: 1
        }, function (lessons) {
            console.log(lessons);
            $scope.lessons = lessons;
        });


    }
);

angular.module('core').controller('FrontPageCtrl',
    function ($scope, $rootScope, $modal) {

        $scope.showVideo = function (link) {
            $rootScope.embedcode = '<iframe frameborder="0" name="1443365111594" src="' + link + '" id="iframe" class="cboxIframe" show-video style="width: 100%;height: 500px;"></iframe>';
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'modules/core/views/show_video.client.view.html',
                size: 'lg'
            });

            modalInstance.result.then(function (selectedItem) {}, function () {

            });
        };


    }
);

angular.module('core').controller('SubscriptionCtrl',
    function ($scope, $http, $rootScope, Authentication, $stateParams, $location, $modal, Levels, $braintree, $log) {
        var client;
        $scope.isValid = false;
        $scope.creditCard = {
            number: '',
            expirationDate: ''
        };


        var startup = function () {
            $braintree.getClientToken().success(function (token) {
                client = new $braintree.api.Client({
                    clientToken: token
                });
            });
        };

        $http.get('/users/me').then(function (res) {
            $rootScope.current_user = res.data;
        });

        $scope.showCouponModal = function () {
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                controller: 'SubscriptionCtrl',
                templateUrl: 'modules/core/views/coupon_modal.client.view.html',
                //size: 'lg'
            });

            modalInstance.result.then(function (selectedItem) {}, function () {
                $log.info('Modal showPaymentModal dismissed at: ' + new Date());
            });
        };

        $scope.showPaymentModal = function (plan, $event) {
            $rootScope.plan = plan;
            if (jQuery($event.target).parent().data('plan')) {
                $rootScope.plan = 'superdeal';
            }
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                controller: 'SubscriptionCtrl',
                templateUrl: 'modules/core/views/payment_modal.client.view.html',
                size: 'lg'
            });

            modalInstance.result.then(function (selectedItem) {}, function () {
                $log.info('Modal showPaymentModal dismissed at: ' + new Date());
            });
        };

        $scope.$watch('creditCard.expirationDate', function (old_value, new_value) {
            var exp = jQuery.payment.cardExpiryVal($scope.creditCard.expirationDate);
            $scope.isValid = jQuery.payment.validateCardExpiry(exp.month, exp.year) && jQuery.payment.validateCardNumber($scope.creditCard.number);
        });

        $scope.$watch('creditCard.number', function (old_value, new_value) {
            var exp = jQuery.payment.cardExpiryVal($scope.creditCard.expirationDate);
            $scope.isValid = jQuery.payment.validateCardExpiry(exp.month, exp.year) && jQuery.payment.validateCardNumber($scope.creditCard.number);
        });


        $scope.$watch('creditCard.cvc', function (old_value, new_value) {
            var exp = jQuery.payment.cardExpiryVal($scope.creditCard.expirationDate);
            $scope.isValid = (jQuery.payment.validateCardExpiry(exp.month, exp.year), jQuery.payment.validateCardNumber($scope.creditCard.number), jQuery.payment.validateCardCVC($scope.creditCard.cvc, jQuery.payment.cardType($scope.creditCard.number)));
        });

        $scope.newCustomerSubscription = function () {
            console.log($scope.plan);
            // - Validate $scope.creditCard
            // - Make sure client is ready to use
            console.log($scope.creditCard);
            client.tokenizeCard({
                number: $scope.creditCard.number,
                cvv: $scope.creditCard.cvc,
                cardholderName: $scope.creditCard.cardholderName,
                expirationDate: $scope.creditCard.expirationDate.replace(/\s/g, '')
            }, function (err, nonce) {
                console.log(err, nonce);
                showLoading();
                // - Send nonce to your server (e.g. to make a transaction)
                $http.post('/checkout', {
                    payment_method_nonce: nonce,
                    plan: $rootScope.plan
                }).then(function (res) {
                    hideLoading();
                    $location.path('thankyou');
                    window.location.reload();

                }, function(err, res) {
                    hideLoading();
                    toastr.error('Please check your information again.');
                    console.log(err, res);
                });

            });
        };

        $scope.existingCustomerSubscription = function () {
            showLoading();
            $http.post('/checkout', {
                plan: $rootScope.plan
            }).then(function (res) {
                hideLoading();
                $location.path('thankyou');
                window.location.reload();
            }, function(err, res) {
                hideLoading();
                toastr.error('Please check your information again.');
                console.log(err, res);
            });
        };

        startup();
    }
);
