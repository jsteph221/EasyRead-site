import {messageUserClicked} from '../actions';
const initialState = {
	toUser: "",
  topic:""
}
export default function library(state = initialState, action) {

	switch (action.type){

		case 'MESSAGE_USER':
			return Object.assign({}, state, {
								event:"openNewMessage",
                toUser:action.user,
                topic:action.topic,
								flag:action.flag
            })
		default:
			return state
	}
}
