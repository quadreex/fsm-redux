export default function createFSM(params, initState) {
  if (!isObject(params)) throw new TypeError('FSM parameters are not specified');
  if (!isObject(params.states)) throw new TypeError('FSM states are not specified');
  if (!params.initial) throw new TypeError('Initial FSM state is not specified');

  const status = params.statusKey || '__status';
  const initialState = {
    ...initState,
    [status]: params.initial
  };

  return (state = initialState, action = {}) => {
    const currentStatus = params.states[state[status]];
    const next = currentStatus.accepts[action.type];
    const reducer = !next
      ? currentStatus.reducer
      : params.states[next].reducer;

    if (typeof reducer !== 'function') {
      throw new Error(`FSM: missing reducer for state '${next || state[status]}'`);
    }

    const newState = reducer(state, action);

    return next ? { ...newState, [status]: next } : newState;
  };
}

function isObject(obj) {
  const type = typeof obj;

  return !!obj && (type === 'object' || type === 'function');
}
