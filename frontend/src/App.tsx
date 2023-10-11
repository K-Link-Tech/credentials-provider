import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import Register from './pages/Register';
import { DatabaseFetchingError } from './components/errors/ErrorBoundaryComponent';
import Layout from './layout/Layout';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';

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
          <Route path="/register" element={<Register />} />
        </Routes>
      </ErrorBoundary>
    </Layout>
  );
};

export default App;
