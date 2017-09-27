# fsm-redux

[![NPM version](https://img.shields.io/npm/v/fsm-redux.svg)](https://www.npmjs.com/package/fsm-redux)
[![Build Status](https://travis-ci.org/quadreex/fsm-redux.svg?branch=master)](https://travis-ci.org/quadreex/fsm-redux)
[![Coverage Status](https://coveralls.io/repos/github/quadreex/fsm-redux/badge.svg?branch=master)](https://coveralls.io/github/quadreex/fsm-redux?branch=master)

Lightweight library for Finite State Machine support in Redux applications. This library implements FSM pattern as swappable redux reducers. In a configuration object you specify which reducer should be used for each state of FSM and actions which trigger state change.

## Example

```javascript
var params = {
    statusKey: 'status', // name of field that will hold current state (optional parameter)
    initial: 'INIT', // name of initial state
    states: {
      'INIT': {
        reducer: function(state, action) {}, // reducer used for state 'INIT'
        accepts: {
          'LOAD_ACTION': 'LOADING' // action with type 'LOAD_ACTION' will switch FSM to 'LOADING' state
        }
      },
      'LOADING': {
        reducer: function(state, action) {}, // reducer used for state 'LOADING'
        accepts: {
          'LOAD_DONE_ACTION': 'LOADING_SUCCESS', // action 'LOAD_DONE_ACTION' will switch FSM to 'LOADING_SUCCESS' state
          'LOAD_FAIL_ACTION': 'LOADING_FAILURE'  // action 'LOAD_FAIL_ACTION' will switch FSM to 'LOADING_FAILURE' state
        }
      },
      'LOADING_SUCCESS': {
        reducer: function(state, action) {}, // reducer used for state 'LOADING_SUCCESS'
        accepts: {
          'LOAD_ACTION': 'LOADING' // action 'LOAD_ACTION' will switch FSM to 'LOADING' state
        }
      },
      'LOADING_FAILURE': {
        reducer: function(state, action) {}, // reducer used for state 'LOADING_FAILURE'
        accepts: {
          'LOAD_ACTION': 'LOADING' // action 'LOAD_ACTION' will switch FSM to 'LOADING' state
        }
      }
    }
  };
  
var fsm = createFSM(params, initialState); // create FSM reducer
```

### License

MIT
