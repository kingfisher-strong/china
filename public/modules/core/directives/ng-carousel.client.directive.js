'use strict';
/*global jQuery:false */
/*global toastr:false */
/*global vzPlayer:false */
/*global setInterval:false */
/*global widnow:false */
/*global document:false */
/*global angular:false */
angular.module('core').directive('ngCarousel', [
    function () {
        return {
            restrict: 'A',
            link: function (scope, elm, attrs) {

                if (!scope.myCarousel) {
                    jQuery(elm).css('visibility', 'hidden');
                    var checkLevel = setInterval(function () {
                        if (jQuery(elm).find('li').length > 0) {
                            scope.myCarousel = jQuery(elm).carouFredSel({
                                circular: true,            // Determines whether the carousel should be circular.
                                infinite: true,            // Determines whether the carousel should be infinite. Note: It is possible to create a non-circular, infinite carousel, but it is not possible to create a circular, non-infinite carousel.
                                responsive: false,        // Determines whether the carousel should be responsive. If true, the items will be resized to fill the carousel.
                                direction: 'left',
                                padding: 0,

                                align: 'right',        // Whether and how to align the items inside a fixed width/height. Possible values: "center", "left", "right" or false.
                                items: {

                                    visible: 4,

                                    width: 180
                                },

                                auto: false,
                                scroll: {
                                    items: 4,
                                    easing: 'swing',
                                    duration: 1000,
                                    pauseOnHover: true
                                },
                                prev: {
                                    button: '#nav-left',
                                    key: 'left'
                                },

                                next: {
                                    button: '#nav-right',
                                    key: 'right'
                                }
                            });
                        }

                        clearInterval(checkLevel);
                        jQuery(elm).css('visibility', 'visible');
                    }, 1000);


                } else {
                    jQuery('#levels').trigger('insertItem', jQuery(elm));
                }
            }

        };

    }
]);

angular.module('core').directive('ngSubscribe', ['$http',
    function ($http) {
        return {
            restrict: 'A',
            link: function (scope, elm, attrs) {
                $http.get('/users/me').then(function (res) {
                    scope.current_user = res.data;
                    if (!scope.current_user.subscribed) {
                        var d = new Date();
                        if (  jQuery.cookie('deal') === 'undefined' && jQuery.cookie('deal') !== 'done'){
                            var futureTime = (new Date()).addMinutes(20);
                            jQuery.cookie('deal', futureTime.getTime());
                        }
                        if (jQuery.cookie('deal') && parseInt(jQuery.cookie('deal')) > d.getTime()) {
                            jQuery('#hurry_up').show();
                            jQuery('.best-value').parent().addClass('superdeal');
                            jQuery('.best-value').parent().find('strong').text('$5');
                            jQuery('.best-value').attr('src', 'modules/core/img/superdeal.png');
                            jQuery('.best-value').parent().find('.checkout-button').attr('data-plan', 'superdeal').find('img').attr('src', 'modules/core/img/subscribe2.png');
                            jQuery('.best-value').parent().find('.list-group-item:last-child').html('Total: $60<br>You save <big>$180</big>');
                            jQuery('.best-value + div, .best-value + div .list-group li').css({'background-color': '#face3e'});
                            jQuery('div#clock').countdown(jQuery.cookie('deal'), function (event) {
                                jQuery(this).text(
                                    event.strftime('%Mm %Ss')
                                );
                            })
                                .on('update.countdown', function (event) {
                                    if (event.strftime('%M') === '00' && parseInt(event.strftime('%S')) < 30) {
                                        jQuery('div#clock').css({'color': 'red'});
                                    }
//                                    console.log('update.countdown');

                                })
                                .on('finish.countdown', function (event) {
                                    window.location.href = '/#/subscribe';
                                    jQuery.cookie('deal', 'done');
//                                    console.log('finish.countdown');
                                    $http.get('/superdeal').then(function (res) {});
                                });
                        }

                    }
                });
            }

        };

    }
]);

