# TicTailHack 2.2 reply

## Initial design

### Client side
  - will use facebook react and jquery. All actions will be done via callbacks.
  - the task list will be updated
  - on document load, task create and update events.
  - on timer. every 10 sec.
  - the bottom items left counter will be calculated on the client side, on every task list update
  - "mark all as complete" will be implemented client side by iterating over all not completed tasks, reusing completed handler.
  - for styling, I'll probably go for twitter bootstrap. but I'm not yet settle on this. I'll leave this one at the end.

## Api
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

## Persistence.
will use python's shelve

## App structure. Backend
- will use flask.
- react app will be loaded on flask app / route
- the api will be available under application root. ie. /tasks

## Design updates
 - dropped python shelve as persistance. not required. in memory, application scope store will be used.
 - restful api will be implemented with swagger




