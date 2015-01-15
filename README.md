# Todo app
Sample application build with flask and facebook react

## Installation
Inspired from https://github.com/abhiomkar/flask-react

 * install python dependencies

        pip install -r requirements.txt

 * install js dependencies

        bower install

 * compile jsx files using [React tool](http://facebook.github.io/react/docs/tooling-integration.html#productionizing-precompiled-jsx) for development purpose

        jsx --watch static/jsx static/js

 * run flask server

        python app.py

 * locations:
    - tasks app: http://127.0.0.1:5000
    - swagger.json: http://127.0.0.1:5000/swagger.json
    - api docs: http://127.0.0.1:5000/doc

## React components notes
 - TasksBox - main component. In charge with hooking frontend components with the backend api
   - AddTaskForm - allows creating new tasks. Exposes submit callback to allow main component to hock into backend api
   - TasksLists - sortable component via jquery-ui.sortable. Exposes callbacks for tasks updates
     - Task - representation of one task item

## Outstanding items
 - task sort is not natural. On drag and drop, only source and destination positions are swapped.
 In order to support a natural sort, all items in between must shifted. This might be a good reason
 to refactor tasks update api to accept multiple tasks updates
 - add tasks model abstraction behind flask rest api