import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DashboardPage from './pages/DashboardPage';
import DiagnosticPage from './pages/DiagnosticPage';
import ResultsPage from './pages/ResultsPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/diagnostic/:sessionId" element={<DiagnosticPage />} />
          <Route path="/results/:sessionId" element={<ResultsPage />} />
          
          {/* Default Route */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
