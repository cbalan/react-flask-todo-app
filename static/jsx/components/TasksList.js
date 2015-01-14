/** @jsx React.DOM */

define([
    'react',
    'components/Task'
], function (React, Task) {

    var TasksList = React.createClass({
        handleTaskUpdate: function (task) {
            this.props.onTaskUpdate(task);
        },

        render: function () {
            var tasks = this.props.data.map(function (task, i) {
                return (
                    <li >
                        <Task task={task} onTaskUpdate={this.handleTaskUpdate}/>
                    </li>
                );
            }.bind(this));

            return (
                <ul className="taskList">
                    {tasks}
                </ul>
            );
        }
    });

    return TasksList;
});