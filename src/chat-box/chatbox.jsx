import React, { useState , useEffect} from 'react';
import './style.css'; // Ensure your CSS file is correctly referenced
import '@fortawesome/fontawesome-free/css/all.min.css';


import chatbutton from './images/chat.svg'
import chatlogo from './images/chat-logo.svg'
import youtube from  './images/youtube.png'
import sendchat from './images/send-chat.svg'
const ChatBox = () => {
  const [chatBoxVisible, setChatBoxVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const handleChatButtonClick = () => {
    setChatBoxVisible(true);
  };

  const handleCloseButtonClick = () => {
    setChatBoxVisible(false);
  };

  const handleModalToggle = () => {
    setModalVisible(!modalVisible);
  };
   
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
console.log(inputValue);

// useEffect(() => {
//     const handleKeyDown = (event) => {
//       if (event.keyCode === 13) {
//         event.preventDefault();
//         sendMessage();
//       }
//     };

//     document.getElementById('user-question').addEventListener('keydown', handleKeyDown);

//     return () => {
//       document.getElementById('user-question').removeEventListener('keydown', handleKeyDown);
//     };
//   }, []);

  const sendMessage = () => {
    if (inputValue.trim() !== '') {
      displayMessage(inputValue, '', 'in');
      setInputValue('');
      setLoading(true);
      sendToBackend(inputValue);
    }
  };

  const displayMessage = (message, source, messageType) => {
    const formattedMessage = message.replace(/\n/g, '<br>');
    const messageObj = {
      message: formattedMessage,
      source: source,
      messageType: messageType,
      id: Date.now()
    };

    setMessages((prevMessages) => [...prevMessages, messageObj]);
  };


  const sendToBackend = (userInput) => {
    console.log(userInput);
    fetch('/chatbot/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
      },
      body: JSON.stringify({ user_input: userInput })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.QnA) {
          displayMessage(data.QnA, 'QnA', 'out');
        }
        if (data.gpt_answer) {
          displayMessage(data.gpt_answer, 'youtube_audio', 'out');
        }
        if (data.best_answer) {
          displayMessage(data.best_answer, 'Suggested_answer', 'out');
        }
        setLoading(false);
        console.log(data)
      });
  };


  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + '=') {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };
  return (
    <div>
      <div className="headline"></div>


      

      <div className="chat-button" onClick={handleChatButtonClick}>
        <img src={chatbutton} className="pad-25"  />
      </div>

      
     
      <div className="chat-box " style={{ visibility: chatBoxVisible ? 'visible' : 'hidden' }}>

        <div className="chat-box-header">
          <img src={chatlogo} className="chat-log-w" alt="Chat Logo" />
          <div className="chat-box-header-head">
            RailTel <span className="hmis-assist">HMIS Assist</span>
          </div>
          <p>
            <i className="fa fa-times close-btn-sty" onClick={handleCloseButtonClick}></i>
          </p>
        </div>
        <div className="chat-box-body">
          <div className="chat-box-body-send">
            <p>About RailTel News</p>
          </div>
          <div className="chat-box-body-receive">
            <img src={chatlogo} className="chat-icon-from-top" alt="Chat Icon" />
            <p className="chat-txt-hed">HMIS</p>
            <p className="chat-txt-cont">
              The OPD desk refers to the Outpatient Department desk in a hospital or healthcare facility.
            </p>
            <div>
              <img src={youtube}className="pad-25" alt="YouTube" />
            </div>
          </div>
          <div className="chat-box-fotr-bottom">
            <div className="chat-txt-hed">
              Source: <span className="clr-black"> youtube_video</span>
            </div>
          </div>
          <div className="chat-box-time">Today 11:52</div>
        </div>
        <div className="chat-box-footer">
          <input placeholder=" " type="text"  
            value={inputValue}
            onChange={handleInputChange}
          />
          <i className="send">
            <img src={sendchat}className="pad-25" alt="Send" onClick={sendMessage} />
          </i>
        </div>
      </div>
    




       <div className="p60">dd</div> 
       <div className={`modal ${modalVisible ? 'show-modal' : ''}`}>
        <div className="modal-content">
          <span className="modal-close-button" onClick={handleModalToggle}>&times;</span>
          <h1>Add What you want here.</h1>
        </div>
      </div> 
    </div>
  );
};

export default ChatBox;