angular.module('core').directive('superDeal', ['$http',
    function ($http) {
        return {
            restrict: 'A',
            link: function (scope, elm, attrs) {
                jQuery(window).joyride("destroy");
                            
                $http.get('/users/me').then(function (res) {
                    if (res !== null) {


                        scope.current_user = res.data;
                        var d = new Date();
                        jQuery(document).on('click', '#close_roundtour', function (e) {
                            e.preventDefault();
                            jQuery('.joyride-close-tip').trigger('click');
                            return false;
                        });

                                
                        if (scope.current_user && !scope.current_user.seen_tour) {
                            jQuery('#joyRideTipContentTour').joyride({
                                    autoStart: true,
                                    postStepCallback: function (index, tip) {
                                        //if (index == 0) {
                                        //    console.log(tip);
                                        //}
                                    },
                                    modal: true,
                                    expose: true
                            });
                            scope.current_user.seen_tour = true;
                            $http.get('/seen_tour').then(function (res) {
                                scope.current_user.seen_tour = true;
                            });
                        }

                        if (scope.current_user && !scope.current_user.subscribed) {
                            if (jQuery.cookie('deal') && parseInt(jQuery.cookie('deal')) > d.getTime()) {
                                jQuery(elm).show();

                                jQuery('div#clock').countdown(jQuery.cookie('deal'), function (event) {
                                    jQuery(this).text(
                                        event.strftime('%Mm %Ss')
                                    );
                                })
                                    .on('update.countdown', function (event) {
                                        if (event.strftime('%M') === '00' && parseInt(event.strftime('%S')) < 30) {
                                            jQuery('div#clock').css({'color': 'red'});
                                        }

                                    })
                                    .on('finish.countdown', function (event) {
                                        jQuery.cookie('deal', '');
                                        $http.get('/superdeal').then(function (res) {

                                        });
                                        window.location.href = '/#!/subscribe';
                                        console.log('finish.countdown');
                                    });
                            }
                        }
                    }
                });


            }

        };

    }
]);

angular.module('core').directive('ngCard', [
    function () {
        return {
            restrict: 'A',
            link: function (scope, elm, attrs) {

                jQuery(elm).payment('formatCardNumber');
            }

        };

    }
]);

