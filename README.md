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


## React components notes
 - TasksBox - main component. In charge with hooking frontend components with the backend api
   - AddTaskForm - allows creating new tasks. Exposes submit callback to allow main component to hock into backend api
   - TasksLists - sortable component via jquery-ui.sortable. Exposes callbacks for tasks updates
     - Task - representation of one task item


## Initial design

### Client side
  - will use facebook react and jquery. All actions will be done via callbacks
  - the task list will be updated
  - on document load, task create and update events
  - on timer. every 10 sec
  - the bottom items left counter will be calculated on the client side, on every task list update
  - "mark all as complete" will be implemented client side by iterating over all not completed tasks, reusing completed handler
  - for styling, I'll probably go for twitter bootstrap. but I'm not yet settle on this. I'll leave this one at the end


### Api
  - will support the following actions.
    - GET /tasks - list all tasks, sorted by position.
      - returns application/json as follows: [ { "id:"10", "label":"Solve world hunger", "completed":false, "position":100} ]
    - POST /tasks - create a new task
      - paramaters: label
    - PATCH /tasks/:task_id
      - parameters: completed, position
      - return 404 for unknown task
  - will ignore url version(ie. /v1/) prefix
  - no delete action supported
  - only one global list supported
  - publicly available


### Persistence.
Will use python's shelve


### App structure. Backend
 - will use flask.
 - react app will be loaded on flask app / route
 - the api will be available under application root. ie. /tasks


## Design updates
 - dropped python shelve as persistance. Not required. In memory, application scope store will be used
 - restful api will be implemented with swagger
 - used requirejs to load all js dependencies
 - task completed field was switched from bool to int to allow clear communication between client and server components
 - missed to highlight that internationalization is not supported
 - mark all as completed was implemented by using async library to iterate over all incompleted items
 and call patch /tasks/<task_id>. Once all calls are done, the list is refreshed


## Outstanding items
 - re-enable update tasks list on timer. Timer configuration is not properly handled.
 - add tests to describe the main functionalities
 - styling
 - api documentation (swagger annotations)
 - task sort is not natural. On drag and drop, only source and destination positions are swapped.
 In order to support a natural sort, all items in between must shifted. This might be a good reason
 to refactor tasks update api to accept multiple tasks updates
 - add tasks model abstraction behind flask rest api