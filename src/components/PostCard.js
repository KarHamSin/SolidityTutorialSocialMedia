import React, { Component } from 'react';
import Identicon from 'identicon.js'
import Web3 from 'web3'

class PostCard extends Component {
  constructor(props) {
    super(props);
    this.state = {tipAmount: 0};
  }

  handleChange = event => {
    this.setState({tipAmount: event.target.value});
  }

  toEther = wei => {
    return wei/10e17
  }

  render() {
    return (
          <div className="card bg-light mb-3" style={{maxWidth: '30rem'}}>          
              <div className="card-header">
              <img 
                className="ml-2" 
                width='30' 
                height='30'
                src={`data:image/png;base64, ${new Identicon(this.props.post.author, 30).toString()} `}
              />
              {this.props.post.author}
              </div>
              <div className="card-body">
                <h5 className="card-title">{this.props.post.content}</h5>
              </div>
              <form onSubmit={(event) => { 
                  event.preventDefault()
                  this.props.tipPost(this.props.post.id, this.state.tipAmount)
              }}>
                <div className="card-footer row">
                    <p className="col-sm-3">Tips: {this.toEther(this.props.post.tipAmount)} ETH</p>
                    <p className="col-sm-3">Give tip</p>
                    <input className="col-sm-3" onChange={this.handleChange} type="text"/>
                    <input 
                      className="col-sm-2" 
                      style={{fontSize: '14px', marginLeft:'10px'}} 
                      type="submit" 
                      value="Tip!"
                    />
                </div>
              </form>
          </div>
    )
  }
}

export default PostCard;
