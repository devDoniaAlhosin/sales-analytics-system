import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faTimes, faRobot } from '@fortawesome/free-solid-svg-icons';
import { 
  formatRecommendations, 
  fetchRecommendations, 
  generateResponse, 
  formatErrorMessage,
  formatResponse 
} from '../../Helpers/geminiHelper';
import '../../Styles/components/Chatbot.scss';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        const data = await fetchRecommendations();
        setRecommendations(data);
        setMessages(formatRecommendations(data));
      } catch (error) {
        setMessages([formatErrorMessage(error)]);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      loadRecommendations();
    }
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };



  return (
    <div className="chatbot-container">
      <button className="chatbot-toggle" onClick={toggleChat}>
        <FontAwesomeIcon icon={faRobot} />
      </button>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>AI Assistant</h3>
            <button className="close-button" onClick={toggleChat}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          <div className="chatbot-messages">
            {loading ? (
              <div className="loading">Loading recommendations...</div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`message ${message.type} ${message.isHeader ? 'header' : ''} ${message.isError ? 'error' : ''}`}
                >
                  {message.type === 'bot' && !message.isHeader && (
                    <div className="bot-avatar">
                      <FontAwesomeIcon icon={faRobot} />
                    </div>
                  )}
                  <div className="message-content">{message.content}</div>
                </div>
              ))
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default Chatbot; 