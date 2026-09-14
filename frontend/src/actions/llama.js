import { noticeError } from '../lib/notice';
import api from './api';

export const ACTION_TYPES = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  REMOVE: 'REMOVE',
  FETCH_ALL: 'FETCH_ALL',
};

const fail = message => error => {
  console.error(message, error);
  noticeError(message);
};

export const fetchAll = () => dispatch => {
  api
    .llama()
    .fetchAll()
    .then(records => dispatch({ type: ACTION_TYPES.FETCH_ALL, payload: records }))
    .catch(fail('Could not load llamas.'));
};

export const create = (data, onSuccess) => dispatch => {
  api
    .llama()
    .create(data)
    .then(record => {
      dispatch({ type: ACTION_TYPES.CREATE, payload: record });
      onSuccess();
    })
    .catch(fail('Could not create the llama.'));
};

export const update = (data, onSuccess) => dispatch => {
  api
    .llama()
    .update(data.id, data)
    .then(record => {
      dispatch({ type: ACTION_TYPES.UPDATE, payload: record });
      onSuccess();
    })
    .catch(fail('Could not update the llama.'));
};

// The growth calculation lives in the backend, so this only needs the id.
export const shear = (id, onSuccess) => dispatch => {
  api
    .llama()
    .shear(id)
    .then(record => {
      dispatch({ type: ACTION_TYPES.UPDATE, payload: record });
      onSuccess();
    })
    .catch(fail('Could not shear the llama.'));
};

export const remove = (id, onSuccess) => dispatch => {
  api
    .llama()
    .remove(id)
    .then(() => {
      dispatch({ type: ACTION_TYPES.REMOVE, payload: id });
      onSuccess();
    })
    .catch(fail('Could not delete the llama.'));
};
