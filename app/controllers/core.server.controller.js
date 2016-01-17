'use strict';
var errorHandler = require('./errors.server.controller'),
    mongoose = require('mongoose'),
    Lesson = mongoose.model('Lesson'),
    Video = mongoose.model('Video'),
    Quiz = mongoose.model('Quiz'),
    Level = mongoose.model('Level'),
    util = require('util'),
    _ = require('lodash');

var braintree = require('braintree');

var gateway = braintree.connect({
    environment: braintree.Environment.Production,
    merchantId: 'drjwxyxnrcx54kss',
    publicKey: '74hrhwmbk5yq5x64',
    privateKey: 'd5e9a203fa8200499f59d995dcc37ad6'
});

// var gateway = braintree.connect({
//     environment: braintree.Environment.Sandbox,
//     merchantId: 'gy77s8sjyvmqtccz',
//     publicKey: 'dqk6f2kgz4kpsjhj',
//     privateKey: 'fa131a7cccbb04df4c452653ebbc5e54'
// });

/**
 * Module dependencies.
 */
exports.index = function (req, res) {
    if (req.session.current_level === '' || /\D/.test(req.session.current_level)) {
        req.session.current_level = 1;
    }

    res.render('index', {
        user: req.user || null,
        request: req,
        session: req.session
    });
};

exports.client_token = function (req, res) {

    gateway.clientToken.generate({}, function (err, response) {
        var token = response.clientToken;
        res.status(200).send(token);
        //var plans = gateway.plan.all(function(err, result) {
        //	//res.render('index', { token : token, plans: result.plans });
        //
        //});

    });
};

exports.checkout = function (req, res) {
    var nonceFromTheClient = req.body.payment_method_nonce;
    var plan = req.body.plan;
    var user = req.user;
    delete req.body.roles;
    // console.log(req);
    if (user && plan) {
        // Merge existing user
        user = _.extend(user, req.body);

        if (user.payment_method_token !== null && user.payment_method_token !== undefined && user.payment_method_token !== '') {

            if (user.subscription_id) {
                console.log('========Existing Customer');

                gateway.subscription.cancel(user.subscription_id, function (err, result) {

                });

                gateway.subscription.create({
                    paymentMethodToken: user.payment_method_token,
                    planId: plan
                }, function (err, result) {
                    if (!err && !util.isUndefined(result.subscription) && result.success) {
                        user.subscription_id = result.subscription.transactions[0].subscriptionId;
                        user.next_billing = result.subscription.nextBillingDate;
                        user.paid_through = result.subscription.paidThroughDate;
                        user.plan_id = result.subscription.planId;
                        user.subscribed = true;

                        user.save(function (err) {
                            if (err) {
                                return res.status(400).send({
                                    message: errorHandler.getErrorMessage(err)
                                });
                            } else {
                                return res.status(200).send({result: result, user: user});
                            }
                        });

                    }
                    else {
                        return res.status(400).send({message: 'Error1'});
                    }

                });


            }
            else {
                console.log('use nonceFromTheClient');
                gateway.subscription.create({
                    paymentMethodToken: nonceFromTheClient?nonceFromTheClient:user.payment_method_token,
                    planId: plan
                }, function (err, result) {
                    if (!err && !util.isUndefined(result.subscription) && result.success) {
                        user.subscription_id = result.subscription.transactions[0].subscriptionId;
                        user.next_billing = result.subscription.nextBillingDate;
                        user.paid_through = result.subscription.paidThroughDate;
                        user.plan_id = result.subscription.planId;
                        user.subscribed = true;

                        user.save(function (err) {
                            if (err) {
                                return res.status(400).send(result);
                            } else {
                                return res.status(200).send({result: result, user: user});
                            }
                        });

                    }
                    else {
                        return res.status(400).send(result);
                    }

                });
            }

        }
        else {
            console.log('=======CREATING NEW CUSTOMER========');
            gateway.customer.create({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                paymentMethodNonce: nonceFromTheClient
            }, function (err, result) {
                if (result.success) {
                    console.log('new customer', result);
                    var payment_method_token = result.customer.paymentMethods[0].token;
                    var customer_id = result.customer.id;

                    user.customer_id = customer_id;
                    user.payment_method_token = payment_method_token;

                    //Save customer id
                    user.save(function (err) {
                    });

                    gateway.subscription.create({
                        paymentMethodToken: payment_method_token,
                        planId: plan
                    }, function (err, result) {

                        if (result.success === true) {
                            console.log('new subscription', result);
                            user.subscribed = true;
                            user.subscription_id = result.subscription.transactions[0].subscriptionId;
                            user.next_billing = result.subscription.nextBillingDate;
                            user.paid_through = result.subscription.paidThroughDate;
                            user.plan_id = result.subscription.planId;

                            user.save(function (err) {
                                if (err) {
                                    return res.status(400).send({
                                        message: errorHandler.getErrorMessage(err)
                                    });
                                } else {
                                    return res.status(200).send({result: result, user: user});
                                }
                            });

                        }

                        //res.status(200).send({result: result});
                    });
                }
            });
        }

    }
    else {
        return res.status(400).send({
            message: 'Error'
        });
    }

};

