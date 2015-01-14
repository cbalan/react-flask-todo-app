/** @jsx React.DOM */

define([
    'react',
    'jquery',
    'jquery-ui',
    'components/Task'
], function (React, jquery, jqueryUi, Task) {

    var TasksList = React.createClass({
        handleTaskUpdate: function (task) {
            this.props.onTaskUpdate(task);
        },

        componentDidMount: function(){
            $(this.getDOMNode()).sortable({start: this.handleStart, stop: this.handleDrop});
        },

        handleStart: function (e, ui) {
            ui.item.fromPosition = ui.item.index();
        },

        handleDrop: function(e, ui) {
            // @todo shift all items between to and from positions, in place of just swapping old and new elements.

            e.preventDefault();
            var toPosition = ui.item.index(),
                fromPosition = ui.item.fromPosition;

            var fromTask =  this.props.data[toPosition];
            var toTask = this.props.data[fromPosition];

            this.props.onSort(fromTask, toTask);
        },

        render: function () {
            var tasks = this.props.data.map(function (task, i) {
                return (
                    <li className="ui-state-default">
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