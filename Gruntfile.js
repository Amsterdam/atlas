module.exports = function (grunt) {
    require('./grunt/tasks/config')(grunt);
    require('./grunt/tasks/build-tasks')(grunt);
    require('./grunt/tasks/js-tasks')(grunt);
    require('./grunt/tasks/css-tasks')(grunt);
    require('./grunt/tasks/qa-tasks')(grunt);

    /**
     * 'default' formerly known as 'grunt serve'
     */
    grunt.registerTask('default', [
        'create-hooks',
        'build-develop',
        'connect:build',
        'watch'
    ]);

    grunt.registerTask('test', [
        'build-develop',
        'test-js',
        'test-css'
    ]);
};
