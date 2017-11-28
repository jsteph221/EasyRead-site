import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import {Scrollbars} from 'react-custom-scrollbars';
import Slider from 'rc-slider/lib/Slider';
import {connect} from 'react-redux';

import {DropdownButton,MenuItem,Button} from 'react-bootstrap'

import 'react-tabs/style/react-tabs.css';
import 'rc-slider/assets/index.css';

import "../css/ExchangesLibrary.css"

import LibraryElement from "./LibraryElement";
import serverAddress from '../config/server.js';



var os = require('os');


//Helper function to get Ipaddress for locationquery
function getMyIp(){
  var interfaces = os.networkInterfaces();
  for(var k in interfaces){
    var addrs = interfaces[k];
    for(var i = 0 ; i< addrs.length;i++){
      var addr = addrs[i];
      if(addr.internal === false && addr.family ==='IPv4'){
        return addr.address;
      }
    }
  }
  return "2001:569:7051:8c00:e9fd:51:33fe:8675";
}
//Get location data based on user IP, callback will be searching for exchanges based on location
function getLocationData(callback){
  //TODO:Decomment
  /*
  var locationRequest = new XMLHttpRequest();
  var url = "freegeoip.net/json/"+getMyIp();
  console.log("Requesting location data: "+ url);
  locationRequest.open('GET',URL,true);
  locationRequest.responseType='json';
  locationRequest.onload = function(){
    console.log("Got location data :");
    callback(locationRequest.latitude,locationRequest.longitude);
  }
  locationRequest.onError = function(){
    callback(null);
  }
  locationRequest.send();
  */
  callback(49.222082,-122.937012);

}



class ExchangesLibrary extends Component {
  constructor(props){
    super(props);
    this.state = {
      loggedUser:props.loggedUser,
      exchanges : {message:"Getting Exchanges...",data:[]},
      maxRadius:25,
      sortBy:"nearest",
      newSearchParams:false
    };
    this.handleDropDownChange = this.handleDropDownChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);

    this.mapToExchangeView = this.mapToExchangeView.bind(this);
    this.getExchanges = this.getExchanges.bind(this);

  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.event == "userLoggedIn"){
      this.setState({loggedUser:nextProps.loggedUser});
    }
    if(nextProps.event === "userLoggedOut"){
      this.setState({loggedUser:null});
    }

  }


  componentDidUpdate(prevProps,prevState){
    if(this.state.newSearchParams){
      this.getExchanges(this.state.lat,this.state.lng);
    }
    if(prevState.loggedUser !== this.state.loggedUser){
      this.setState({newSearchParams:true,exchanges:{message:"Getting Exchanges...",data:[]}});
    }
  }


  handleDropDownChange(eventKey){
    console.log(eventKey)
    if(eventKey == 1){
      this.setState({sortBy : "default"});
    }else if(eventKey == 2){
      this.setState({sortBy :  "nearest"});
    }else if(eventKey == 3){
      this.setState({sortBy : "relevance"});
    }else{
      this.setState({sortBy : "date"});
    }
    this.setState({newSearchParams:true});
  }

  handleSearch(){

  }

  getExchanges(lat,lng){
    console.log("GETTING EXCHANGES");
    var req = new XMLHttpRequest();
    var url = serverAddress+"exchanges/?longitude="+lng+"&latitude="+lat+"&maxDistance="+this.state.maxRadius;
    console.log(this.state);
    if(this.state.loggedUser != ""){
      console.log("USERNAME NOT NULL");
      url += "&username="+this.state.loggedUser;
    }
    if(this.state.sortBy !== "default"){
      url+="&sort="+this.state.sortBy;
    }
    var comp = this;
    console.log("Requesting Exchanges: "+ url);
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
        comp.setState({exchanges:{message:"",data:req.response.exchanges}});
      }
    }
    req.ontimeout = function(){
      comp.setState({exchanges:{message:"Timeout.Server taking too long",data:[]}});

    }
    req.send();
    this.setState({newSearchParams:false});
  }

  mapToExchangeView(exchanges){
    return exchanges.map((exc)=>
      <LibraryElement exchange={exc} />
  );

  }

  componentDidMount(){
    getLocationData((lat,lng)=>{
      this.setState({lat:lat,lng:lng,newSearchParams:true});
      console.log(this.state);
    });
  }

  render() {
    let componentToShow;
    var message = this.state.exchanges.message;
    //If state exchanges.message length is 0, then exchanges have been gotten and can be shown
    if(message.length == 0){
      console.log("Exchanges exist");
      componentToShow =
                <div>{this.mapToExchangeView(this.state.exchanges.data)}</div>
    }
    //Else display either loading or error message;
    else{
      componentToShow = <p>{message}</p>
    }
    return (
      <div>
        <h1> Nearby Exchanges</h1>
        <div className = "library-search-prefs">
          <div style={{align:"left",padding:"0% 2%",width:"25%"}}>
            <p className = "library-search-prefs-title">Max Radius : {this.state.maxRadius} KM</p>
            <Slider className = "library-range-slider"
              defaultValue={30}
              max={50}
              min={1}
              onChange={value=>this.setState({maxRadius:value})}
              onAfterChange={()=>this.setState({newSearchParams:true})}
              trackStyle={{ backgroundColor: 'blue', height: 10 }}
              railStyle={{ backgroundColor: 'grey', height: 10 }}
              />
            </div>
            <div style={{align:"center",padding:"0% 2%",width:"25%"}}>
              <p className = "library-search-prefs-title">Sort By</p>
              <DropdownButton bsSize="sm" onSelect={this.handleDropDownChange} title={this.state.sortBy} id = "sort-by-dropdown">
                <MenuItem eventKey="2"> Nearest</MenuItem>
                <MenuItem eventKey="3"> Relevance</MenuItem>
                <MenuItem eventKey="4"> Date Posted</MenuItem>
              </DropdownButton>
            </div>
            <div style={{align:"center",padding:"0% 2%",width:"25%"}}>
              <p className = "library-search-prefs-title">Search Terms</p>
            <input type="text" placeholder="Artist, Title etc" name="username"/>
            </div>
            {this.state.newSearchParams? <Button  className="library-search-prefs-button" bsSize = "small" bsStyle="info" onClick= {this.handleSearch}>Update</Button> :
              <Button className="library-search-prefs-button" bsSize = "small" bsStyle="primary" onClick= {this.handleSearch}>Search</Button>
              }
        </div>
        <Tabs>
          <TabList>
            <Tab style={{color:'dimgrey', fontSize: 14}}>Grid View</Tab>
            <Tab style={{color:'dimgrey', fontSize: 14}}>Map View</Tab>
          </TabList>
          <TabPanel>
          <Scrollbars style={{ width: "100%auto", height: 1000 }}>
            {componentToShow}
          </Scrollbars>
          </TabPanel>
          <TabPanel>
            <Scrollbars>
                <p>Put Mpa here</p>
            </Scrollbars>
          </TabPanel>
        </Tabs>
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
const ExchangeLibraryContainer = connect(mapStateToProps, null)(ExchangesLibrary);

export default ExchangeLibraryContainer;
