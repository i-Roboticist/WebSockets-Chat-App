import { useEffect, useRef, useState } from 'react'

function App() {
  const ws = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Only create WebSocket if it doesn't exist
    if (!ws.current) {
      ws.current = new WebSocket('ws://localhost:8181');

      ws.current.onopen = () => {
        console.log('WebSocket connection established');
        setIsConnected(true);
      };

      ws.current.onclose = () => {
        console.log('WebSocket connection closed');
        setIsConnected(false);
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.current.onmessage = (event) => {
        setMessages(prev => [...prev, event.data]);
      };
    }

    // Enhanced cleanup
    return () => {
      if (ws.current) {
        console.log('Cleaning up WebSocket');
        ws.current.close();
        ws.current = null; // Reset the reference
      }
    };
  }, []);

  const handleSend = () => {
    if (inputMessage.trim() && ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(inputMessage);
      setInputMessage('');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      {!isConnected && <div>Connecting to WebSocket server...</div>}
      
      {isConnected && (
        <div>
          <div>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type message..."
              style={{ marginRight: '10px', padding: '5px' }}
            />
            <button 
              onClick={handleSend}
              style={{ padding: '5px 10px' }}
            >
              Send
            </button>
          </div>

          <div style={{ marginTop: '20px' }}>
            <h3>Messages:</h3>
            <div style={{ border: '1px solid #ccc', padding: '10px', maxHeight: '300px', overflowY: 'auto' }}>
              {messages.map((message, index) => (
                <div key={index} style={{ margin: '5px 0', padding: '5px', borderBottom: '1px solid #eee' }}>
                  {message}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;