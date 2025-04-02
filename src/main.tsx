import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter, Route, Routes } from 'react-router';
import Pomodoro from './routes/pomodoro.tsx';
import { Header } from './components/header.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Header />
        <main className="flex-1 container py-8">
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/pomodoro" element={<Pomodoro />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  </StrictMode>
);
