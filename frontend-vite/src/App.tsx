import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { DatabaseFetchingError } from './components/errors/ErrorBoundaryComponent';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Layout from './layout/Layout';

const App: React.FC = () => {
  return (
    <Layout>
      <ErrorBoundary
        FallbackComponent={DatabaseFetchingError}
        onError={() => {
          console.log('Error found');
        }}
      >
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Dashboard />} />
        </Routes>
      </ErrorBoundary>
    </Layout>
  );
};

export default App;
