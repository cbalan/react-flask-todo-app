from flask import Flask, redirect
from flask.ext.restful import reqparse, Api, Resource, abort
from flask_restful_swagger import swagger
import uuid

from operator import itemgetter

app = Flask(__name__, static_folder='../static')

# swagger app wrapper
api = swagger.docs(Api(app), apiVersion='0.1',
                   basePath='http://localhost:5000',
                   resourcePath='/',
                   produces=["application/json", "text/html"],
                   api_spec_url='/api/spec',
                   description='Tasks API')

# tasks persisted in the app scope
TASKS = dict()

# parser initialization
parser = reqparse.RequestParser()
parser.add_argument('label', type=str)
parser.add_argument('position', type=int)
parser.add_argument('completed', type=bool)


class TaskList(Resource):
    def get(self):
        return sorted(TASKS.values(), key=itemgetter('position'))

    def post(self):
        args = parser.parse_args()
        task_id = str(uuid.uuid4())
        TASKS[task_id] = {'task_id': task_id, 'label': args['label'], 'position': 0, 'completed': False}
        return TASKS[task_id], 204


class Task(Resource):
    @swagger.operation(
        notes='update item by ID',
    )
    def patch(self, task_id):
        args = parser.parse_args()
        if task_id not in TASKS:
            abort(404, message="Task {} doesn't exist".format(task_id))

        task = TASKS[task_id]
        if args['position'] is not None:
            task['position'] = args['position']

        if args['completed'] is not None:
            task['completed'] = args['completed']


api.add_resource(TaskList, '/tasks')
api.add_resource(Task, '/tasks/<string:task_id>')

if __name__ == '__main__':
    app.run(debug=True)