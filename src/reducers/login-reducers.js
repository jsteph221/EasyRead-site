import {loggedIn} from '../actions';
const initialState = {}

export default function library(state = initialState, action) {

	switch (action.type){

		case 'LOGGED_IN':
			return Object.assign({}, state, {
                event:"userLoggedIn",
                id:action.id
            })
		case 'LOGGED_OUT':
			return Object.assign({}, state, {
								event:"userLoggedOut",
								id:action.id
						})

		default:
			return state
	}
}
