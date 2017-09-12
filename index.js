'use strict';

function createFSM(params, initState) {
  if (!isObject(params)) throw new TypeError('FSM parameters are not specified');
  if (!isObject(params.states)) throw new TypeError('FSM states are not specified');
  if (!params.initial) throw new TypeError('Initial FSM state is not specified');

  initState = mix(initState, {
    __state: params.initial
  });

  var actions = getActions(params.states);

  return function(state, action) {
    state = state || initState;
    action = action || {};

    var currentState = params.states[state.__state];
    var reducer = currentState.reducer;

    if (typeof reducer !== 'function') {
      throw new Error('FSM: missing reducer for state ' + state.__state)
    }

    var next;
    if (next = currentState.accepts[action.type]) {
      return mix(state, {
        __state: next
      });
    }

    if (actions.indexOf(action.type) !== -1) {
      return state;
    }

    return reducer(state, action);
  };
}

function getActions(states) {
  var actions = Object.keys(states).reduce(function (acc, key) {
    var actions = states[key].accepts;

    if (actions) {
      Object.keys(actions).forEach(function (a) {
        acc[a] = true;
      });
    }

    return acc;
  }, {});

  return Object.keys(actions);
}

function isObject(obj) {
  var type = typeof obj;

  return !!obj && (type === 'object' || type === 'function');
}

function mix() {
  var target = {};

  for (var index = 0; index < arguments.length; ++index) {
    var src = arguments[index];

    if (isObject(src)) {
      Object.keys(src).forEach(function (key) {
        target[key] = src[key];
      });
    }
  }

  return target;
}

module.exports = {
  createFSM: createFSM
};
