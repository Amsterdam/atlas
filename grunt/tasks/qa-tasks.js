module.exports = function (grunt) {
    var files = require('../config/js-files');

    // Configure lint tasks
    const linters = ['eslint', 'console-log-test'];
    const tasks = ['grunt', 'tests', 'modules'];
    const fs = require('fs');
    const linttasks = linters
        .map(linter => tasks
            .map(task => `${linter}:${task}`))
        .reduce((result, lintertasks) => result.concat(lintertasks), []);

    grunt.registerTask('lint', linttasks);

    grunt.registerTask('test-js', [
        'test-js-modules',
        'lint'
    ]);

    grunt.registerTask('test-css', [
        'sasslint'
    ]);

    grunt.registerTask('build-test', [
        'concat-tests',
        'babel-tests'
    ]);

    grunt.registerTask('test-js-modules', [
        'build-test',
        'karma-modules-coverage'
    ]);

    // Test a single module by concatenate the test files
    // have them transpiled
    // And then run karma
    // The tasks are a per-module version of the test-js task
    // A Taiga task has been made to have all modules tested with full coverage
    files.modules.forEach(module => {
        grunt.registerTask(`test-js-module-${module.slug}`,
            [
                `concat:test_${module.slug}`,
                `babel-test-${module.slug}`,
                `karma:${module.slug}_all`
            ].concat(linters.map(linter => `newer:${linter}:module_${module.slug}`))
        );
    });

    grunt.registerTask('create-hooks', copyHooks);

    grunt.registerTask('pre-commit', [
        'test'
    ]);

    function copyHooks () {
        // Copy all hooks from /hooks into .git/hooks
        grunt.task.run('newer:copy:githooks');

        // Make hooks executable
        grunt.file.recurse('.git/hooks', path => {
            fs.chmodSync(path, '755');
        });
    }
};
