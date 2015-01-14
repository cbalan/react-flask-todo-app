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
                <form className="addTaskForm form-horizontal" onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <div className="col-sm-9">
                            <input type="text" className="form-control input-large"  placeholder="What needs to be done ?" ref="label" />
                        </div>
                        <div className="col-sm-2">
                            <button type="submit" className="btn btn-primary">Add Todo</button>
                        </div>
                    </div>
                </form>
            );
        }
    });

    return AddTaskForm;
});