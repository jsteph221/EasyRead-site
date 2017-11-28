import {combineReducers} from 'redux';
import ModalReducers from './modal-reducers';
import LoginReducers from './login-reducers';

const allReducers= combineReducers({
  showExchange : ModalReducers,
  login:LoginReducers
});

export default allReducers
