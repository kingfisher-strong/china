'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Lesson = mongoose.model('Lesson'),
    Video = mongoose.model('Video'),
    Quiz = mongoose.model('Quiz'),
    Level = mongoose.model('Level'),
    QuizAnswer = mongoose.model('QuizAnswer'),

    _ = require('lodash');

var uuid = require('node-uuid'),
    fs = require('fs'),
    path = require('path');

var im = require('imagemagick');

/**
 * Create a Lesson
 */
exports.create = function (req, res) {
    var lesson = new Lesson(req.body);
    lesson.user = req.user;

    lesson.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(lesson);
        }
    });
};

/**
 * Upload a MP3
 */
exports.upload_mp3 = function (req, res) {
    var file = req.files.file;

    var tmpPath = file.path;
    var extIndex = tmpPath.lastIndexOf('.');
    var extension = (extIndex < 0) ? '' : tmpPath.substr(extIndex);
    var fileName = uuid.v4() + extension;
    var destPath = './public/uploads/' + fileName;

    //var lesson_data = JSON.parse(req.body.lesson);
    var lesson = req.lesson;

    lesson = _.extend(lesson, req.body);


    console.log('>>>>>');
    console.log('__dirname', __dirname);
    console.log('tmpPath', tmpPath);
    console.log('destPath', destPath);

    //return res.status(200).send({
    //	message: 'uploaded'
    //});

    fs.readFile(tmpPath, function (err, original_data) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        fs.writeFile(destPath, original_data, function (err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            }

            fs.unlink(tmpPath, function (err) {
                if (err) {
                    console.log('failed to delete ' + file.path);
                }
                else {
                    console.log('successfully deleted ' + file.path);
                }
            });

            if (lesson.mp3 !== null) {
                fs.unlink('./public/uploads/' + lesson.mp3, function (err) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log('successfully deleted ' + lesson.mp3);
                    }
                });
            }


            lesson.mp3 = fileName;

            lesson.save(function (err) {


                if (err) {

                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(lesson);
                }
            });

        });

    });

};
/**
 * Upload a PDF
 */
exports.upload_pdf = function (req, res) {
    var file = req.files.file;

    var tmpPath = file.path;
    var extIndex = tmpPath.lastIndexOf('.');
    var extension = (extIndex < 0) ? '' : tmpPath.substr(extIndex);
    var fileName = uuid.v4() + extension;
    var destPath = './public/uploads/' + fileName;

    //var lesson_data = JSON.parse(req.body.lesson);
    var lesson = req.lesson;

    lesson = _.extend(lesson, req.body);


    console.log('>>>>>');
    console.log('__dirname', __dirname);
    console.log('tmpPath', tmpPath);
    console.log('destPath', destPath);

    //return res.status(200).send({
    //	message: 'uploaded'
    //});

    fs.readFile(tmpPath, function (err, original_data) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        fs.writeFile(destPath, original_data, function (err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            }

            fs.unlink(tmpPath, function (err) {
                if (err) {
                    console.log('failed to delete ' + file.path);
                }
                else {
                    console.log('successfully deleted ' + file.path);
                }
            });

            if (lesson.pdf_file !== null) {
                fs.unlink('./public/uploads/' + lesson.pdf_file, function (err) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log('successfully deleted ' + lesson.pdf_file);
                    }
                });
            }


            lesson.pdf_file = fileName;

            lesson.save(function (err) {


                if (err) {

                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(lesson);
                }
            });

        });

    });

};

/**
 * Upload a thumbnail
 */
exports.upload_thumbnail = function (req, res) {
    var file = req.files.file;
    console.log(file);
    var tmpPath = file.path;
    var extIndex = tmpPath.lastIndexOf('.');
    var extension = (extIndex < 0) ? '' : tmpPath.substr(extIndex);
    var fileName = uuid.v4() + extension;
    var destPath = './public/uploads/fullsize/' + fileName;
    var thumbPath = './public/uploads/thumbs/' + fileName;
    var lesson = req.lesson;

    lesson = _.extend(lesson, req.body);

    fs.readFile(tmpPath, function (err, original_data) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        fs.writeFile(destPath, original_data, function (err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            }

            // write file to uploads/thumbs folder
            im.resize({
                srcPath: destPath,
                dstPath: thumbPath,
                width: 200
            }, function (err, stdout, stderr) {
                if (err) throw err;
                console.log('resized image to fit within 200x200px');
            });


            fs.unlink(tmpPath, function (err) {
                if (err) {
                    console.log('failed to delete ' + file.path);
                }
                else {
                    console.log('successfully deleted ' + file.path);
                }
            });

            if (lesson.thumbnail !== null) {
                fs.unlink('./public/uploads/fullsize/' + lesson.thumbnail, function (err) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log('successfully deleted ' + lesson.thumbnail);
                    }
                });

                fs.unlink('./public/uploads/thumbs/' + lesson.thumbnail, function (err) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log('successfully deleted ' + lesson.thumbnail);
                    }
                });
            }


            lesson.thumbnail = fileName;

            lesson.save(function (err) {


                if (err) {

                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(lesson);
                }
            });

        });

    });

};
/**
 * Show the current Lesson
 */
exports.read = function (req, res) {
    res.jsonp(req.lesson);
};

/**
 * Update a Lesson
 */
exports.update = function (req, res) {
    var lesson = req.lesson;

    lesson = _.extend(lesson, req.body);

    lesson.save(function (err) {

        if (err) {
            console.log(err);
            return res.status(400).send({
                message: err.errors
            });
        } else {
            res.jsonp(lesson);
        }
    });
};

/**
 * Delete an Lesson
 */
exports.delete = function (req, res) {
    var lesson = req.lesson;

    lesson.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(lesson);
        }
    });
};

/**
 * List of Lessons
 */
exports.list = function (req, res) {
    var user = req.user;
    if (user) {


        if (req.query.level) {
            Level.findOne({'order': req.query.level}).exec(function (err, level) {
                if(!err && level !== null){
                    Lesson.find({'level': level._id}).sort('order').populate('user', 'displayName').exec(function (err, lessons) {
                        if (err) {
                            return res.status(400).send({
                                message: errorHandler.getErrorMessage(err)
                            });
                        } else {
                            res.jsonp(lessons);
                        }
                    });
                }
                else {
                    return res.status(400).send({
                                message: 'No records found'
                            });
                }
                
            });
        }
        else {
            Lesson.find().sort('-created').populate('user', 'displayName').exec(function (err, lessons) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(lessons);
                }
            });
        }
    }
    else {
        res.jsonp([]);
    }
};

/**
 * Lesson middleware
 */
exports.lessonByID = function (req, res, next, id) {
    Lesson.findById(id)
        .populate('user', 'displayName')
        .populate('level', 'name').exec(function (err, lesson) {


            if (err) return next(err);
            if (!lesson) return next(new Error('Failed to load Lesson ' + id));

            Video.find({lesson: lesson._id}).exec(function (err, videos) {
                //var all_videos = [];
                //for(var i=0; i< videos.length; i++){
                //	var video = videos[0];
                //	Quiz.findOne({video: video._id}).exec(function(err, quiz) {
                //
                //		video.quiz = quiz;
                //		all_videos.push(video);
                //		lesson.videos = all_videos;
                //		req.lesson = lesson ;
                //	});
                //}


                lesson.videos = videos;
                req.lesson = lesson;
                next();

            });


        });
};

/**
 * Lesson authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.lesson.user.id !== req.user.id && req.user.roles.indexOf('admin') === -1) {
        return res.status(403).send('User is not authorized');
    }
    next();
};
