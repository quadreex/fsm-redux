export default function createFSM(params, initState) {
  if (!isObject(params)) throw new TypeError('FSM parameters are not specified');
  if (!isObject(params.states)) throw new TypeError('FSM states are not specified');
  if (!params.initial) throw new TypeError('Initial FSM state is not specified');

  const status = params.statusKey || '__status';
  const actions = getActions(params.states);
  const initialState = {
    ...initState,
    [status]: params.initial
  };

  return (state = initialState, action = {}) => {
    const currentStatus = params.states[state[status]];
    const reducer = currentStatus.reducer;

    if (typeof reducer !== 'function') {
      throw new Error(`FSM: missing reducer for state '${state[status]}'`)
    }

    let next;
    if (next = currentStatus.accepts[action.type]) {
      return {
        ...state,
        [status]: next
      };
    }

    if (actions.indexOf(action.type) !== -1) {
      return state;
    }

    return reducer(state, action);
  };
}

function getActions(states) {
  const actions = Object.keys(states).reduce((acc, key) => {
    const actions = states[key].accepts;

    if (actions) {
      Object.keys(actions).forEach(a => {
        acc[a] = true;
      });
    }

    return acc;
  }, {});

  return Object.keys(actions);
}

function isObject(obj) {
  const type = typeof obj;

  return !!obj && (type === 'object' || type === 'function');
}
