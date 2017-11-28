import React, { Component } from 'react';
import serverAddress from '../config/server.js';
import {Scrollbars} from 'react-custom-scrollbars';

import "../css/Chat.css"

class ChatConversation extends Component{
  constructor(props){
    super(props);
    this.state = {
      convId:props.convId,
      loggedUser:props.loggedUser,
      messages:{msg:"Getting Messages",data:[]}
    }
    this.getConversation = this.getConversation.bind(this);
    this.mapToMessagesView = this.mapToMessagesView.bind(this);
  }

   componentDidMount(){
     if(this.state.convId != null){
       this.getConversation(this.state.convId);
     }else{
       console.log("NEW CONVERSATION")
     }
    }
    getConversation(id){
        console.log("Getting conversation id : "+ id);
        var url = serverAddress+"chat/"+id;
        var req = new XMLHttpRequest();
        var comp = this;
        req.open('GET',url,true);
        req.responseType='json';
        req.timeout = 2000;
        req.onload = function(){
          console.log("Chat Response: ");
          console.log(req.response);
          if(req.response == null){
            comp.setState({messages:{msg:"Error Contacting Server. Try Again Later.",data:[]}});
          }else if (req.status == 500){
            comp.setState({messages:{msg:"Error on Server",data:[]}});
          }else{
            comp.setState({messages:{msg:"",data:req.response}});
          }
        }
        req.send();
    }

    mapToMessagesView(messages){
      console.log("IN MAP MESSAGES");
      console.log(messages);
      var msgs = []
      for(var i = 0;i<messages.length;i++){
        var msg = messages[i];
        var tmp;
        if (msg.sentBy == this.state.loggedUser){
          tmp = <p className="chat-message-sentbyme">{msg.data}</p>
        }else{
          tmp = <p className="chat-message-sentbyother">{msg.data}</p>
        }
        msgs.push(tmp);
      }
      console.log(msgs);
      return msgs;
    }

  render(){
    
    if(this.state.convId === ""){
      console.log("NEW CONV");
      return(
        <div>
          <div className="messager-to-div">
            <p>TO :   </p>
            <input type="text" value={this.props.toUser} disabled={true}/>
          </div>
          <div className="messager-topic-div">
            <p>TOPIC :</p>
            <input type="text" value={this.props.topic} disabled={true}/>
          </div>
          <Scrollbars style={{ width: "100%auto", height: 1000 }}>
          </Scrollbars>
        </div>
      );
    }
    else if(this.state.messages.msg == ""){
      var conversation = this.state.messages.data;
      if(conversation.participants[0] != this.state.loggedUser){
        var toUser = conversation.participants[0];
      }else{
        var toUser = conversation.participants[1];
      }
      var topic= conversation.topic;
      return(
        <div>
          <div className="messager-to-div">
            <p>TO :   </p>
            <input type="text" value={toUser} disabled={true}/>
          </div>
          <div className="messager-topic-div">
            <p>TOPIC :</p>
            <input type="text" value={topic} disabled={true}/>
          </div>
          <Scrollbars style={{ width: "100%auto", height: 1000 }}>
            {this.mapToMessagesView(conversation.messages)}
          </Scrollbars>
        </div>
      );
    }else{
      return(
        <div>
          <div className="messager-to-div">
            <p>Getting messages...</p>
          </div>
        </div>
      );
    }

  }

}
export default ChatConversation;
