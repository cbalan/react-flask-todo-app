/** @jsx React.DOM */

define([
    'react'
], function (React) {

    var Task = React.createClass({
        handleChange: function (event) {
            event.preventDefault();
            this.props.task.completed = (this.props.task.completed === 0) ? 1 : 0;
            this.props.onTaskUpdate(this.props.task);
        },

        render: function () {
            var classes = 'task';
            if (this.props.task.completed === 1) {
                classes += ' completed';
            }

            return (
                <div className={classes}>
                    <input type="checkbox" checked={this.props.task.completed} onChange={this.handleChange}/>

                    <span className="taskLabel">
                        {this.props.task.label}
                    </span>
                    <span class="ui-icon ui-icon-arrowthick-2-n-s"/>
                </div>
            );
        }
    });

    return Task;
});