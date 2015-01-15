import unittest
import app
from flask.ext.testing import TestCase

from operator import itemgetter


class TasksTestCase(TestCase):
    def create_app(self):
        return app.app

    def setUp(self):
        app.TASKS = dict()

    def sorted(self, tasks):
        return sorted(tasks, key=itemgetter('position'))

    def filterOut(self, tasks, task_id):
        return filter(lambda task: task['task_id'] != task_id, tasks)

    def test_add_task(self):
        """
        Test add and list tasks
        """
        task1 = self.client.post('/tasks', data=dict(label='Task 1')).json
        task2 = self.client.post('/tasks', data=dict(label='Task 2')).json
        task3 = self.client.post('/tasks', data=dict(label='Task 3')).json

        # load all tasks. Sort result by position
        tasks = self.sorted(self.client.get('/tasks').json)

        self.assertEqual([task1, task2, task3], tasks)


    def test_mark_task_as_completed(self):
        """
        Test mark task as completed
        """
        self.client.post('/tasks', data=dict(label='Task 1'))
        self.client.post('/tasks', data=dict(label='Task 2'))
        task3 = self.client.post('/tasks', data=dict(label='Task 3')).json
        self.client.post('/tasks', data=dict(label='Task 4'))

        originalTasks = self.sorted(self.client.get('/tasks').json)

        # mark task3 as completed
        self.client.patch('/tasks/' + task3['task_id'], data=dict(completed=1))

        # load all tasks
        tasks = self.sorted(self.client.get('/tasks').json)

        # tasks list to dict. task_id is used as key
        tasksDict = dict([(task['task_id'], task) for task in tasks])

        # test task3 state
        patchedTask3 = tasksDict[task3['task_id']]
        assert patchedTask3['completed'] == 1

        # test the rest of tasks were not changed
        self.assertEqual(self.filterOut(originalTasks, task3['task_id']),
                         self.filterOut(tasks, task3['task_id']))


    def test_update_position(self):
        """
        Test mark task as completed
        """
        self.client.post('/tasks', data=dict(label='Task 1'))
        self.client.post('/tasks', data=dict(label='Task 2'))
        task3 = self.client.post('/tasks', data=dict(label='Task 3')).json
        self.client.post('/tasks', data=dict(label='Task 4'))

        originalTasks = self.sorted(self.client.get('/tasks').json)

        # update task3 position
        self.client.patch('/tasks/' + task3['task_id'], data=dict(position=0))

        # load all tasks
        tasks = self.sorted(self.client.get('/tasks').json)

        # tasks list to dict. task_id is used as key
        tasksDict = dict([(task['task_id'], task) for task in tasks])

        # test task3 state
        patchedTask3 = tasksDict[task3['task_id']]
        assert patchedTask3['position'] == 0

        # test the rest of tasks were not changed
        self.assertEqual(self.filterOut(originalTasks, task3['task_id']),
                         self.filterOut(tasks, task3['task_id']))


if __name__ == '__main__':
    unittest.main()


