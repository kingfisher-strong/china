'use strict';
/*global public_url:false */
/*global toastr:false */
/*global jQuery:false */
// Lessons controller
angular.module('lessons').controller('LessonsController', ['$scope', '$stateParams', '$rootScope', '$location', 'Authentication', 'Lessons', 'Upload', 'Levels', '$timeout', '$injector', 'Videos', 'Quizzes', 'QuizAnswers', '$sce', '$anchorScroll', 'lodash',
    function($scope, $stateParams, $rootScope, $location, Authentication, Lessons, Upload, Levels, $timeout, $injector, Videos, Quizzes, QuizAnswers, $sce, $anchorScroll, lodash) {
        // Injector
        var $validationProvider = $injector.get('$validation');
        $scope.videos = [];
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

        $scope.authentication = Authentication;
        $scope.fileReaderSupported = window.FileReader !== null;
        $scope.current_levels = Levels.query();
        $scope.public_url = public_url;

        $scope.setLevel = function(current_level, level_id){
            if (current_level) {
                return current_level._id === level_id;
            }
            return false;

        };

        $scope.isAdmin = function(){
            if($scope.authentication.user.roles.indexOf('admin') === -1){
                $location.path('index');
            }
        };

        $scope.isChecked = function(value){
            return value === true;

        };

        $scope.addVideo = function(){
            $scope.lesson.videos.push({
                order: $scope.video_number,
                name: '',
                embed_code: '',
                lesson: $stateParams.lessonId,
                quiz: {_id: null, name:'', type:'multiple_options', answers:[
                    {description: '', is_correct: 'n', quiz: null},
                    {description: '', is_correct: 'n', quiz: null},
                    {description: '', is_correct: 'n', quiz: null},
                    {description: '', is_correct: 'n', quiz: null}] }

            });

            angular.forEach($scope.quizzesForm.$error.required, function(field) {
                field.$setDirty();
            });
        };

        $scope.addAnswerOption = function(video){
            video.quiz.answers.push({description: '', is_correct: 'n', quiz: null});
        };

        $scope.addMultipleAnswersOption = function(video){
            if (!angular.isDefined(video.quiz.answers)) {
                video.quiz.answers = [];
            }   
            video.quiz.answers.push({description: '', is_correct: 'n', quiz: null});
            console.log( video.quiz);
        };

        $scope.resetOptions = function(video){
            video.quiz = {name:'', type:'', video:null, answers:[{description: '', is_correct: 'n', quiz:null}] };
        };

        $scope.saveVideoAndQuiz = function(){

            angular.forEach($scope.lesson.videos, function(video){
                if( angular.isUndefined(video._id) ){
                    console.log('create video ' + video.name, video.order);
                    var new_video = new Videos({
                        name: video.name,
                        order: video.order,
                        embed_code: video.embed_code,
                        lesson: video.lesson
                    });

                    new_video.$save(function(response) {
                        var new_quiz = new Quizzes({
                            name: video.quiz.name,
                            order: video.quiz.order,
                            type: video.quiz.type,
                            answers: video.quiz.answers,
                            video: response._id
                        });

                        video._id = response._id;

                        new_quiz.$save(function(response) {
                            console.log('Saved Quiz', response);
                            video.quiz._id = response._id;
                            toastr.success('Saved Quiz');

                        }, function(errorResponse) {
                            toastr.error(errorResponse.data.message);
                        });

                    }, function(errorResponse) {
                        toastr.error(errorResponse.data.message);
                    });
                }
                else {
                    var old_video = new Videos(video);
                    old_video.$update(function(response){
                        console.log('updated video', response, video.order);
                        toastr.success('Updated Videos and quizzes');
                    }, function(errorResponse) {
//                        toastr.error(errorResponse.data.message);
                    });

                    if( angular.isDefined(video.quiz) && !angular.isDefined(video.quiz._id)){
                        console.log('video.quiz', video.quiz);
                        var quiz = video.quiz;
                        var new_quiz = new Quizzes({
                            name: quiz.name,
                            order: quiz.order,
                            type: quiz.type,
                            answers: quiz.answers,
                            video: video._id
                        });

                        new_quiz.$save(function(response) {
                            video.quiz._id = response._id;
                            console.log('New quiz', response);
                            toastr.success('Saved Quiz');
                        }, function(errorResponse) {
//                            toastr.error(errorResponse.data.message);
                        });
                    } else {
                        var old_quiz = new Quizzes(video.quiz);
                        old_quiz.$update(function(response){
                            console.log('Updated quiz', response);
                            toastr.success('Updated Videos and quizzes');
                        }, function(errorResponse) {
//                            toastr.error(errorResponse.data.message);
                        });
                    }
                }
            });

        };

        $scope.removeVideo = function(video, index){
            console.log($scope.lesson.videos, index);
            var c = confirm('Are you sure to delete this video?');
            if ( c === true ) {
                if( angular.isDefined(video) && angular.isDefined(video._id) ) {
                    var current_video = new Videos(video);
                    current_video.$remove(function () {
                        console.log('removed', video._id);
                        $scope.lesson.videos.splice(index, 1);
                    });
                } else {
                    $scope.lesson.videos.splice(index, 1);
                }
            }
        };

        $scope.removeAnswer = function(answers, event, index){
            answers.splice(index, 1);
            jQuery(event.target).closest('.answer_option').remove();
        };

        $scope.removeFillInAnswer = function(answers, index){
            answers.splice(index, 1);
        };

        // Create new Lesson
        $scope.create = function() {
            // Create new Lesson object
            var level_id = null;
            if( this.level !== '' && typeof this.level !== 'undefined'){
                level_id = this.level._id;
            }
            var lesson = new Lessons ({
                name: this.name,
                level: level_id,
                order: this.order,
                story_time: this.story_time,
                pdf_file: null
            });




             //Redirect after save
            lesson.$save(function(response) {
                if ($scope.mp3) {
                    $scope.uploadMP3($scope.mp3, response._id);
                }
                if ($scope.thumbnail) {
                    $scope.uploadThumbnail($scope.thumbnail, response._id);
                }
                if ($scope.pdf_file) {
                    $scope.upload($scope.pdf_file, response._id);
                }
                else {
                    toastr.success('A lesson has been created');
                    $timeout(function() {
                        // Clear form fields
                        $scope.name = '';
                        $scope.level = '';
                        $scope.order = '';
                        $scope.story_time = '';
                        $location.path('lessons/' + response._id);
                    }, 2000);

                }
            }, function(errorResponse) {
                toastr.error(errorResponse.data.message);
            });
        };

        $scope.upload = function (file, lesson_id, lesson) {
            Upload.upload({
                url: 'lessons/' + lesson_id + '/pdf_file',
                fields: {
                    lesson: lesson
                },
                headers: {'Content-Type': 'multipart/form-data'},
                file: file
            }).progress(function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            }).success(function (data, status, headers, config) {
                //$location.path('lessons/' + lesson_id);
            }).error(function (data, status, headers, config) {
                console.log('error status: ', status);
                console.log('error: ', data);
                if(status === 400){
                    toastr.error(data.message);
                }

            });
        };

        $scope.uploadThumbnail = function (file, lesson_id, lesson) {
            Upload.upload({
                url: 'lessons/' + lesson_id + '/upload_thumbnail',
                fields: {
                    lesson: lesson
                },
                headers: {'Content-Type': 'multipart/form-data'},
                file: file
            }).progress(function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            }).success(function (data, status, headers, config) {
                //$location.path('lessons/' + lesson_id);
            }).error(function (data, status, headers, config) {
                console.log('error status: ',  status);
                console.log('error: ', data);
                if(status === 400){
                    toastr.error(data.message);
                }
            });
        };

        $scope.uploadMP3 = function (file, lesson_id, lesson) {
            Upload.upload({
                url: 'lessons/' + lesson_id + '/upload_mp3',
                fields: {
                    lesson: lesson
                },
                headers: {'Content-Type': 'multipart/form-data'},
                file: file
            }).progress(function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            }).success(function (data, status, headers, config) {
                //$location.path('lessons/' + lesson_id);
            }).error(function (data, status, headers, config) {
                console.log('error status: ',  status);
                console.log('error: ', data);
                if(status === 400){
                    toastr.error(data.message);
                }
            });
        };


        // Remove existing Lesson
        $scope.remove = function(lesson) {
            if ( lesson ) {
                lesson.$remove();

                for (var i in $scope.lessons) {
                    if ($scope.lessons [i] === lesson) {
                        $scope.lessons.splice(i, 1);
                    }
                }
            } else {
                $scope.lesson.$remove(function() {
                    $location.path('lessons');
                });
            }
        };

        // Update existing Lesson
        $scope.update = function() {
            var lesson = $scope.lesson;
            if ($scope.pdf_file) {
                console.log($scope.pdf_file);

                $scope.upload($scope.pdf_file, lesson._id, lesson);
            }

            if ($scope.mp3) {
                console.log($scope.mp3);

                $scope.upload($scope.mp3, lesson._id, lesson);
            }

            if ($scope.thumbnail) {
                console.log($scope.thumbnail);

                $scope.uploadThumbnail($scope.thumbnail, lesson._id, lesson);
            }

            lesson.$update(function() {
                toastr.success('The lesson has been updated.');
                $timeout(function() {
                    $location.path('lessons/' + lesson._id);
                }, 2000);
            }, function(errorResponse) {
                toastr.error(errorResponse.data.message);
            });



        };

        $scope.showVideo = function(video){
            $location.path('lessons/' + $stateParams.lessonId + '/video/' + video._id);
        };

        $scope.totalItems = 10;
        // Find a list of Lessons
        $scope.find = function() {
            $scope.lessons = Lessons.query();
        };

        // pagination controls
        $scope.currentPage = 1;
        $scope.entryLimit = 10; // items per page
        $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);

        if (angular.isDefined($scope.quizzesForm)) {
            angular.forEach($scope.quizzesForm.$error.required, function(field) {
                field.$setDirty();
            });
        }
		

		$scope.addAnswerOption = function(video){
			video.quiz.answers.push({description: '', is_correct: 'n', quiz: null});
		};

        $scope.addMultipleAnswersOption = function(answers){
            answers.push({description: '', is_correct: 'n', quiz: null});
		};

		$scope.resetOptions = function(video){
			video.quiz = {_id: null, name:'', type:'', video:null, answers:[{_id: null, description: '', is_correct: 'n', quiz:null}] };
		};

		$scope.saveVideoAndQuiz = function(){
			angular.forEach($scope.lesson.videos, function(video){
				console.log('video ' + video.name, video.order, video._id);
				if(!angular.isDefined(video._id)){
					console.log('create video ' + video.name, video.order);
					var new_video = new Videos({
						name: video.name,
						order: video.order,
						embed_code: video.embed_code,
						lesson: video.lesson
					});

					new_video.$save(function(response) {
						var new_quiz = new Quizzes({
							name: video.quiz.name,
							order: video.quiz.order,
							type: video.quiz.type,
							answers: video.quiz.answers,
							video: response._id
						});

						video._id = response._id;

						new_quiz.$save(function(response) {
							console.log(response);
							video.quiz._id = response._id;
							toastr.success('Saved Quiz');

						}, function(errorResponse) {
							toastr.error(errorResponse.data.message);
						});

					}, function(errorResponse) {
						toastr.error(errorResponse.data.message);
					});
				}
				else {
					var old_video = new Videos(video);
					old_video.$update(function(response){
						console.log(response);
						toastr.success('Updated Videos and quizzes');
					}, function(errorResponse) {
						toastr.error(errorResponse.data.message);
					});

					if( angular.isDefined(video.quiz) && !angular.isDefined(video.quiz._id)){
						var new_quiz = new Quizzes({
							name: video.quiz.name,
							order: video.quiz.order,
							type: video.quiz.type,
							answers: video.quiz.answers,
							video: video._id
						});

						new_quiz.$save(function(response) {
							video.quiz._id = response._id;
							toastr.success('Saved Quiz');
						}, function(errorResponse) {
							toastr.error(errorResponse.data.message);
						});
					}
					else {
						var old_quiz = new Quizzes(video.quiz);
						old_quiz.$update(function(response){
							console.log(response);
							toastr.success('Updated Videos and quizzes');
						}, function(errorResponse) {
							toastr.error(errorResponse.data.message);
						});
					}
				}
			});

		};

		$scope.removeVideo = function(video, index){
			console.log($scope.lesson.videos, index);
			if(typeof video !== 'undefined' && video._id !== null) {
				var current_video = new Videos(video);
				current_video.$remove(function () {
					console.log('removed');
					$scope.lesson.videos.splice(index, 1);
				});
			}
			else {
				$scope.lesson.videos.splice(index, 1);
			}


		};

		$scope.removeAnswer = function(answers, event, index){
			answers.splice(index, 1);
			jQuery(event.target).closest('.answer_option').remove();
		};

		$scope.removeFillInAnswer = function(answers, index){
			answers.splice(index, 1);
		};

		// Create new Lesson
		$scope.create = function() {
			// Create new Lesson object
			var level_id = null;
			if( this.level !== '' && typeof this.level !== 'undefined'){
				level_id = this.level._id;
			}
			var lesson = new Lessons ({
				name: this.name,
				level: level_id,
				order: this.order,
				story_time: this.story_time,
				pdf_file: null
			});




			 //Redirect after save
			lesson.$save(function(response) {
				if ($scope.mp3) {
					$scope.uploadMP3($scope.mp3, response._id);
				}
				if ($scope.thumbnail) {
					$scope.uploadThumbnail($scope.thumbnail, response._id);
				}
				if ($scope.pdf_file) {
					$scope.upload($scope.pdf_file, response._id);
				}
				else {
					toastr.success('A lesson has been created');
					$timeout(function() {
						// Clear form fields
						$scope.name = '';
						$scope.level = '';
						$scope.order = '';
						$scope.story_time = '';
				        $location.path('lessons/' + response._id);
				    }, 2000);

				}
			}, function(errorResponse) {
				toastr.error(errorResponse.data.message);
			});
		};

		$scope.upload = function (file, lesson_id, lesson) {
			Upload.upload({
				url: 'lessons/' + lesson_id + '/pdf_file',
				fields: {
					lesson: lesson
				},
				headers: {'Content-Type': 'multipart/form-data'},
				file: file
			}).progress(function (evt) {
				var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
			}).success(function (data, status, headers, config) {
				//$location.path('lessons/' + lesson_id);
			}).error(function (data, status, headers, config) {
				console.log('error status: ', status);
				console.log('error: ', data);
				if(status === 400){
					toastr.error(data.message);
				}

			});
		};

		$scope.uploadThumbnail = function (file, lesson_id, lesson) {
			Upload.upload({
				url: 'lessons/' + lesson_id + '/upload_thumbnail',
				fields: {
					lesson: lesson
				},
				headers: {'Content-Type': 'multipart/form-data'},
				file: file
			}).progress(function (evt) {
				var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
			}).success(function (data, status, headers, config) {
				//$location.path('lessons/' + lesson_id);
			}).error(function (data, status, headers, config) {
				console.log('error status: ',  status);
				console.log('error: ', data);
				if(status === 400){
					toastr.error(data.message);
				}
			});
		};

		$scope.uploadMP3 = function (file, lesson_id, lesson) {
			Upload.upload({
				url: 'lessons/' + lesson_id + '/upload_mp3',
				fields: {
					lesson: lesson
				},
				headers: {'Content-Type': 'multipart/form-data'},
				file: file
			}).progress(function (evt) {
				var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
			}).success(function (data, status, headers, config) {
				//$location.path('lessons/' + lesson_id);
			}).error(function (data, status, headers, config) {
				console.log('error status: ',  status);
				console.log('error: ', data);
				if(status === 400){
					toastr.error(data.message);
				}
			});
		};


		// Remove existing Lesson
		$scope.remove = function(lesson) {
			if ( lesson ) {
				lesson.$remove();

				for (var i in $scope.lessons) {
					if ($scope.lessons [i] === lesson) {
						$scope.lessons.splice(i, 1);
					}
				}
			} else {
				$scope.lesson.$remove(function() {
					$location.path('lessons');
				});
			}
		};

		// Update existing Lesson
		$scope.update = function() {
			var lesson = $scope.lesson;
			if ($scope.pdf_file) {
				console.log($scope.pdf_file);

				$scope.upload($scope.pdf_file, lesson._id, lesson);
			}

			if ($scope.mp3) {
				console.log($scope.mp3);

				$scope.upload($scope.mp3, lesson._id, lesson);
			}

			if ($scope.thumbnail) {
				console.log($scope.thumbnail);

				$scope.uploadThumbnail($scope.thumbnail, lesson._id, lesson);
			}

			lesson.$update(function() {
				toastr.success('The lesson has been updated.');
				$timeout(function() {
					$location.path('lessons/' + lesson._id);
				}, 2000);
			}, function(errorResponse) {
				toastr.error(errorResponse.data.message);
			});



		};

		$scope.showVideo = function(video){
			$location.path('lessons/' + $stateParams.lessonId + '/video/' + video._id);
		};

		$scope.totalItems = 10;
		// Find a list of Lessons
		$scope.find = function() {
			$scope.lessons = Lessons.query();
		};


        $scope.proveLessonMastery = function(lessonId){
            $location.path('lesson_mastery/' + lessonId );
        };

        // Find existing Lesson
        $scope.findOne = function() {
            $scope.lesson = Lessons.get({
                lessonId: $stateParams.lessonId
            }, function(data){
                var hash = $location.url().split('scrollTo=');
                data.videos = lodash.sortByOrder(data.videos, ['order'], ['asc']);

                if(hash.length === 2){
                    $location.hash(hash[1]);
                }

                var video_ids = [];

                angular.forEach(sortArray(data.videos), function(video){
                    video_ids.push(video._id);
                    // Quizzes.get({videoID: video._id}, function(data){
                    // 	video.quiz = data;
                    // });
                });

                Quizzes.query({videoIDs: video_ids.join(',')}, function(quizzes){
                    angular.forEach(data.videos, function(video){
                        angular.forEach(quizzes, function(quiz){
                            var found = false;
                            if(quiz.video === video._id && !found){
                                video.quiz = quiz;
                                found = true;
                            }
                        });

                    });
                });


                if(!$stateParams.videoId){
                    angular.forEach(data.videos, function(video){
                        if(video.order === 1){
                            $scope.currentVideo = video;
                            $rootScope.title = video.name;
                            return;
                        }

                    });

                }
                else {
                    var found = false;
                    angular.forEach(data.videos, function(video){
                        if(video._id === $stateParams.videoId && !found){
                            $scope.currentVideo = video;
                            $rootScope.title = video.name;
                            found = true;
                            return;
                        }

                    });
                }

            });



        };
    }
]);
