import React, { Component } from 'react';
import ShowExchangeCustomModal from "./ShowExchangeCustomModal.js";

import "../css/ExchangesLibrary.css"


class LibraryElement extends Component {
  constructor(props){
    super(props);
    this.state = {exchange:props.exchange, open : false};
    this.closeModal = this.closeModal.bind(this);

    this.openModal = this.openModal.bind(this);
  }
  openModal(){
    this.setState({open:true});
  }
  closeModal(){
    console.log("Callback close");
    this.setState({open:false});
  }
  render() {
      return(
        <div>
          <div className="library-exchange-view" onClick={this.openModal}>
            <img src = {this.state.exchange.book[0].imageUrl} alt= "../images/no_image.png" style = {{height:200,width:150,padding:10}}/>
            <p style={{"fontWeight":"bold"}}>{this.state.exchange.book[0].title}</p>
            <p>{this.state.exchange.book[0].author}</p>
            <p>User: {this.state.exchange.posterId}</p>
          </div>
          <div>
            {this.state.open ?
              <ShowExchangeCustomModal show={this.state.open} exchange={this.state.exchange} callbackClose={this.closeModal}/>
              :
              null
            }
          </div>

        </div>
      );
  }

}

export default LibraryElement;