angular.module('core').directive('levelMastery', ['$http', 'Lessons', 'Quizzes', '$rootScope',  '$stateParams', '$location', 'Cores',  '$state', 'Quizreports', 'QuizAnswers', 
    function ($http, Lessons, Quizzes, $rootScope, $stateParams, $location, Cores, $state, Quizreports, QuizAnswers) {
        return {
            restrict: 'E',
            link: function (scope, elm, attrs) {
                var player = null,
                    video_ids = [];
                scope.total_quizzes = 0;
                scope.total_wrong = 0;
                scope.total_correct = 0;
                scope.order = 0;

                function shuffle(array) {
                    var currentIndex = array.length, temporaryValue, randomIndex ;

                    // While there remain elements to shuffle...
                    while (0 !== currentIndex) {

                        // Pick a remaining element...
                        randomIndex = Math.floor(Math.random() * currentIndex);
                        currentIndex -= 1;

                        // And swap it with the current element.
                        temporaryValue = array[currentIndex];
                        array[currentIndex] = array[randomIndex];
                        array[randomIndex] = temporaryValue;
                    }

                    return array;
                }

                Lessons.query({level: $rootScope.currentLevel}, function(lessons) {
                    angular.forEach(lessons, function(lesson){
                        angular.forEach(lesson.videos, function(video){
                            video_ids.push(video._id);
                        });
                    });

                    $http({
                        url: 'get_quizzes',
                        method: 'POST',
                        data: {videoIDs: video_ids.join(',')}
                    }).success(function (res) {
                        var quizzes = shuffle(res);
                        if(quizzes.length > 100){
                            quizzes = quizzes.splice(0, 100);
                        }
                        scope.quizzes = shuffle(quizzes);
                        scope.total_quizzes = quizzes.length;
                        console.log(scope.quizzes);
                        scope.current_video = scope.quizzes[scope.order];
                    }).error(function (res) {
                     
                    });
                });

                scope.$watch('order', function(new_value, old_value){
                    if(typeof scope.quizzes !== 'undefined') {
                        var current_video = scope.quizzes[new_value];
                        if (typeof current_video !== 'undefined'){
                            scope.current_video = current_video;
                        } else {
                            scope.passedLevel();
                        }
                    }

                });

                scope.passedLevel = function() {
                    if(scope.total_correct >= scope.total_quizzes*0.9){
                        toastr.success('You have passed this level');
                        $location.path('passed_level');  
                        console.log($rootScope.currentLevel);                              
                        Cores.setLevelPassed($rootScope.currentLevel, function (res) {
                        });
                        $http.get('/users/me').then(function (res) {
                            if (res !== null) {
                                window.user = res.data;
                                window.location.reload();
                            }
                        });
                    }
                }
                
                scope.saveReport = function (video) {
                    var report = new Quizreports({description: video.report_text, quiz: video._id});
                    report.$save(function (res) {
                        if (!res.message) {
                            toastr.success('We have saved your report.');
                            scope.showActionFormFlag = false;
                        }
                        else {
                            toastr.error(res.message);
                        }
                    });
                };

                scope.saveAnswer = function (video) {
                    var answer = new QuizAnswers({description: video.user_answer, quiz: video._id});
                    answer.$save(function (res) {
                        if (!res.message) {
                            toastr.success('We have saved your answer.');
                            scope.showActionFormFlag = false;
                        }
                        else {
                            toastr.error(res.message);
                        }

                    });
                };

                scope.showAnswerForm = function () {
                    scope.showAnswerFlag = true;
                    scope.showReportFlag = false;
                };

                scope.showReportForm = function () {
                    scope.showAnswerFlag = false;
                    scope.showReportFlag = true;
                };

                scope.getSolution = function () {
                    angular.forEach(scope.current_video.answers, function (answer) {
                        scope.current_video.solution = answer.description;
                        return scope.current_video.solution;
                    });
                };

                scope.setCorrectAnswers = function () {
                    angular.forEach(scope.current_video.answers, function (answer) {
                        console.log(answer.description);
                        if (answer.is_correct === 'y' || answer.is_correct === 'true') {
                            answer.correct_answer = true;
                        }
                    });
                };

                scope.showSolution = function () {
                    scope.showSolutionFlag = !scope.showSolutionFlag;
                };

                scope.checkIsCorrectAnswer = function (answer) {
                    var isCorrect = answer.is_correct === 'y' || answer.is_correct === 'true';

                    if (isCorrect) {
                        toastr.success('Awesome - correct! Moving on...');
                        scope.passedLevel();
                        scope.order += 1;
                        scope.total_correct += 1;
                        scope.showActionFormFlag = false;
                        scope.showSolutionFlag = false;
                    }
                    else {
                        toastr.error('That was the wrong answer');
                        scope.total_wrong += 1;
                        scope.showActionFormFlag = true;
                        scope.setCorrectAnswers();
                        scope.showSolutionFlag = true;
                        if(scope.total_wrong > scope.total_quizzes*0.1){
                            toastr.error('Sorry! You cannot pass this level');
                            $state.go('failed_level');
                        }
                    }

                };

                scope.checkIfFillInCorrect = function () {
                    var isCorrect = false;
                    angular.forEach(scope.current_video.answers, function (answer) {
                        if (answer.description === scope.current_video.answer) {
                            isCorrect = true;
                            return;
                        }
                    });
                    if (isCorrect) {
                        toastr.success('Awesome - correct! Moving on...');
                        scope.passedLevel();
                        scope.order += 1;
                        scope.total_correct += 1;
                        scope.showActionFormFlag = false;
                        scope.showSolutionFlag = false;
                    }
                    else {
                        toastr.error('That was the wrong answer');
                        scope.showActionFormFlag = true;                        
                        scope.total_wrong += 1;
                        scope.setCorrectAnswers();
                        scope.showSolutionFlag = true;
                        if(scope.total_wrong > scope.total_quizzes*0.1){
                            toastr.error('Sorry! You cannot pass this lesson');
                            $state.go('failed_level');
                        }
                    }
                };

                jQuery(window).joyride("destroy");

                jQuery('#lessonMasteryPopup').joyride({
                    autoStart: true,
                    postStepCallback: function (index, tip) {
                        //if (index == 0) {
                        //    console.log(tip);
                        //}
                    },
                    modal: true,
                    expose: true
                });

            }

        };

    }
]);

