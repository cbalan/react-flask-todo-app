/** @jsx React.DOM */

define([
    'react'
], function (React) {

    var AddTaskForm = React.createClass({
        handleSubmit: function (e) {
            e.preventDefault();
            var label = this.refs.label.getDOMNode().value.trim();
            if (!label) {
                return;
            }

            this.props.onTaskSubmit({label: label});
            this.refs.label.getDOMNode().value = '';
            return;
        },

        render: function () {
            return (
                <form className="addTaskForm" onSubmit={this.handleSubmit}>
                    <input type="text" placeholder="What needs to be done ?" ref="label" />
                    <input type="submit" value="Add Todo" />
                </form>
            );
        }
    });

    return AddTaskForm;
});