from flask import Flask, Blueprint, url_for
from flask.ext.restplus import Api, Resource, apidoc

# required for task id generation
import uuid

app = Flask(__name__, static_folder='static')

# swagger init
blueprint = Blueprint('api', __name__)
api = Api(blueprint, title='Tasks API', ui=False)


# tasks persisted in the app scope
TASKS = dict()


# create parser initialization
createParser = api.parser()
createParser.add_argument('label', help='Task label', type=str, location='form', required=True)


@api.route('/tasks')
class TaskList(Resource):
    def get(self):
        """
        Return all tasks
        """
        return TASKS.values()

    @api.doc(parser=createParser)
    def post(self):
        """
        Create new task
        """
        args = createParser.parse_args()
        task_id = str(uuid.uuid4())
        TASKS[task_id] = {'task_id': task_id, 'label': args['label'], 'position': len(TASKS), 'completed': 0}
        return TASKS[task_id], 200


# update parser initialization
updateParser = api.parser()
updateParser.add_argument('position', help='Task position', type=int, location='form')
updateParser.add_argument('completed', help='Task status', type=int, location='form')


@api.route('/tasks/<string:task_id>')
class Task(Resource):
    @api.doc(parser=updateParser, responses={
        '200': 'Success',
        '404': 'Task does not exist'
    })
    def patch(self, task_id):
        """
        Update task's position or completed fields
        """
        args = updateParser.parse_args()
        if task_id not in TASKS:
            api.abort(404, message="Task {} doesn't exist".format(task_id))

        task = TASKS[task_id]
        if args['position'] is not None:
            task['position'] = args['position']

        if args['completed'] is not None:
            task['completed'] = args['completed']

        return task, 200


@app.route('/')
def index():
    return app.send_static_file('index.html')


@blueprint.route('/doc')
def swagger_ui():
    return apidoc.ui_for(api)


app.register_blueprint(blueprint)
app.register_blueprint(apidoc.apidoc)


if __name__ == '__main__':
    app.run(debug=True)