import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'; // Import WalletModalProvider
import '@solana/wallet-adapter-react-ui/styles.css'; // Import the styles

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
   <WalletModalProvider> {/* Wrap your App with WalletModalProvider */}
      <App />
    </WalletModalProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
