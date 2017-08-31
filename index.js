'use strict';

function createFSM(params, initState) {
    if (!isObject(params)) throw new TypeError('FSM parameters are not specified');
    if (!isObject(params.states)) throw new TypeError('FSM states are not specified');
    if (!params.initial) throw new TypeError('Initial FSM state is not specified');

    initState = mix(initState, {
        __state: params.initial
    });

    return function(state, action) {
        state = state || initState;

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

        return reducer(state, action);
    };
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

/*
var params = {
    initial: 'INIT',
    states: {
        'INIT': {
            reducer: function(state, action) {},
            accepts: {
                'LOAD_ACTION': 'LOADING'
            }
        },
        'LOADING': {
            reducer: function(state, action) {},
            accepts: {
                'LOAD_DONE_ACTION': 'LOADING_SUCCESS',
                'LOAD_FAIL_ACTION': 'LOADING_FAILURE'
            }
        },
        'LOADING_SUCCESS': {
            reducer: function(state, action) {},
            accepts: {
                'LOAD_ACTION': 'LOADING'
            }
        },
        'LOADING_FAILURE': {
            reducer: function(state, action) {},
            accepts: {
                'LOAD_ACTION': 'LOADING'
            }
        }
    }
};
*/

module.exports = {
    createFSM: createFSM
};