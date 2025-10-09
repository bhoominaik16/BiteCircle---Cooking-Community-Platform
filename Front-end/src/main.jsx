// Front-end/src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { ParallaxProvider } from 'react-scroll-parallax';

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <StrictMode>
            <Provider store={store}>
                <ParallaxProvider>
                    <App />
                </ParallaxProvider>
            </Provider>
        </StrictMode>
    </BrowserRouter>
);