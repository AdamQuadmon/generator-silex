'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var silexPath = 'silex';


var SilexGenerator = module.exports = function SilexGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

    // setup the test-framework property, Gruntfile template will need this
    this.testFramework = options['test-framework'] || 'mocha';

    // for hooks to resolve on mocha by default
    if (!options['test-framework']) {
        options['test-framework'] = 'mocha';
    }

    // resolved to mocha by default (could be switched to jasmine for instance)
    this.hookFor('test-framework', { as: 'app' });

    this.indexFile = this.readFileAsString(path.join(this.sourceRoot(), silexPath, 'resources', 'view', 'index.html.twig'));
    this.mainJsFile = '';
    this.mainCoffeeFile = 'console.log "\'Allo from CoffeeScript!"';

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(SilexGenerator, yeoman.generators.NamedBase);

SilexGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // welcome message
  var welcome =
  '\n     _-----_' +
  '\n    |       |' +
  '\n    |' + '--(o)--'.red + '|   .--------------------------.' +
  '\n   `---------´  |    ' + 'Welcome to Yeoman,'.yellow.bold + '    |' +
  '\n    ' + '( '.yellow + '_' + '´U`'.yellow + '_' + ' )'.yellow + '   |   ' + 'ladies and gentlemen!'.yellow.bold + '  |' +
  '\n    /___A___\\   \'__________________________\'' +
  '\n     |  ~  |'.yellow +
  '\n   __' + '\'.___.\''.yellow + '__' +
  '\n ´   ' + '`  |'.red + '° ' + '´ Y'.red + ' `\n';

  console.log(welcome);

  var prompts = [{
    type: 'confirm',
    name: 'compassBootstrap',
    message: 'Would you like to include Twitter Bootstrap for Sass?'
  },
  {
    type: 'confirm',
    name: 'includeRequireJS',
    message: 'Would you like to include RequireJS (for AMD support)?'
  }];

  this.prompt(prompts, function (props) {
      // manually deal with the response, get back and store the results.
      // we change a bit this way of doing to automatically do this in the self.prompt() method.
      this.compassBootstrap = props.compassBootstrap;
      this.includeRequireJS = props.includeRequireJS;

    cb();
  }.bind(this));
};

//TODO: integrate those files

AppGenerator.prototype.gruntfile = function gruntfile() {
    this.template('Gruntfile.js');
};

AppGenerator.prototype.git = function git() {
    this.copy('gitignore', '.gitignore');
    this.copy('gitattributes', '.gitattributes');
};

AppGenerator.prototype.h5bp = function h5bp() {
    this.copy('favicon.ico', 'app/favicon.ico');
    this.copy('404.html', 'app/404.html');
    this.copy('robots.txt', 'app/robots.txt');
    this.copy('htaccess', 'app/.htaccess');
};

AppGenerator.prototype.bootstrapImg = function bootstrapImg() {
    if (this.compassBootstrap) {
        this.copy(path.join(silexPath, 'web', 'img', 'glyphicons-halflings.png'), 'app/images/glyphicons-halflings.png');
        this.copy(path.join(silexPath, 'web', 'img', 'glyphicons-halflings-white.png'), 'app/images/glyphicons-halflings-white.png');
    }
};

/*

AppGenerator.prototype.bootstrapJs = function bootstrapJs() {
    // TODO: create a Bower component for this
    if (this.includeRequireJS) {
        this.copy('bootstrap.js', 'app/scripts/vendor/bootstrap.js');
    }
};

AppGenerator.prototype.mainStylesheet = function mainStylesheet() {
    if (this.compassBootstrap) {
        this.write('app/styles/main.scss', '$iconSpritePath: "../images/glyphicons-halflings.png";\n$iconWhiteSpritePath: "../images/glyphicons-halflings-white.png";\n\n@import \'sass-bootstrap/lib/bootstrap\';\n\n.hero-unit {\n    margin: 50px auto 0 auto;\n    width: 300px;\n}');
    } else {
        this.write('app/styles/main.css', 'body {\n    background: #fafafa;\n}\n\n.hero-unit {\n    margin: 50px auto 0 auto;\n    width: 300px;\n}');
    }
};
*/

/*
    //ALSO:
 AppGenerator.prototype.packageJSON = function packageJSON() {
 this.template('_package.json', 'package.json');
 };

 AppGenerator.prototype.bower = function bower() {
 this.copy('bowerrc', '.bowerrc');
 this.copy('_component.json', 'component.json');
 };
 */
SilexGenerator.prototype.app = function app() {
  this.mkdir('app');
  this.mkdir('app/templates');

  this.copy('bowerrc', '.bowerrc');
  this.copy('_package.json', 'package.json');
  this.copy('_component.json', 'component.json');
};
/*
    //ALSO:
 AppGenerator.prototype.jshint = function jshint() {
 this.copy('jshintrc', '.jshintrc');
 };

 AppGenerator.prototype.editorConfig = function editorConfig() {
 this.copy('editorconfig', '.editorconfig');
 };
 */
SilexGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
    this.copy(path.join(silexPath, 'travis.yml'), 'travis.yml');
    this.copy(path.join(silexPath, 'composer.json'), 'composer.json');
    this.copy(path.join(silexPath, 'composer.lock'), 'composer.lock');
    this.copy(path.join(silexPath, 'console'), 'console');
    this.copy(path.join(silexPath, 'phpunit.xml'), 'phpunit.xml');
};
