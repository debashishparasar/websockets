import logo from './logo.svg';
import React, { Component } from 'react';

const serverDivStyle = {
            'backgroundColor': 'yellow',
            'textAlign': 'right',
            'align': 'right',
            'left': '50%',
        };

const clientDivStyle = {
            'backgroundColor': 'cyan',
            'textAlign': 'left',
            'horizontalAlign': 'left',
            'right': '50%',
        };

class Conversation extends React.Component {
  ws = new WebSocket('ws://localhost:5002')
  constructor(props) {
    super(props);
    this.state = { seconds: 0,
                   ws: this.ws,
                   messageFromClient: <dialog open style={clientDivStyle}>Ping....</dialog>,
                   dataFromServer: <dialog open style={serverDivStyle}></dialog> };
  }

  countAndChat() {
    this.setState(state => ({
      seconds: state.seconds + 1
    }));
    var sentences= [
    "She wore green lipstick like a fashion icon.",
    "Bill ran from the giraffe toward the dolphin.",
    "The sign said there was road work ahead so he decided to speed up.",
    "Patricia loves the sound of nails strongly pressed against the chalkboard.",
    "I’m a living furnace.",
    "He enjoys practicing his ballet in the bathroom.",
    "It took him a month to finish the meal.",
    "He embraced his new life as an eggplant.",
    "Whenever he saw a red flag warning at the beach he grabbed his surfboard.",
    "He excelled at firing people nicely.",
    "He uses onomatopoeia as a weapon of mental destruction.",
    "He was 100% into fasting with her until he understood that meant he couldn't eat.",
    "Getting up at dawn is for the birds.",
    "Had he known what was going to happen, he would have never stepped into the shower.",
    "He was so preoccupied with whether or not he could that he failed to stop to consider if he should.",
    "They're playing the piano while flying in the plane.",
    "The hand sanitizer was actually clear glue.",
    "Malls are great places to shop; I can find everything I need under one roof.",
    "She finally understood that grief was her love with no place for it to go.",
    "The green tea and avocado smoothie turned out exactly as would be expected.",
    "She could hear him in the shower singing with a joy she hoped he'd retain after she delivered the news.",
    "There have been days when I wished to be separated from my body, but today wasn’t one of those days.",
    "Nothing seemed out of place except the washing machine in the bar.",
    "Peanuts don't grow on trees, but cashews do.",
    "With a single flip of the coin, his life changed forever.",
    "The bullet pierced the window shattering it before missing Danny's head by mere millimeters.",
    "He wondered if it could be called a beach if there was no sand.",
    "I'm confused: when people ask me what's up, and I point, they groan.",
    "He was sitting in a trash can with high street class.",
    "The doll spun around in circles in hopes of coming alive.",
    "She had a habit of taking showers in lemonade.",
    "They were excited to see their first sloth.",
    "8% of 25 is the same as 25% of 8 and one of them is much easier to do in your head.",
    "Now I need to ponder my existence and ask myself if I'm truly real",
    "Don't put peanut butter on the dog's nose.",
    "He found the end of the rainbow and was surprised at what he found there.",
    "Abstraction is often one floor above you.",
    "You're good at English when you know the difference between a man eating chicken and a man-eating chicken.",
    "Her hair was windswept as she rode in the black convertible.",
    "Pair your designer cowboy hat with scuba gear for a memorable occasion.",
    "The river stole the gods.",
    "Wisdom is easily acquired when hiding under the bed with a saucepan on your head.",
    "He decided to live his life by the big beats manifesto.",
    "He hated that he loved what she hated about hate.",
    "The shooter says goodbye to his love.",
    "One small action would change her life, but whether it would be for better or for worse was yet to be determined.",
    "Don't piss in my garden and tell me you're trying to help my plants grow.",
    "The beach was crowded with snow leopards.",
    "She was disgusted he couldn’t tell the difference between lemonade and limeade.",
    "The sun had set and so had his dreams."
    ],

    maxSentences = sentences.length;
    var index= Math.floor(Math.random() * (maxSentences - 1));
    if (this.state.ws && this.state.ws.readyState == WebSocket.OPEN) {
        let clientMessage = sentences[index];
        let currMessage = this.state.messageFromClient
        let prevChat = document.getElementById('client_server_container').innerHTML;
        document.getElementById('client_server_container').insertAdjacentHTML('beforebegin', 
                                                                               prevChat);
        const today = new Date();
        const timestamp = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
        this.setState(state => ({
            messageFromClient: <span>
                                   <dialog open style={clientDivStyle}>
                                       <sup><b>[client:{timestamp}]</b></sup>{clientMessage}
                                   </dialog>
                               </span>
        }));
        this.state.ws.send(clientMessage); 
    }
  }

  componentDidMount() {
    this.interval = setInterval(() => this.countAndChat(), 10000);
    this.state.ws.onopen = () => {
        // on connecting, do nothing but log it to the console
    }
    this.state.ws.onmessage = evt => {
        const message = evt.data
        const today = new Date();
        const timestamp = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();

        this.setState({
                        dataFromServer: <span>
                                            <dialog open style={serverDivStyle}>
                                                <sup><b>[server:{timestamp}]</b></sup>{message}
                                            </dialog>
                                        </span>
                      }
        );
        console.log(message)
    }

    this.state.ws.onclose = () => {
        console.log('disconnected')
    }
  }

  render() {
    return (
        <div>
        <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" left='100%' />
        <div className="Conversation">
            Conversation count: {this.state.seconds}
        </div>
        <p id='client_server_container'>
        <br/><br/><br/>
        <div className="Client" id='client'>
            {this.state.messageFromClient}
        </div>
        <br/><br/><br/>
        <div className="Server">
            {this.state.dataFromServer}
        </div>
        </p>
        </header>
        </div>       
    );
  }
}

export default Conversation;
