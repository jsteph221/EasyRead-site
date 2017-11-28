import React,{Component} from "react";
import ReactDOM from 'react-dom'

import serverAddress from '../config/server.js';
import LibraryElement from "./LibraryElement";
import {Scrollbars} from 'react-custom-scrollbars';
import {connect} from 'react-redux';


class MyExchangesLibrary extends Component{
  constructor(props){
    super(props);
    this.state = {
      loggedUser:props.loggedUser,
      exchanges:{message:"Login to view your exchanges",data:[]}
    };
    this.mapToExchangeView = this.mapToExchangeView.bind(this);
    this.getUserExchanges = this.getUserExchanges.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    console.log("RECEIVING PROPS libr");
    console.log(nextProps);
    if(nextProps.event == "userLoggedIn"){
      this.setState({loggedUser:nextProps.loggedUser,exchanges:{message:"Getting Exchanges",data:[]}});
    }
    if(nextProps.event === "userLoggedOut"){
      this.setState({loggedUser:null,exchanges:{message:"Login to view your exchanges",data:[]}});
    }
  }

  componentDidUpdate(prevProps,prevState){
    if(this.state.loggedUser != null && prevState.loggedUser == null){
      this.getUserExchanges();
    }

  }
  componentDidMount(){
    if(this.state.loggedUser != null){
      this.getUserExchanges();
    }
  }
  mapToExchangeView(exchanges){
    return exchanges.map((exc)=>
      <LibraryElement exchange={exc} />
    );
  }
  getUserExchanges(){
    var req = new XMLHttpRequest();
    var url = serverAddress+"users/"+this.state.loggedUser+"/exchanges";
    var comp = this;
    req.open('GET',url,true);
    req.responseType='json';
    req.timeout = 2000;
    req.onload = function(){
      console.log("Response: "+ req.response);
      if(req.response == null){
        comp.setState({exchanges:{message:"Error Contacting Server. Try Again Later.",data:[]}});
      }else if (req.status == 500){
        comp.setState({exchanges:{message:req.response.message,data:[]}});
      }else{
        if(req.response.exchanges.length == 0){
          comp.setState({exchanges:{message:"You have posted no exchanges",data:req.response.exchanges}});

        }else{
          comp.setState({exchanges:{message:"",data:req.response.exchanges}});
        }
      }
    }
    req.ontimeout = function(){
      comp.setState({exchanges:{message:"Timeout. Server taking too long",data:[]}});
    }
    req.send();
  }

  render(){
    var toShow;
    if(this.state.exchanges.message !=""){
      toShow = <p>{this.state.exchanges.message}</p>
    }else{
      toShow = this.mapToExchangeView(this.state.exchanges.data);
    }
    return(
      <div>
        <h1>My Exchanges</h1>
        <Scrollbars style={{ width: "100%auto", height: 1000 }}>
          {toShow}
        </Scrollbars>
      </div>
    );
  }

}
const mapStateToProps = (state) =>{
  return{
    event:state.login.event,
    loggedUser:state.login.id,
  }
}
const MyExchangesLibraryContainer = connect(mapStateToProps, null)(MyExchangesLibrary);

export default MyExchangesLibraryContainer;
