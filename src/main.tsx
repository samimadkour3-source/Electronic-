import {createRoot} from 'react-dom/client';
import {registerSW} from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

declare global {
  interface Window {
    __PWA_OFFLINE_READY__?: boolean;
  }
}

registerSW({
  immediate: true,
  onOfflineReady() {
    window.__PWA_OFFLINE_READY__ = true;
    window.dispatchEvent(new CustomEvent('pwa-offline-ready'));
  },
  onNeedRefresh() {
    window.dispatchEvent(new CustomEvent('pwa-need-refresh'));
  },
});

createRoot(document.getElementById('root')!).render(<App />);
