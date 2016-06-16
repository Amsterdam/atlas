var modules = require('./modules'),
    jsFiles = ['build/temp/bower_components.js'];

modules.forEach(function (module) {
    //Add the main .module.js file first
    jsFiles.push('modules/' + module.slug + '/' + module.slug + '.module.js');

    //Then load the rest of the module, but don't include the .test.js files.
    jsFiles.push('modules/' + module.slug + '/**/*.js');
    jsFiles.push('!modules/' + module.slug + '/**/*.test.js');

    //And finally add the output of ngtemplates
    jsFiles.push('build/temp/' + module.slug + '.ngtemplates.js');
});

module.exports = jsFiles;