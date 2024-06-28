import React, { useState , useEffect} from 'react';
import './style.css'; // Ensure your CSS file is correctly referenced
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';
import { FaUser } from "react-icons/fa";

import chatbutton from './images/chat.svg'
import chatlogo from './images/chat-logo.svg'
import youtube from  './images/youtube.png'
import sendchat from './images/send-chat.svg'
import { DotLoader } from 'react-spinners';
const ChatBox = () => {
  const [chatBoxVisible, setChatBoxVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const showLoading = () => {
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
  };

//   const api = axios.create({
//     baseURL: 'http://127.0.0.1:8000' // or any other API base URL
// });
axios.defaults.baseURL = 'http://127.0.0.1:8000';

  const handleChatButtonClick = () => {
    setChatBoxVisible(true);
  };

  const handleCloseButtonClick = () => {
    setChatBoxVisible(false);
    localStorage.removeItem('chatMessages');
    setMessages([])
  };

  const handleModalToggle = () => {
    console.log('Toggling modal visibility');
    setModalVisible(!modalVisible);
  };
   
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    setMessages(savedMessages);

   
  }, []);

  console.log(messages);

useEffect(() => {
  const handleKeyDown = (event) => {
    console.log("gi");
    if (event.keyCode === 13) {
      event.preventDefault();
      sendMessage();
    }
  };

  const inputElement = document.getElementById('user-question');
  if (inputElement) {
    inputElement.addEventListener('keydown', handleKeyDown);
  }

  return () => {
    if (inputElement) {
      inputElement.removeEventListener('keydown', handleKeyDown);
    }
  };
  }, []);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
    event.preventDefault(); 

      sendMessage();
    }
  };

  const sendMessage = () => {
    if (inputValue.trim() !== '') {
      displayMessage(inputValue, '', 'in');
      setInputValue('');
      setLoading(true);
      sendToBackend(inputValue);
    }
  };

  const displayMessage = (message, source, messageType,link) => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
   

    const formattedMessage = message.replace(/\n/g, '<br>');
    const formattedlink = decodeURIComponent(link).replace(/%22$/, '');
    const Dlink = "D:/Railtel/railtel-ui/Public/documents/OPD.pdf"
    const messageObj = {
      message: formattedMessage,
      source: source,
      messageType: messageType,
      link:link,
      id: Date.now(),
      time: `${hours}:${minutes}`,
     
    };
  
  
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, messageObj];
      localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
      return updatedMessages;
    });
  };

//   function hideLoading() {
//     document.querySelector('.loading').style.display = 'none';
// }
  function sendToBackend(userInput) {
    showLoading()
    fetch(" http://localhost:8000/chatbot/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie('csrftoken')
        },
        body: JSON.stringify({ user_input: userInput })
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
        // Display each response with its respective source
        if (data.greet){
          displayMessage(data.greet,'greet','greet')
      }
        if (data.QnA) {
            displayMessage(data.QnA, 'QnA', 'out');
        }
        if (data.gpt_answer){
            displayMessage(data.gpt_answer, 'youtube_video', 'out', data.link);
        }
        if (data.best_answer){
            displayMessage(data.best_answer, 'Suggested_answer', 'out');
        }
        if (data.answer_manual){
          displayMessage(data.answer_manual, 'user_manual', 'out', data.link);
      }
        hideLoading(); // Hide loading GIF on response
    })
}

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

  // const extractYouTubeLink = (text) => {
  //   const regex = /<a href="(https:\/\/www\.youtube\.com\/watch\?v=[^"]+)"[^>]*>[^<]+<\/a>/;
  //   const match = text.match(regex);
  //   return match ? match[1].replace("watch?v=", "embed/") : null;
  // };
  // const youtubeLink = extractYouTubeLink(item.gpt_answer);

  return (
    <div>
      <div className="headline"></div>

  
      
     
      <div className=" chat-button" onClick={handleChatButtonClick}>
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
        <div className='chat-bot-middlebox'>
        {isLoading && (
            <div className="loading">
              <DotLoader color={"#123abc"} loading={isLoading} size={40} />
            </div>
          )}
        {messages.map((msg, index) => (
          
        <div className="chat-box-body">
            
          {msg.messageType !== 'out' && msg.messageType !== 'greet'&&(
           
          <div className="chat-box-body-send">
            <p>{msg.message}</p>
            
            
          </div>
          

          )}
           {msg.messageType == 'greet' && (
           
           <div className="chat-box-body-greet">
            <FaUser />
             <p>{msg.message}</p>
             
           </div>
 
           )}
            {msg.messageType == 'out' && (

          <div className="chat-box-body-receive">
            <img src={chatlogo} className="chat-icon-from-top" alt="Chat Icon" />
            <p className="chat-txt-hed">HMIS</p>
            <p className="chat-txt-cont">
             {msg.message}
             
            </p>
            {msg.source == 'youtube_video' && (
            <iframe
              width="250"
              height="250"
              src={`https://www.youtube.com/embed/${msg.link}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={`video-${index}`}
            ></iframe>
            
            )}

            {msg.source == 'user_manual' &&(
             <a
             href={`/downloads/${msg.link}`}
             download
             target="_blank"
             rel="noopener noreferrer"
           >
             Download Manual
           </a>
            )}
          
            {/* <div>
              <img src={youtube}className="pad-25" alt="YouTube" />
            </div> */}
          </div>
            )}
              {msg.messageType == 'out' && (
          <div className="chat-box-fotr-bottom">
            <div className="chat-txt-hed">
              Source: <span className="clr-black">{msg.source}</span>
            </div>
          </div>
            )}
{msg.messageType == 'out' && (
          <div className="chat-box-time">Today {msg.time}</div>
)}
        </div>
        ))}
        </div>
        <div className="chat-box-footer">
          <input placeholder=" " type="text"  
            value={inputValue}
            onKeyDown={handleKeyPress}
            onChange={handleInputChange}
          />
          <i className="send">
            <img src={sendchat}className="pad-25" alt="Send" onClick={sendMessage}   />
          </i>
        </div>
      </div>
    




       <div className="p60">dd</div> 
      {/* <div className="modal " style={{ visibility: chatBoxVisible ? 'visible' : 'hidden' }}> */}


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
