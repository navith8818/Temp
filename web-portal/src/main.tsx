import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import { OrderProvider } from './context/OrderContext';
import { HostingSetup } from './pages/order/HostingSetup';
import { DomainConfig } from './pages/order/DomainConfig';
import { EmailConfig } from './pages/order/EmailConfig';
import { AutoBackupConfig } from './pages/order/AutoBackupConfig';
import { OrderReview } from './pages/order/OrderReview';
import { Checkout } from './pages/order/Checkout';
import { Provisioning } from './pages/order/Provisioning';
import { ActivationSuccess } from './pages/order/ActivationSuccess';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { PricingPage } from './pages/PricingPage';
import './index.css';

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <BrowserRouter>
      <OrderProvider>
        <Routes>
          {/* Main Website Landing Page */}
          <Route path="/" element={<App />} />

          {/* Pricing Page */}
          <Route path="/pricing" element={<PricingPage />} />

          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Hosting Order Workflow */}
          <Route path="/order/setup" element={<HostingSetup />} />
          <Route path="/order/domain" element={<DomainConfig />} />
          <Route path="/order/email" element={<EmailConfig />} />
          <Route path="/order/backup" element={<AutoBackupConfig />} />
          <Route path="/order/review" element={<OrderReview />} />
          <Route path="/order/checkout" element={<Checkout />} />
          <Route path="/order/processing" element={<Provisioning />} />
          <Route path="/order/success" element={<ActivationSuccess />} />

          

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </OrderProvider>
    </BrowserRouter>
  </StrictMode>,
);
