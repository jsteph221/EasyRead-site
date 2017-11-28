import React, { Component} from 'react';
import '../css/Chat.css';
import serverAddress from "../config/server.js"
import {Scrollbars} from 'react-custom-scrollbars';
import ChatConversation from './ChatConversation.js';
import ChatElement from "./ChatElement.js";
import {Button,Glyphicon} from "react-bootstrap";
import {connect} from 'react-redux';



class Chat extends Component {
  constructor(props){
    super(props);
    this.state = {loggedUser: props.loggedUser,convs:{msg:"Getting Conversations",data:[]},open:false};
    this.messagerActive = this.messagerActive.bind(this);
    this.messagerDeactive = this.messagerDeactive.bind(this);
    this.getConversations = this.getConversations.bind(this);
    this.mapToConversationView = this.mapToConversationView.bind(this);
    this.onConversationClick = this.onConversationClick.bind(this);
    this.closeMessageChain = this.closeMessageChain.bind(this);
  }
  messagerActive(){
    this.setState({open:true,showConversations:true});
  }
  messagerDeactive(){
    this.setState({open:false});
  }

  componentWillReceiveProps(nextProps){
    console.log("Chat will recieve props");
    console.log(nextProps);
    if(nextProps.logginEvent === "userLoggedIn"){
      this.setState({loggedUser:nextProps.loggedUser});
    }
    if(nextProps.logginEvent === "userLoggedOut"){
      this.setState({loggedUser:null,open:false});
    }
    if(nextProps.event === "openNewMessage"){
      console.log("In open new message");
      this.setState({open:true,showMessageChain:true,convId:"",toUser:nextProps.toUser,topic:nextProps.topic});
    }
  }
  componentDidUpdate(prevProps,prevState){
    if(prevState.loggedUser == null && this.state.loggedUser != null){
      console.log("CHAT: NEW LOGGED USER");
      this.getConversations(this.state.loggedUser);
    }
  }


  getConversations(userId){
    console.log("GETTING CONVERSATIONS for " + userId);
    var url = serverAddress+"chat/?userId="+this.state.loggedUser;
    var req = new XMLHttpRequest();
    var comp = this;
    req.open('GET',url,true);
    req.timeout = 2000;
    req.responseType='json';
    req.onload = function(){
      if(req.response == null){
        comp.setState({convs:{msg:"You have no conversations",data:[]}});
      }else if (req.status === 500){
        comp.setState({convs:{msg:"Server Error",data:[]}});
      }else{
        comp.setState({convs:{msg:"",data:req.response.conversations}});
      }
    }
    req.ontimeout=function(){
      comp.setState({convs:{msg:"Error Contacting Server. Try Again Later.",data:[]}});
    }
    req.send();
  }

  onConversationClick(convKey){
    this.setState({showMessageChain:true,convId:convKey});
  }

  closeMessageChain(){
    this.setState({showMessageChain:false,convId:null});

  }
  componentDidMount(){
    if(this.state.loggedUser != null){
      this.getConversations(this.state.loggedUser);
    }
  }

  mapToConversationView(convs){
    return convs.map((conv)=>
      <ChatElement conversation={conv} loggedUser={this.state.loggedUser} onConversationClickCallback={this.onConversationClick} />);
  }


  render() {
    var toShow;
    if(this.state.loggedUser == null){
      toShow = <p>Login to view your conversations</p>
    }else if(this.state.showMessageChain === true){
      toShow = <ChatConversation  loggedUser={this.state.loggedUser} convId={this.state.convId} toUser={this.state.toUser} topic={this.state.topic}/>

    }else{
      var message = this.state.convs.msg;
      if(message.length === 0){
        if(this.state.convs.data.length === 0){
          toShow=<p>You have no conversations</p>
        }else{
          toShow =
          <Scrollbars style={{ width: "100%auto", height: 1000 }}>
            <div>{this.mapToConversationView(this.state.convs.data)}</div>
          </Scrollbars>

        }
      }else{
        toShow=<p>{message}</p>
      }

    }
    return (
      <div>
        {this.state.open ?
          <div className="conversation-div">
            <header className="conversation-div-header">
                {this.state.showMessageChain?
                  <Button bsSize="small" onClick={this.closeMessageChain}><Glyphicon glyph="arrow-left"/></Button>
                  :
                  null
                }
                <h1 className="conversation-div-title">Conversations</h1>
            </header>
            {toShow}
          </div>
          : null
        }
        <div>
          {this.state.open ?
            <input className="messager-button-active" type="submit" onClick={this.messagerDeactive} value=""/>
            :
            <input className="messager-button" type="submit" onClick={this.messagerActive} value=""/>
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) =>{
  return{
    event: state.showExchange.event,
    logginEvent:state.login.event,
    loggedUser:state.login.id,
    toUser:state.showExchange.toUser,
    topic:state.showExchange.topic,
    flag:state.showExchange.flag
  }
}
const ChatContainer = connect(mapStateToProps, null)(Chat);

export default ChatContainer;
