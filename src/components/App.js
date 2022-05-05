import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3'
import Navbar from './Navbar'
import Posts from './Posts'
import SocialNetwork from '../abis/SocialNetwork.json'

class App extends Component {

  async componentWillMount(){
    await this.loadWeb3()
    await this.loadBlockChainData()
  }

  async loadWeb3(){
    if(window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }  
    else if(window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else { 
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockChainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({account: accounts[0]})

    const networkId = await web3.eth.net.getId()
    const networkData = SocialNetwork.networks[networkId] 
    if(networkData) {
      const socialNetwork = new web3.eth.Contract(SocialNetwork.abi, networkData.address)
      this.setState({ socialNetwork })
      const postCount = await socialNetwork.methods.postCount().call()
      this.setState({ postCount })
      this.setState({posts:[]})
      for(var i=1; i<=postCount; i++) {
        const post = await socialNetwork.methods.posts(i).call()
        this.setState({
          posts: [...this.state.posts, post]
        })
      }
    } else {
      window.alert("SocialNetwork contract has not been deployed to the blockchain.")
    }
    this.setState({loading: false}) 
  }

  constructor(props) { 
    super(props)
    this.state = {
      account : '',
      socialNetwork: null,
      postCount: 0,
      posts: [],
      loading: true
    }
    this.createPost = this.createPost.bind(this)
    this.tipPost = this.tipPost.bind(this)
  }

  async createPost(content) {
    this.setState({ loading: true })
    this.state.socialNetwork.methods.createPost(content).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.loadBlockChainData()
    })
    .on('error', function(error){ 
      window.alert(error)
    })
  }

  async tipPost(postId, amount) {
    this.setState({ loading: true })
    
    this.state.socialNetwork.methods.tipPost(postId).send({ from: this.state.account, value: window.web3.utils.toWei(amount, "ether")})
    .once('receipt', async (receipt) => {
      this.loadBlockChainData()
    })
    .on('error', function(error){ 
      window.alert(error)
    })
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        {
          this.state.loading 
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Posts 
          posts={this.state.posts} 
          createPost={this.createPost} 
          tipPost={this.tipPost} />
        }
      </div>
    );
  }
}

export default App;


