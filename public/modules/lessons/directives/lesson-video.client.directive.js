'use strict';
/*global jQuery:false */
/*global toastr:false */
/*global vzPlayer:false */

/**
 * icheck - Directive for custom checkbox icheck
 */
function icheck($timeout, lodash) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function ($scope, element, $attrs, ngModel) {
            return $timeout(function () {
                var value;
                value = $attrs.value;

                $scope.$watch($attrs.ngModel, function (newValue) {
                    if (value === newValue + '') {
                        jQuery(element).attr('checked', 'checked');
                    }

                    jQuery(element).iCheck('update');
                });

                return jQuery(element).iCheck({
                    checkboxClass: 'icheckbox_square-green',
                    radioClass: 'iradio_square-green'

                }).on('ifChanged', function (event) {
                    if (jQuery(element).attr('type') === 'checkbox' && $attrs.ngModel) {
                        $scope.$apply(function () {
                            return ngModel.$setViewValue(event.target.checked);
                        });
                    }
                    if (jQuery(element).attr('type') === 'radio' && $attrs.ngModel) {
                        return $scope.$apply(function () {
                            return ngModel.$setViewValue(value);
                        });
                    }
                });
            });
        }
    };
}
angular.module('lessons').directive('preventChar', function () {
    return {
        restrict: 'A',
        link: function (scope, elm, attrs) {
            var preventKeys = [92, 124, 123, 125, 94, 93, 125, 123, 95, 39, 41, 91, 42, 60, 63, 47, 60, 62, 64, 62, 60, 58, 62, 43, 59, 44, 58, 47, 46, 40, 39, 38, 37, 36, 35, 34, 33, 32];
            jQuery(elm).on('keypress', function(e){
                if(preventKeys.indexOf(e.keyCode) !== -1)
                return false;
            });
        }
    };
});

