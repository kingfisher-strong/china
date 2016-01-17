'use strict';

module.exports = {
	app: {
		title: 'Domino Chinese',
		description: 'Domino Chinese',
		keywords: 'domino, chinese'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
				'public/lib/toastr/toastr.min.css',
				'public/lib/iCheck/skins/all.css',
				'public/lib/jquery-joyride/joyride-2.1.css'
			],
			js: [
				'public/lib/toastr/toastr.min.js',
				'public/lib/carouFredSel/jquery.carouFredSel-6.2.1-packed.js',
				'public/lib/gilbitron/carouFredSel/jquery.carouFredSel-6.2.1-packed.js',
				'public/lib/ng-file-upload/FileAPI.min.js',
				'public/lib/ng-file-upload/ng-file-upload-shim.min.js',
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js',
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/ng-file-upload/ng-file-upload.min.js',
				'public/lib/angular-validation/dist/angular-validation-rule.min.js',
				'public/lib/angular-validation/dist/angular-validation.min.js',
				'public/lib/iCheck/icheck.min.js',
				'public/lib/jquery-cookie/jquery.cookie.js',
				'public/lib/jquery.countdown/dist/jquery.countdown.min.js',
				'public/lib/jquery-validation/dist/jquery.validate.min.js',
				'public/lib/jquery-validation/dist/additional-methods.min.js',
				'public/lib/jquery.payment/lib/jquery.payment.js',
				'public/lib/braintree-angular/dist/braintree-angular.js',
				'public/lib/jquery-joyride/jquery.joyride-2.1.js',
				'public/lib/ng-lodash/build/ng-lodash.min.js'

			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};
