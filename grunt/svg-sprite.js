module.exports = {
    basic: {
        cwd: 'modules/shared/assets/svg-icons',
        src: ['*.svg'],
        dest: '',
        options: {
            shape: {
                spacing: {
                    padding: [0, 1, 0, 1]
                }
            },
            mode: {
                css: {
                    dest: 'build',
                    sprite: 'assets/images/icons.svg',
                    layout: 'horizontal',
                    prefix: 'dp-%s-icon',
                    dimensions: false,
                    render: {
                        scss: {
                            template: 'grunt/svg-sprite-template/icons.mustache',
                            dest: '../modules/shared/styles/config/mixins/_icons.scss'
                        }
                    }
                }
            }
        }
    }
};
