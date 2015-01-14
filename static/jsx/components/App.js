/** @jsx React.DOM */

define([
    'react',
    'async'
], function (React, async) {
    // @todo move these components to individual files

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
                </div>
            );
        }
    });

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

    var TasksBox = React.createClass({
        loadTaskList: function () {
            $.ajax({
                url: this.props.url,
                dataType: 'json',
                success: function (data) {
                    this.setState({data: data, itemsLeft: this.getTasksLeft().length});
                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },

        handleTaskSubmit: function (task) {
            $.ajax({
                type: "POST",
                url: this.props.url,
                data: task,
                success: this.loadTaskList,
                error: function (xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },

        handleTaskUpdate: function (task, callback) {
            $.ajax({
                type: "PATCH",
                url: this.props.url + '/' + task.task_id,
                data: {
                    completed: task.completed,
                    position: task.position
                },
                success: function(data){
                    if(!callback) {
                        this.loadTaskList();
                    }
                    else callback(data);
                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },

        getInitialState: function () {
            return {data: []};
        },

        getTasksLeft: function() {
            return this.state.data.filter(function (task) {
                return task.completed === 0;
            });
        },

        handleMarkAll: function (e) {
            async.eachSeries(this.getTasksLeft(), function(task, callback) {
                task.completed=1;
                this.handleTaskUpdate(task, callback);
            }.bind(this), function(err) {
                if(err) {
                    console.error(err);
                }

                this.loadTaskList();
            }.bind(this));
        },

        componentDidMount: function () {
            this.loadTaskList();
            // setInterval(this.loadTaskList, this.props.pollInterval);
        },

        render: function () {
            return (
                <div className="tasksBox">
                    <h1>Todos</h1>
                    <AddTaskForm onTaskSubmit={this.handleTaskSubmit}/>
                    <TasksList data={this.state.data} onTaskUpdate={this.handleTaskUpdate}/>
                    <span>{this.state.itemsLeft} items left</span>
                    <a href="#" onClick={this.handleMarkAll}>Mark all as complete</a>
                </div>
            );
        }
    });

    var App = React.createClass({
        render: function () {
            return (<TasksBox url="/tasks" pollInterval="{5000}"  />);
        }
    });

    return App;
});