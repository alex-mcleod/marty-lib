var fs = require('fs');
var _ = require('lodash');
var yaml = require('js-yaml');
var shell = require('shelljs');
var babelify = require('babelify');

var SCRIPTS = [
  './src/http-state-source/__tests__/lib/mockServer.js'
];

module.exports = function (config) {
  process.env.NODE_ENV = 'test';

  switch (process.env.ENV) {
    case 'CI':
      _.extend(process.env, saucelabsVariables());
      config.set(saucelabs());
      break;
    case 'IE':
      _.extend(process.env, saucelabsVariables());

      config.set(_.extend(saucelabs(), {
        customLaunchers: {
          sl_ie_11: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            platform: 'Windows 8.1',
            version: '11'
          }
        },
        browsers: ['sl_ie_11']
      }));
      break;
    default:
      config.set(local());
      break;
  }

  runScripts(SCRIPTS);

  function runScripts(scripts) {
    var children = [];

    process.on('exit', function () {
      _.invoke(children, 'kill');
    });

    _.each(scripts, function (script) {
      children.push(shell.exec('node ' + script, { async:true }));
    });
  }

  function saucelabs() {
    var customLaunchers = {
      sl_chrome: {
        base: 'SauceLabs',
        browserName: 'chrome',
        platform: 'Windows 7',
        version: '38'
      },
      sl_firefox: {
        base: 'SauceLabs',
        browserName: 'firefox',
        version: '33'
      },
      sl_safari: {
        base: 'SauceLabs',
        browserName: 'safari',
        version: '5'
      },
      sl_ie_9: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 7',
        version: '9'
      },
      sl_ie_10: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 7',
        version: '10'
      },
      sl_ie_11: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 8.1',
        version: '11'
      }
    };

    return _.extend(base(), {
      sauceLabs: {
        testName: 'Marty Tests'
      },
      browserDisconnectTimeout : 10000,
      browserDisconnectTolerance : 1,
      browserNoActivityTimeout : 4 * 60 * 1000,
      captureTimeout : 4 * 60 * 1000,
      customLaunchers: customLaunchers,
      browsers: Object.keys(customLaunchers),
      reporters: ['dots', 'saucelabs'],
      singleRun: true
    });
  }

  function local() {
    return _.extend(base(), {
      reporters: ['spec'],
      browsers: ['ChromeCanary'],
      autoWatch: true,
      singleRun: false,
      colors: true
    });
  }

  function base() {
    return {
      basePath: '',
      frameworks: ['mocha', 'browserify'],
      browserNoActivityTimeout: 100000,
      browserify: {
        bare: true,
        debug: true,
        configure: function (bundle) {
          bundle.transform(babelify.configure({
            optional: ['es7.decorators', 'es7.classProperties']
          }));

          bundle.transform('envify');
        }
      },
      files: [
        'test/browser/setup.js',
        'src/**/*.js'
      ],
      exclude: [
        'src/application/__server-tests__/**/*.js'
      ].concat(SCRIPTS),
      preprocessors: {
        'test/browser/setup.js': ['browserify'],
        'src/**/*.js': ['browserify']
      },
      port: 9876,
      proxies: {
        '/stub': 'http://localhost:8956/stub'
      },
      logLevel: config.LOG_INFO
    };
  }

  function saucelabsVariables() {
    return _.pick(travisGlobalVariables(), 'SAUCE_USERNAME', 'SAUCE_ACCESS_KEY');

    function travisGlobalVariables() {
      var config = {};
      var travis = yaml.safeLoad(fs.readFileSync('./.travis.yml', 'utf-8'));

      travis.env.global.forEach(function (variable) {
        var parts = /(.*)="(.*)"/.exec(variable);

        config[parts[1]] = parts[2];
      });

      return config;
    }
  }
};