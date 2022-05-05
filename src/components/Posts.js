import React, { Component } from 'react';
import Identicon from 'identicon.js'
import PostCard from './PostCard'

class Posts extends Component {

  render() {
    return (
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content ml-auto mr-auto" style={{maxWidth: '500px'}}>
               <br/>
               <form 
                  onSubmit={ (event) => { 
                        event.preventDefault()
                        this.props.createPost(this.postContent.value)
                      }}
                 className="card bg-light mb-3">
                  <div className="form-group mr-sm-2" style={{padding: '20px'}}>
                    <label for="formGroupExampleInput">What's on your mind?</label>
                    <input 
                      type="text" 
                      style={{marginBottom:'10px'}} 
                      ref={(input) => { this.postContent = input}}
                      className="form-control" 
                      id="formGroupExampleInput" 
                      placeholder="Example input"
                    />
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-block">Post
                    </button>
                  </div>
                </form>
                <br/>
                {
                  this.props.posts.map((post) => {
                    return(
                     <PostCard key={"postcard-"+post.id} post={post} index={post.id} tipPost={this.props.tipPost} />
                    )
                  })
                }
              </div>
            </main>
          </div>
        </div>
    )
  }
}

export default Posts;