angular.module('core').directive('lessonMastery', ['Lessons', 'Quizzes', '$stateParams', '$location', 'Cores', 'Quizreports', 'QuizAnswers', '$state', '$rootScope',
    function (Lessons, Quizzes, $stateParams, $location, Cores, Quizreports, QuizAnswers, $state, $rootScope) {
        return {
            restrict: 'E',
            link: function (scope, elm, attrs) {
                var player = null;
                scope.total_quizzes = 0;
                scope.total_wrong = 0;
                scope.order = 0;

                function shuffle(array) {
                    var currentIndex = array.length, temporaryValue, randomIndex ;

                    // While there remain elements to shuffle...
                    while (0 !== currentIndex) {

                        // Pick a remaining element...
                        randomIndex = Math.floor(Math.random() * currentIndex);
                        currentIndex -= 1;

                        // And swap it with the current element.
                        temporaryValue = array[currentIndex];
                        array[currentIndex] = array[randomIndex];
                        array[randomIndex] = temporaryValue;
                    }

                    return array;
                }
                
                 scope.saveReport = function (video) {
                    var report = new Quizreports({description: video.report_text, quiz: video._id});
                    report.$save(function (res) {
                        if (!res.message) {
                            toastr.success('We have saved your report.');
                            scope.showActionFormFlag = false;
                        }
                        else {
                            toastr.error(res.message);
                        }
                    });
                };

                scope.saveAnswer = function (video) {
                    var answer = new QuizAnswers({description: video.user_answer, quiz: video._id});
                    answer.$save(function (res) {
                        if (!res.message) {
                            toastr.success('We have saved your answer.');
                            scope.showActionFormFlag = false;
                        }
                        else {
                            toastr.error(res.message);
                        }

                    });
                };

                scope.showAnswerForm = function () {
                    scope.showAnswerFlag = true;
                    scope.showReportFlag = false;
                };

                scope.showReportForm = function () {
                    scope.showAnswerFlag = false;
                    scope.showReportFlag = true;
                };

                scope.lesson = Lessons.get({
                    lessonId: $stateParams.lessonId
                }, function(data){

                    var video_ids = [];
                    scope.videos = data.videos;
                    angular.forEach(scope.videos, function(video){
                        video_ids.push(video._id);
                    });


                    Quizzes.query({videoIDs: video_ids.join(',')}, function(quizzes){
                        quizzes = shuffle(quizzes);
                        if(quizzes.length > 15){
                            quizzes = quizzes.splice(0, 15);
                        }
                        scope.quizzes = shuffle(quizzes);
                        scope.total_quizzes = quizzes.length;
                        scope.current_video = scope.quizzes[scope.order];
                    });


                });

                scope.$watch('order', function(new_value, old_value){
                    if(typeof scope.quizzes !== 'undefined') {
                        var current_video = scope.quizzes[new_value];
                        if (typeof current_video !== 'undefined'){
                            scope.current_video = current_video;
                        }
                        else {
                            if(scope.total_wrong <= scope.total_quizzes*0.9){
                                toastr.success('You have passed this lesson');
                                Cores.setLessonPassed($stateParams.lessonId, function (res) {
                                });
                                $location.path('passed_lesson');
                                $http.get('/users/me').then(function (res) {
                                    if (res !== null) {
                                        window.user = res.data;
                                        window.location.reload();
                                    }
                                });
                            }
                        }
                    }

                });

                scope.getSolution = function () {
                    angular.forEach(scope.current_video.answers, function (answer) {
                        scope.current_video.solution = answer.description;
                        return scope.current_video.solution;
                    });
                };

                scope.setCorrectAnswers = function () {
                    angular.forEach(scope.current_video.answers, function (answer) {
                        console.log(answer);
                        if (answer.is_correct === 'y' || answer.is_correct === 'true') {
                            answer.correct_answer = true;
                        }
                    });
                };

                scope.showSolution = function () {
                    scope.showSolutionFlag = !scope.showSolutionFlag;
                };

                scope.checkIsCorrectAnswer = function (answer) {
                    var isCorrect = answer.is_correct === 'y' || answer.is_correct === 'true';

                    if (isCorrect) {
                        toastr.success('Awesome - correct! Moving on...');
                        scope.order += 1;
                        scope.showActionFormFlag = false;
                        scope.showSolutionFlag = false;
                    }
                    else {
                        toastr.error('That was the wrong answer');
                        scope.total_wrong += 1;
                        scope.showActionFormFlag = true;
                        scope.setCorrectAnswers();
                        scope.showSolutionFlag = true;
                        if(scope.total_wrong > scope.total_quizzes*0.1){
                            toastr.error('Sorry! You cannot pass this lesson');
                            $state.go('failed_lesson');
                            $rootScope.lesson_id = $stateParams.lessonId;
                        }
                    }

                };

                scope.checkIfFillInCorrect = function () {
                    var isCorrect = false;
                    angular.forEach(scope.current_video.answers, function (answer) {
                        if (answer.description === scope.current_video.answer) {
                            isCorrect = true;
                            return;
                        }
                    });
                    if (isCorrect) {
                        toastr.success('Awesome - correct! Moving on...');
                        scope.order += 1 ;
                        scope.showActionFormFlag = false;
                        scope.showSolutionFlag = false;
                    }
                    else {
                        toastr.error('That was the wrong answer');
                        scope.showActionFormFlag = true;
                        scope.total_wrong += 1;                        
                        scope.setCorrectAnswers();
                        scope.showSolutionFlag = true;
                        if(scope.total_wrong > scope.total_quizzes*0.1){
                            toastr.error('Sorry! You cannot pass this lesson');
                            $location.path('failed_lesson');
                            $rootScope.lesson_id = $stateParams.lessonId;
                        }
                    }
                };


                jQuery(window).joyride("destroy");
                jQuery('#lessonMasteryPopup').joyride({
                    autoStart: true,
                    postStepCallback: function (index, tip) {
                        //if (index == 0) {
                        //    console.log(tip);
                        //}
                    },
                    modal: true,
                    expose: true
                });

            }

        };

    }
]);
angular.module('core').directive('showVideo', [
    function () {
        return {
            restrict: 'A',
            scope: {
                link: '=link'
            },
            link: function (scope, element, attrs) {
                function adjustVideoWidthAndHeight() {
                    var widthOfSurroundingDiv = jQuery(element).width();         // gett width of DIV surrounding the div
                    jQuery(element).find('iframe').width(widthOfSurroundingDiv - 1);     // set the video width to surrounding DIV

                    var theHeight = jQuery(element).find('iframe').width() * 0.5633; // get hight of video
                    var finalHeight = 'height:' + theHeight;

                    jQuery(element).find('iframe').height(theHeight);                //set width of video to 56% of
                }

                jQuery(window).resize(function () {
                    adjustVideoWidthAndHeight();
                });
                adjustVideoWidthAndHeight();

            }

        };

    }
]);

angular.module('core').directive('ngExp', [
    function () {
        return {
            restrict: 'A',
            link: function (scope, elm, attrs) {

                jQuery(elm).payment('formatCardExpiry');
            }

        };

    }
]);
