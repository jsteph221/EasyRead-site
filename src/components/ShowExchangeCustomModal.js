import React, { Component,PropTypes } from 'react';
import {Glyphicon,Button} from 'react-bootstrap'
import {connect} from 'react-redux';


//redux
import {messageUserClicked} from '../actions';


class ShowExchangeCustomModal extends Component{
  constructor(props){
    super(props);
    this.state = {show:props.show,exchange:props.exchange,flag:0};
    this.openMessager = this.openMessager.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.show == true){
      this.setState({ show: true });
    }
  }
  shouldComponentUpdate(nextProps,nextState){
    if(nextProps.show != this.state.show){
      return true;
    }
    return false;
  }
  componentWillUpdate(nextProps,nextState){
    this.setState(nextProps);
  }
  openMessager(){
    this.props.buttonClicked(this.state.exchange.posterId,this.state.exchange.book[0].title,this.state.flag);
    this.state.flag +=1;
    this.setState({flag:this.state.flag+1});
  }

  render(){
    console.log(this.state.exchange);
    return(
      <div>
      {this.state.show ?
        <div className="show-modal" draggable={true}>
          <header className="show-modal-header">
            <h1 className="show-modal-header-text">Show Exchange</h1>
            <Button className="show-modal-close-icon"onClick={this.props.callbackClose}><Glyphicon glyph="remove" /></Button>
          </header>
          <div className="show-image-title">
          <img src = {this.state.exchange.book[0].imageUrl} alt= "No Image Available" style = {{height:200,width:150,padding:10}}/>
          <div>
            <h3>{this.state.exchange.book[0].title}</h3>
            <p>By {this.state.exchange.book[0].author}</p>
          </div>
          </div>
          <p>Description</p>
          <p>{this.state.exchange.Description}</p>
          <Button bsStyle="primary" onClick={this.openMessager}> Message Poster</Button>



        </div> :

        null
      }
      </div>


    );
  }
}

function mapDispatchToProps(dispatch){
  return({
    buttonClicked:(userId,topic,flag) =>{dispatch(messageUserClicked(userId,topic,flag))}
  });
}
const ShowExchangeContainer = connect(null, mapDispatchToProps)(ShowExchangeCustomModal);

export default ShowExchangeContainer;
