import { createContext, useContext, useState } from "react";
import "./Notification.css"; // we'll style it separately

const NotificationContext = createContext();

export function useNotification() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const [messages, setMessages] = useState([]);

  const notify = (text, type = "success") => {
    const id = Date.now();
    setMessages((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    }, 4000);
  };

  return (
    <NotificationContext.Provider value={notify}>
      {children}
      <div className="notification-container">
        {messages.map((msg) => (
          <div key={msg.id} className={`notification ${msg.type}`}>
            {msg.text}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}
