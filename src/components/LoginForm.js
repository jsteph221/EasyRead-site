import React, { Component } from 'react';
import {Nav,NavItem,FormGroup,FormControl,Button,MenuItem,NavDropdown,ControlLabel,DropdownButton} from 'react-bootstrap';
import {connect} from 'react-redux';

import {loggedIn,loggedOut} from '../actions';

import serverAddress from '../config/server.js';


class LoginForm extends Component{
  constructor(props){
    super(props);
    this.state={loggedUser:"",createAccFormOpen:false,isCreatingAcc:false,isLoggingIn:false};

    this.attemptLogin = this.attemptLogin.bind(this);
    this.createAccountFormToggle = this.createAccountFormToggle.bind(this);
    this.attemptCreateAccount = this.attemptCreateAccount.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }
  attemptLogin(){
    //Validation Checking
    if(this.state.loginUser == null || this.state.loginUser.length === 0){
      this.setState({loginError: "A Username is Required"});
    }else if(this.state.loginPass == null || this.state.loginPass.length === 0){
        this.setState({loginError: "A Password is Required"});
    }else{
      //Disable button
      this.setState({isLogging:true,loginError:null});
      var url = serverAddress+'users/login';
      var req = new XMLHttpRequest();
      var body = {
        _id:this.state.loginUser,
        password:this.state.loginPass
      }
      var component = this;
      req.open('POST',url,true);
      req.setRequestHeader("Content-type", "application/json;charset=UTF-8");
      req.setRequestHeader("Content-length", body.length);
      req.timeout= 2000;
      req.onreadystatechange = function(){
        if(req.readyState===4){
          if(req.status === 0){
            component.setState({loginError:"Error Contacting Server. Try Again Later",isLogging:false});
          }else if(req.status === 403){
            component.setState({loginError:"Incorrect Password",isLogging:false});
          }else if(req.status === 500){
            component.setState({loginError:"Server Error",isLogging:false});
          }else if(req.status === 404){
            component.setState({loginError:"Username does not exist",isLogging:false});
          }else{
            component.setState({loggedUser:component.state.loginUser,createAccError:null});
            component.props.loginSuccess(component.state.loginUser);
          }
        }
      }
      req.send(JSON.stringify(body));
    }
  }
  attemptCreateAccount(){
    if(this.state.createAccountUser == null || this.state.createAccountUser.length === 0){
      this.setState({createAccError: "A Username is Required"});
    }else if(this.state.createAccountPass == null || this.state.createAccountPass.length === 0){
      this.setState({createAccError: "A Password is Required"});
    }else if(this.state.createAccountPass !== this.state.createAccountVerify){
      this.setState({createAccError: "Passwords do no match"});
    }else{
      this.setState({isCreatingAcc:true,createAccError:null});
      var url = serverAddress+'users';
      var req = new XMLHttpRequest();
      var body = {
        _id:this.state.createAccountUser,
        password:this.state.createAccountPass
      }
      console.log(body);
      var component = this;
      req.open('POST',url,true);
      req.setRequestHeader("Content-type", "application/json;charset=UTF-8");
      //req.setRequestHeader("Content-length", body.length);
      req.timeout= 2000;
      req.onreadystatechange = function(){
        if(req.readyState==4){
          console.log(req);
          console.log(req.status);
          if(req.status === 0){
            component.setState({createAccError:"Error Contacting Server. Try Again Later",isCreatingAcc:false});
          }else if(req.status === 403){
            component.setState({createAccError:"Username already exists",isCreatingAcc:false});
          }else if(req.status === 500){
            component.setState({createAccError:"Error Contacting Server. Try Again Later",isCreatingAcc:false});
          }else{
            component.setState({loggedUser:component.state.createAccountUser,createAccError:null,isCreatingAcc:false});
            component.props.loginSuccess(component.state.createAccountUser);
          }
        }
      }
      req.send(JSON.stringify(body));
    }
  }
  handleLogout(){
    this.setState({loggedUser:""});
    this.props.logout();
  }
  //Don't close dropdownmenu on form click
  createAccountFormToggle(isOpen,event, s){
    if(s.source === "click"){
      if(!isOpen){
        console.log("Closing form");
        this.setState({createAccFormOpen:false});
      }else{
        this.setState({createAccFormOpen:true});
      }
    }else if(s.source === "rootClose"){
      this.setState({createAccFormOpen:false});
    }
  }
  render(){
    console.log(this);
    return(
      <div className="App-login">
        {this.state.loggedUser === "" ?

            <FormGroup controlId="login-form">
              <FormControl type="text" placeholder="Username" value = {this.state.loginUser} onChange={(e)=>this.setState({loginUser:e.target.value})}></FormControl>
              <FormControl type="Password" placeholder="Password" value={this.state.loginPass} onChange={(e)=>this.setState({loginPass:e.target.value})}></FormControl>
              <Button bsStyle="primary" disabled= {this.state.isLoggingIn} onClick={this.attemptLogin}>Login</Button>


            <DropdownButton pullRight open={this.state.createAccFormOpen} title="Create Account" id="create-account-dropdown" onToggle={this.createAccountFormToggle}>
              <div align="center" style = {{padding:"4px"}}>
                <FormGroup controlId="create-acc">
                  <ControlLabel>Enter Username</ControlLabel>
                  <FormControl type = "text" value={this.state.createAccountUser} onChange= {(e)=>this.setState({createAccountUser:e.target.value})} placeholder="Username"/>
                  <ControlLabel>Enter Password</ControlLabel>
                  <FormControl type = "password"  value={this.state.createAccountPass} onChange= {(e)=>this.setState({createAccountPass:e.target.value})} placeholder="Password"/>
                  <ControlLabel>Verify Password</ControlLabel>
                  <FormControl type = "password" value={this.state.createAccountVerify} onChange= {(e)=>this.setState({createAccountVerify:e.target.value})} placeholder="Password"/>
                  <Button type="submit" disabled = {this.state.isCreatingAcc} onClick={this.attemptCreateAccount}>Create!</Button>
                {this.state.createAccError == null ? null: <p className="App-error">{this.state.createAccError}</p>}
                </FormGroup>
                </div>
            </DropdownButton>
            {this.state.loginError == null ? null: <p className="App-error">{this.state.loginError}</p>}

            </FormGroup>

          :

          <DropdownButton onSelect={this.handleLogout} bsSize = "large" pullRight eventKey={1} title={this.state.loggedUser} style={{padding:10}}>
            <MenuItem eventKey= {5.1}>View Settings</MenuItem>
            <MenuItem eventKey= {5.2}>Log Out</MenuItem>
          </DropdownButton>
      }
    </div>
    );
  }
}
function mapDispatchToProps(dispatch){
  return({
    loginSuccess:(userId) =>{dispatch(loggedIn(userId))},
    logout:()=>{dispatch(loggedOut())}
  });
}
const LoginFormContainer = connect(null,mapDispatchToProps)(LoginForm);

export default LoginFormContainer;
