from flask import Flask
from flask.ext.restplus import Api, Resource

# required for task id generation
import uuid

app = Flask(__name__, static_folder='static')


@app.route('/')
def index():
    return app.send_static_file('index.html')


# swagger app wrapper
api = Api(app, ui=False)

# tasks persisted in the app scope
TASKS = dict()

# parser initialization
parser = api.parser()
parser.add_argument('label', type=str)
parser.add_argument('position', type=int)
parser.add_argument('completed', type=int)


@api.route('/tasks')
class TaskList(Resource):
    def get(self):
        return TASKS.values()

    def post(self):
        args = parser.parse_args()
        task_id = str(uuid.uuid4())
        TASKS[task_id] = {'task_id': task_id, 'label': args['label'], 'position': 0, 'completed': 0}
        return TASKS[task_id], 204


@api.route('/tasks/<string:task_id>')
class Task(Resource):
    def patch(self, task_id):
        args = parser.parse_args()
        if task_id not in TASKS:
            api.abort(404, message="Task {} doesn't exist".format(task_id))

        task = TASKS[task_id]
        if args['position'] is not None:
            task['position'] = args['position']

        if args['completed'] is not None:
            task['completed'] = args['completed']

        return task, 204


if __name__ == '__main__':
    app.run(debug=True)