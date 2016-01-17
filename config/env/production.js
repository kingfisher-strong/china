'use strict';

module.exports = {
	db: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/domino',
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
		]
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || 'APP_ID',
		clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
		callbackURL: '/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
		clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
		callbackURL: '/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || 'APP_ID',
		clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
		callbackURL: '/auth/google/callback'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || 'APP_ID',
		clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
		callbackURL: '/auth/linkedin/callback'
	},
	github: {
		clientID: process.env.GITHUB_ID || 'APP_ID',
		clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
		callbackURL: '/auth/github/callback'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'macanhhuydn@gmail.com',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'Gmail',
			host: 'smtp.gmail.com',
			secureConnection: true,
			port: 465,
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'macanhhuytesting@gmail.com',
				pass: process.env.MAILER_PASSWORD || 'macanhhuydn'
			}
		}
	}
};
