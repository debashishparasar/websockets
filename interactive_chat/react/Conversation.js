import logo from './logo.svg';
import React, { Component } from 'react';

const serverDivStyle = {
            'backgroundColor': 'yellow',
            'textAlign': 'right',
            'horizontalAlign': 'right',
            'left': '50%',
        };

const clientDivStyle = {
            'backgroundColor': 'cyan',
            'textAlign': 'left',
            'horizontalAlign': 'left',
            'left': '60%',
        };

class Conversation extends React.Component {
  constructor(props) {
    super(props);
    const today = new Date();
    const timestamp = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    const wsock = new WebSocket('ws://localhost:5002');
    this.state = { count: 1,
                   ws: wsock,
                   posts:[
                           { title: 'Server', 
                             content: <span>
                                          <dialog open class="diag" style={clientDivStyle}>
                                              <sup><b>[client:{timestamp}]</b></sup>Ping...
                                          </dialog>
                                      </span>
                           }],
                   content: null,
                   clientMsg: null,
                   dataFromServer: <dialog open style={serverDivStyle}></dialog> };
    this.message = React.createRef();
    this.setMessage = this.setMessage.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.updatePosts = this.updatePosts.bind(this);
    this.updateContent = this.updateContent.bind(this);
  }

  setMessage(event) {
    this.setState({clientMsg: event.target.value});
  }

  sendMessage(event) {
    const today = new Date();
    const timestamp = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    this.setState({
                        count: this.state.count + 1,
                        posts: this.state.posts.concat([
                                   { 
                                     title: 'Client', 
                                     content: <span>
                                                  <dialog open class="diag" style={clientDivStyle}>
                                                      <sup><b>[client:{timestamp}]</b></sup>{this.state.clientMsg}
                                                  </dialog>
                                              </span>
                                    }]),
                      });
    this.state.ws.send(this.state.clientMsg);
    event.preventDefault();
  }

  countAndChat() {
    this.setState(state => ({content : this.state.posts.map((post) =>
                             <div key={post.id}>
                                 <p>{post.content}</p>                         
                             </div>)
                  }));
    this.state.ws.send("Ping");    
  }

  updatePosts(message) {
      this.setState((state) => {
        const today = new Date();
        const timestamp = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
        return {
          posts: this.state.posts.concat([
                                   { title: 'Server', 
                                     content: <span>
                                                  <dialog open class="diag" style={serverDivStyle}>
                                                      <sup><b>[server:{timestamp}]</b></sup>{message}
                                                  </dialog>
                                              </span>
                                    }]),
        }
      });
  }

  updateContent() {
    this.setState(state => ({
                             content : this.state.posts.map((post) =>
                             <div key={post.id}>
                                 <p>{post.content}</p>
                                 <br/><br/><br/>
                             </div>)
                  }));
  }

  componentDidMount() {
    this.state.ws.onopen = () => {
      this.countAndChat();
    }

    this.state.ws.onmessage = evt => {
        const message = evt.data;
        this.updatePosts(message);
        this.updateContent();
    }

    this.state.ws.onclose = () => {
        console.log('disconnected')
    }
  }

  render() {
    return (
        <div class="row">
            <div class="column">
                <header className="App-header">
                    <form onSubmit={this.sendMessage}>
                        <label for="message">Client input:</label><br/><br/>
                        <input type="text" ref={this.message} onChange={this.setMessage}/><br/><br/>
                        <input type="submit" value="Send" />
                    </form>  
                </header>
            </div>
            <div class="column">
                <header className="App-header">
                  <img src={logo} className="App-logo" alt="logo" />
                  <div className="Count">
                     Conversation count: {this.state.count}
                  </div>
                  <div className="ConversationHistory">
                    {this.state.content}
                  </div>
                </header>
            </div>          
        </div>       
    );
  }
}

export default Conversation;
