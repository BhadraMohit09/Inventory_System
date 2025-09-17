import { createContext, useContext, useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

const ToastContext = createContext();

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, variant = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000); // auto hide after 4s
  };

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <ToastContainer position="top-end" className="p-3">
        {toasts.map((t) => (
          <Toast key={t.id} bg={t.variant} autohide>
            <Toast.Body className="text-white">{t.message}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
}
