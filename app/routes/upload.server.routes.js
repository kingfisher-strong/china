'use strict';

module.exports = function(app) {
    var upload  = require('../../app/controllers/upload.server.controller');
    var users = require('../../app/controllers/users.server.controller');

    app.route('/upload/:filename')
        .get(upload.read);


    app.route('/upload')
        .post(upload.create, users.hasAuthorization(['admin']));
};
