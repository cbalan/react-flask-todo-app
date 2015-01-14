/** @jsx React.DOM */

define([
    'react',
    'async',
    'jquery',
    'components/AddTaskForm',
    'components/TasksList'
], function (React, async, jquery, AddTaskForm, TasksList) {

    var TasksBox = React.createClass({
        loadTaskList: function () {
            $.ajax({
                url: this.props.url,
                dataType: 'json',
                success: function (data) {
                    this.setState({
                        data: data.sort(function (a, b) {
                            return a.position - b.position;
                        }),
                        itemsLeft: data.filter(function (task) {
                            return task.completed === 0;
                        }).length
                    });
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
                success: function (data) {
                    if (!callback) {
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

        getTasksLeft: function () {
            return this.state.data.filter(function (task) {
                return task.completed === 0;
            });
        },

        handleMarkAll: function (e) {
            async.eachSeries(this.getTasksLeft(), function (task, callback) {
                task.completed = 1;
                this.handleTaskUpdate(task, callback);
            }.bind(this), function (err) {
                if (err) {
                    console.error(err);
                }

                this.loadTaskList();
            }.bind(this));
        },

        handleSort: function(tasks) {
            // swap positions
            var position = fromTask.position;
            fromTask.position = toTask.position;
            toTask.position = position;

            async.eachSeries([fromTask, toTask], function (task, callback) {
                this.handleTaskUpdate(task, callback);
            }.bind(this), function (err) {
                if (err) {
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
                    <TasksList data={this.state.data} onTaskUpdate={this.handleTaskUpdate} onSort={this.handleSort} />
                    <span>{this.state.itemsLeft} items left</span>
                    <a href="#" onClick={this.handleMarkAll}>Mark all as complete</a>
                </div>
            );
        }
    });

    return TasksBox;
});