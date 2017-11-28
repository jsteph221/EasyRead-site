import React, { Component } from 'react';
import {Button,Glyphicon} from "react-bootstrap";

import "../css/Chat.css"

class ChatElement extends Component{
  constructor(props){
    super(props);
    this.state = {
      conversation : props.conversation,
      loggedUser : props.loggedUser
    }
  }
  render(){
    var c = this.state.conversation;
    if(c.participants[0] === this.state.loggedUser){
      var title = "With : " + c.participants[1];
    }else{
      var title = "With : " + c.participants[0];
    }
    var topic = "Topic : " + c.topic;
    var lastMsg = "Last Message : " + c.messages[0].data;
    return(
      <div className="chat-conversation-element"  onClick={()=>this.props.onConversationClickCallback(c._id)} >
        <p>{title}</p>
        <p>{topic}</p>
        <p>{lastMsg}</p>
      </div>
    );
  }
}
export default ChatElement;
