require.config({
    paths: {
        react: '../libs/react/react',
        jquery: '../libs/jquery/dist/jquery.min',
        'jquery-ui': '../libs/jquery-ui/jquery-ui.min',
        bootstrap: '../libs/bootstrap/dist/js/bootstrap.min',
        async: '../libs/async/lib/async'
    },

    shim: {
        react: {
            exports: 'React'
        },

        jquery: {
            exports: '$'
        },

        bootstrap: {
            deps: ['jquery']
        }
    }
});

require([
    'react',
    'components/App'
],
function(React, App) {
    React.render(App(), document.getElementById('app'));
});