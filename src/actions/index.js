export const messageUserClicked = (user,topic,flag) => {
	return{
		type: "MESSAGE_USER",
		user: user,
    topic:topic,
		flag:flag
	}
};

export const loggedIn = (id) =>{
  return{
    type:"LOGGED_IN",
    id:id
  }
}
export const loggedOut = ()=>{
	return{
		type:"LOGGED_OUT",
	}
}
