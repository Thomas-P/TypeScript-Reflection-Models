/**
 * Created by ThomasP on 25.03.2016.
 */
// system.conf.js
System.config({
    packages: {
        'lib': {
            defaultExtension: 'js',
            format: 'register'
        }
    },
    paths: {
        'systemjs': 'node_modules/systemjs/dist/system.js',
        'system-polyfills': 'node_modules/systemjs/dist/system-polyfills.js',
        'es6-module-loader': 'node_modules/es6-module-loader/dist/es6-module-loader.js'
    },
    meta: {
        'node_modules/*': {
            format: 'global'
        }
    },
    map: {
        'reflect-metadata': 'node_modules/reflect-metadata/Reflect.js'
    }
});