exports.unsubscribe = function (req, res) {
    var subscriptionId = req.body.subscriptionId;
    var user = req.user;
    delete req.body.roles;
    console.log(req.body);
    if (user && subscriptionId) {
        user = _.extend(user, req.body);
        gateway.subscription.cancel(subscriptionId, function (err, result) {
            console.log(result);
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            }
            else {
                user.subscribed = false;
                user.next_billing = null;
                user.plan_id = '';
                user.save(function (err) {
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    } else {
                        return res.status(200).send({
                            message: 'success'
                        });
                    }
                });

            }

        });
    }
    else {
        return res.status(400).send({
            message: 'Error'
        });
    }
};

exports.create_customer = function (req, res) {
    var nonceFromTheClient = req.body.payment_method_nonce;


};

exports.viewed_video = function (req, res) {
    var user = req.user;
    var message = null;

    // For security measurement we remove the roles from the req.body object
    delete req.body.roles;
    // console.log(req);
    if (user && req.body.videoId) {
        // Merge existing user
        user = _.extend(user, req.body);
        var allow_add = true;
        for (var i = 0; i < user.viewed_video.length; i++) {
            var video = user.viewed_video[i];
            console.log(video.video + '', '----', req.body.videoId);
            if (video.video + '' === req.body.videoId) {
                allow_add = false;
                return res.status(200).send({
                    message: 'success'
                });

            }
        }
        console.log('allow_add', allow_add);
        if (allow_add) {
            user.viewed_video.push({video: req.body.videoId});
        }


        user.save(function (err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                return res.status(200).send({
                    message: 'success'
                });
            }
        });
    } else {
        return res.status(400).send({
            message: 'Error'
        });
    }
};

exports.lesson_passed = function (req, res) {
    var user = req.user;
    var message = null;

    // For security measurement we remove the roles from the req.body object
    delete req.body.roles;
    // console.log(req);
    if (user && req.body.lessonId) {
        // Merge existing user
        user = _.extend(user, req.body);

        if (user.lesson_passed.indexOf(req.body.lessonId) === -1) {
            user.lesson_passed.push(req.body.lessonId);
        }

        user.save(function (err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                return res.status(200).send({
                    message: 'success'
                });
            }
        });
    } else {
        return res.status(400).send({
            message: 'Error'
        });
    }
};

exports.level_passed = function (req, res) {
    var user = req.user;
    var message = null;

    // For security measurement we remove the roles from the req.body object
    delete req.body.roles;
    // console.log(req);
    if (user && req.body.levelId) {
        // Merge existing user
        user = _.extend(user, req.body);
        if (user.level_passed.indexOf(req.body.levelId) === -1) {
            user.level_passed.push(req.body.levelId);
        }

        user.save(function (err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                return res.status(200).send({
                    message: 'success'
                });
            }
        });
    } else {
        return res.status(400).send({
            message: 'Error'
        });
    }
};


exports.seen_tour = function (req, res) {
    var user = req.user;
    var message = null;

    // For security measurement we remove the roles from the req.body object
    delete req.body.roles;
    // console.log(req);
    if (user) {
        // Merge existing user
        user = _.extend(user, req.body);
        user.seen_tour = true;

        user.save(function (err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                return res.status(200).send({
                    message: 'success'
                });
            }
        });
    } else {
        return res.status(400).send({
            message: 'Error'
        });
    }
};

exports.superdeal = function (req, res) {
    var user = req.user;
    var message = null;

    // For security measurement we remove the roles from the req.body object
    delete req.body.roles;
    // console.log(req);
    if (user) {
        // Merge existing user
        user = _.extend(user, req.body);
        user.superdeal = true;

        user.save(function (err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                return res.status(200).send({
                    message: 'success'
                });
            }
        });
    } else {
        return res.status(400).send({
            message: 'Error'
        });
    }
};

exports.set_current_level = function (req, res) {
    req.session.current_level = req.query.level;
    res.jsonp({current_level: req.query.level});
};