angular.module('lessons').directive('lessonVideo', ['$sce', '$timeout', '$location', '$stateParams', 'Cores', 'Quizreports', 'QuizAnswers', 'lodash',
    function ($sce, $timeout, $location, $stateParams, Cores, Quizreports, QuizAnswers, lodash) {
        return {
            templateUrl: 'modules/lessons/views/lesson_video.html',
            restrict: 'EA',
            scope: {
                embedcode: '=embedcode', //Two-way data binding
                video: '=video',
                videos: '=videos'
            },
            link: function postLink(scope, element, attrs) {
                // Lession video directive logic
                var player = null;
                function sortArray(data){
                    var array = [];
                    for(var objectKey in data) {
                        array.push(data[objectKey]);
                    }

                    array.sort(function(a, b){
                        a = parseInt(a.order);
                        b = parseInt(b.order);
                        return a - b;
                    });
                    return array;
                }
                scope.videos = sortArray(scope.videos);
                scope.showVideoFlag = true;

                function finished_watching_video() {
                    Cores.setViewedVideo(scope.video._id, function (res) {
                    });
                    scope.goToQuiz();
                }

                //
                function updateStatus(state) {
                    if (state === 'mediaEnded') {
                        finished_watching_video();
                    }
                }

                // script to fix width of video to adjust to width of screen
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

                scope.goToQuiz = function () {
                    player.pause();
                    scope.showVideoFlag = false;
                    scope.showQuiz = true;
                };

                scope.goToNextVideo = function (video) {
                    scope.videos = lodash.sortByOrder(scope.videos, ['order'], ['asc']);
                    var current_video = scope.videos[scope.video.order];
            
                    if (typeof current_video !== 'undefined') {
                        scope.video = current_video;
                        $location.path('lessons/' + $stateParams.lessonId + '/video/' + scope.video._id);
                        scope.showVideoFlag = true;
                        scope.showQuiz = false;
                        setUpPlayer();
                    }
                    else {
//                        toastr.error('Sorry! This is the last video of this lesson');
                        $location.path('lesson_mastery/' + $stateParams.lessonId );
                    }
                };

                scope.checkIsCorrectAnswer = function (answer) {
//                    console.log('answer', answer);
                    var isCorrect = answer.is_correct === 'y' || answer.is_correct === 'true' ;

                    if (isCorrect) {
                        toastr.success('Awesome - correct! Moving on...');
                        var current_video = scope.videos[scope.video.order];
                        $timeout(function () {
                            if (typeof current_video !== 'undefined') {
                                scope.video = current_video;
                                $location.path('lessons/' + $stateParams.lessonId + '/video/' + scope.video._id);
                                scope.showVideoFlag = true;
                                scope.showQuiz = false;
                                scope.showSolutionFlag = false;
                                setUpPlayer();
                            }
                            else {
//                                toastr.error('Sorry! This is the last video of this lesson');
                                $location.path('lesson_mastery/' + $stateParams.lessonId );
                            }
                        }, 2000);


                    }
                    else {
                        toastr.error('That was the wrong answer');
                        scope.showActionFormFlag = true;
                        scope.setCorrectAnswers();
                        scope.showSolutionFlag = true;
                    }

                };

                scope.setCorrectAnswers = function () {
                    angular.forEach(scope.video.quiz.answers, function (answer) {
//                        console.log(answer.description);
                        scope.video.solution = answer.description;
                        if (answer.is_correct === 'y' || answer.is_correct === 'true' ) {
                            answer.correct_answer = true;
                        }
                    });
                };

                scope.getSolution = function () {
                    angular.forEach(scope.video.quiz.answers, function (answer) {
                        scope.video.solution = answer.description;
                        return scope.video.solution;
                    });
                };

                scope.checkIfFillInCorrect = function () {
                    var isCorrect = false;
//                    console.log('fill in answr', scope.video);
                    angular.forEach(scope.video.quiz.answers, function (answer) {
                        if (answer.description === scope.video.quiz.answer) {
                            isCorrect = true;
                            return;
                        }
                    });
                    if (isCorrect) {
                        toastr.success('Awesome - correct! Moving on...');

                        var current_video = scope.videos[scope.video.order];
                        $timeout(function () {
                                if (typeof current_video !== 'undefined') {
                                    scope.video = current_video;
                                    $location.path('lessons/' + $stateParams.lessonId + '/video/' + scope.video._id);
                                    scope.showVideoFlag = true;
                                    scope.showQuiz = false;
                                    scope.showSolutionFlag = false;
                                    setUpPlayer();
                                }
                                else {
                                    $location.path('lesson_mastery/' + $stateParams.lessonId );
                                }

                            },
                            2000);
                    }
                    else {
                        toastr.error('That was the wrong answer');
                        scope.showActionFormFlag = true;
                        scope.setCorrectAnswers();
                        scope.showSolutionFlag = true;
                    }
                };

                scope.showHint = function () {
                    scope.showHintFlag = !scope.showHintFlag;
                };

                scope.showSolution = function () {
                    scope.showSolutionFlag = !scope.showSolutionFlag;
                };

                scope.showVideo = function () {
                    scope.showVideoFlag = !scope.showVideoFlag;
                };

                scope.saveReport = function (quiz) {
                    var report = new Quizreports({description: quiz.report_text, quiz: quiz._id});
                    report.$save(function (res) {
                        if (!res.message) {
                            toastr.success('We have saved your report.');
                            scope.showActionFormFlag = false;
                        }
                        else {
                            toastr.error(res.message);
                        }
                    });
//                    console.log(quiz);
                };

                scope.saveAnswer = function (quiz) {
                    var answer = new QuizAnswers({description: quiz.user_answer, quiz: quiz._id});
                    answer.$save(function (res) {
                        if (!res.message) {
                            toastr.success('We have saved your answer.');
                            scope.showActionFormFlag = false;
                        }
                        else {
                            toastr.error(res.message);
                        }

                    });
//                    console.log(quiz);
                };

                scope.showAnswerForm = function () {
                    scope.showAnswerFlag = true;
                    scope.showReportFlag = false;
                };

                scope.showReportForm = function () {
                    scope.showAnswerFlag = false;
                    scope.showReportFlag = true;
                };

                var checkIframe = setInterval(function () {
                    if (jQuery(element).find('iframe').length > 0) {
                        setUpPlayer();
                        adjustVideoWidthAndHeight();
                        clearInterval(checkIframe);
                    }
                }, 200);


                function setUpPlayer() {
                    var src = jQuery(element).find('iframe').attr('src');
                    if (src && src.indexOf('apiOn=true') === -1) {
                        jQuery(element).find('iframe').attr('src', src + '?apiOn=true');
                    }
                    if (angular.isDefined(src) ) {
                        var res = src.split('/');
                        player = new vzPlayer('vzvd-' + res[3]);


                        player.ready(function () {
                            player.addEventListener('playState', function (state) {
                                updateStatus(state);
                            });
                        });

                        adjustVideoWidthAndHeight();
                    }



                }
            }
        };
    }
]).directive('icheck', icheck);
