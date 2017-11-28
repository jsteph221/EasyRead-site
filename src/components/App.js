import React, { Component } from 'react';
import logo from '../images/logo.svg';
import ExchangesLibrary from "./ExchangesLibrary"
import MyExchangesLibrary from "./MyExchangesLibrary"

import Chat from "./Chat"
import '../css/App.css';
import Navbar from 'react-bootstrap/lib/Navbar';
import {Nav,NavItem,FormGroup,FormControl,Button,MenuItem,NavDropdown,ControlLabel,DropdownButton} from 'react-bootstrap';
import LoginForm from "./LoginForm";

import serverAddress from '../config/server.js';
const EXCHANGES_KEY = 1;
const MYEXCHANGE_KEY = 2;
const ABOUT_KEY = 3;
const LOGIN_KEY =4;
const ACCOUNT_KEY = 5;


class App extends Component {
  constructor(props){
    super(props);
    this.state = {clickedComponent : EXCHANGES_KEY};
    this.handleNavTabClick = this.handleNavTabClick.bind(this);
  }



  handleNavTabClick(eventKey){
    this.setState({clickedComponent:eventKey});
  }


  render() {
    const navbarInstance = (
      <Navbar collapseOnSelect bsSize="large">
        <Navbar.Header>
          <Navbar.Brand>
            <p style={ {color: "#0000ff"}}>Navigation</p>
          </Navbar.Brand>
        </Navbar.Header>
        <Navbar.Collapse>
        <Nav pullLeft bsStyle="tabs" onSelect= {this.handleNavTabClick}>
          <NavItem eventKey= {EXCHANGES_KEY} >Exchanges</NavItem>
          <NavItem eventKey={MYEXCHANGE_KEY} >My Exchanges</NavItem>
          <NavItem eventKey={ABOUT_KEY}>About</NavItem>
        </Nav>
      </Navbar.Collapse>
      </Navbar>
    );
    //Show different component based on which navbar tab clicked
    let ComponentToShow;
    if(this.state.clickedComponent === EXCHANGES_KEY){
      ComponentToShow = <ExchangesLibrary/>
    }else if (this.state.clickedComponent === MYEXCHANGE_KEY){
      ComponentToShow = <MyExchangesLibrary/>
    }else if(this.state.clickedComponent === ABOUT_KEY){
      ComponentToShow = <p>About</p>
    }

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to EasyRead</h1>
        </header>
        <LoginForm/>
        <div className = "App-navbar">
              {navbarInstance}
              <div className="App-content-panel">
                {ComponentToShow}
              </div>
        </div>
        <div className="App-chat">
          <Chat/>
        </div>

      </div>
    );
  }
}
export default App;
