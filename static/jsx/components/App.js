/** @jsx React.DOM */

define([
    'react',
    'components/TasksBox'
], function (React, TasksBox) {

    var App = React.createClass({
        render: function () {
            return (<TasksBox url="/tasks" pollInterval="5000"  />);
        }
    });

    return App;
});