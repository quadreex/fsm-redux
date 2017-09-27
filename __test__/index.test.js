import test from 'tape';
import sinon from 'sinon';
import createFSM from '../src/index';

test('FSM', t => {
  const params = {
    statusKey: 'status',
    initial: 'INIT',
    states: {
      'INIT': {
        reducer: sinon.spy(),
        accepts: {
          'LOAD_ACTION': 'LOADING'
        }
      },
      'LOADING': {
        reducer: sinon.spy(),
        accepts: {
          'LOAD_DONE_ACTION': 'LOADING_SUCCESS',
          'LOAD_FAIL_ACTION': 'LOADING_FAILURE'
        }
      },
      'LOADING_SUCCESS': {
        reducer: sinon.spy(),
        accepts: {
          'LOAD_ACTION': 'LOADING'
        }
      },
      'LOADING_FAILURE': {
        reducer: sinon.spy(),
        accepts: {
          'LOAD_ACTION': 'LOADING'
        }
      }
    }
  };

  const fsm = createFSM(params, { foo: 'bar' });
  const EXPECTED_INITIAL_STATE = {
    foo: 'bar',
    [params.statusKey]: params.initial
  };

  fsm();

  t.ok(
    params.states.INIT.reducer.calledOnce,
    'reducer for initial state should be called during init'
  );
  t.deepEqual(
    params.states.INIT.reducer.getCall(0).args[0],
    EXPECTED_INITIAL_STATE,
    'should set correct initial state'
  );
  t.notOk(
    params.states.LOADING.reducer.called,
    'reducer for state 2 should not be called during init'
  );
  t.notOk(
    params.states.LOADING_FAILURE.reducer.called,
    'reducer for state 3 should not be called during init'
  );
  t.notOk(
    params.states.LOADING_SUCCESS.reducer.called,
    'reducer for state 4 should not be called during init'
  );

  let state = fsm(void 0, { type: 'LOAD_ACTION' });

  t.equal(
    state[params.statusKey],
    'LOADING',
    'should switch state'
  );
  t.ok(
    params.states.INIT.reducer.calledOnce,
    'reducer for state 1 should not be called during state change'
  );
  t.notOk(
    params.states.LOADING.reducer.called,
    'reducer for state 2 should not be called during state change'
  );
  t.notOk(
    params.states.LOADING_FAILURE.reducer.called,
    'reducer for state 3 should not be called during state change'
  );
  t.notOk(
    params.states.LOADING_SUCCESS.reducer.called,
    'reducer for state 4 should not be called during state change'
  );

  fsm(state, { type: 'SOME_OTHER_ACTION' });

  t.ok(
    params.states.INIT.reducer.calledOnce,
    'reducer for state 1 should not be called for action'
  );
  t.ok(
    params.states.LOADING.reducer.calledOnce,
    'reducer for state 2 should be called for action'
  );
  t.deepEqual(
    params.states.LOADING.reducer.getCall(0).args[1],
    { type: 'SOME_OTHER_ACTION' },
    'reducer for state 2 should be called with proper action'
  );
  t.notOk(
    params.states.LOADING_FAILURE.reducer.called,
    'reducer for state 3 should not be called for action'
  );
  t.notOk(
    params.states.LOADING_SUCCESS.reducer.called,
    'reducer for state 4 should not be called for action'
  );

  state = fsm(state, { type: 'LOAD_ACTION' });

  t.equal(
    state[params.statusKey],
    'LOADING',
    'should not switch state'
  );
  t.ok(
    params.states.INIT.reducer.calledOnce,
    'reducer for state 1 should not be called for not accepted action'
  );
  t.ok(
    params.states.LOADING.reducer.calledOnce,
    'reducer for state 2 should not be called for not accepted action'
  );
  t.notOk(
    params.states.LOADING_FAILURE.reducer.called,
    'reducer for state 3 should not be called for not accepted action'
  );
  t.notOk(
    params.states.LOADING_SUCCESS.reducer.called,
    'reducer for state 4 should not be called for not accepted action'
  );

  state = fsm(state, { type: 'LOAD_FAIL_ACTION' });

  t.equal(
    state[params.statusKey],
    'LOADING_FAILURE',
    'should switch state'
  );
  t.ok(
    params.states.INIT.reducer.calledOnce,
    'reducer for state 1 should not be called for accepted action'
  );
  t.ok(
    params.states.LOADING.reducer.calledOnce,
    'reducer for state 2 should not be called for accepted action'
  );
  t.notOk(
    params.states.LOADING_FAILURE.reducer.called,
    'reducer for state 3 should not be called for accepted action'
  );
  t.notOk(
    params.states.LOADING_SUCCESS.reducer.called,
    'reducer for state 4 should not be called for accepted action'
  );

  fsm(state, { type: 'SOME_OTHER_ACTION' });

  t.ok(
    params.states.INIT.reducer.calledOnce,
    'reducer for state 1 should not be called for action'
  );
  t.ok(
    params.states.LOADING.reducer.calledOnce,
    'reducer for state 2 should not be called for action'
  );
  t.ok(
    params.states.LOADING_FAILURE.reducer.calledOnce,
    'reducer for state 3 should be called for action'
  );
  t.notOk(
    params.states.LOADING_SUCCESS.reducer.called,
    'reducer for state 4 should not be called for action'
  );

  t.end();
});

test('FSM - wrong params handling', t => {

  t.throws(function() {
    createFSM(null, { foo: 'bar' });
  }, /FSM parameters are not specified/, 'Should throw with no params');

  t.throws(function() {
    createFSM({}, { foo: 'bar' });
  }, /FSM states are not specified/, 'Should throw with no states');

  t.throws(function() {
    createFSM({ states: {} }, { foo: 'bar' });
  }, /Initial FSM state is not specified/, 'Should throw with no initial state');

  t.throws(function() {
    createFSM({
      initial: 'INIT',
      states: {
        'INIT': {
          accepts: {
            'LOAD_ACTION': 'LOADING'
          }
        }
      }
    }, { foo: 'bar' })();
  }, /FSM: missing reducer for state/, 'Should throw in case of missing reducer');

  t.end();
});
