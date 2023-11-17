import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  QueryClient,
  QueryClientConfig,
  QueryClientProvider,
} from "@tanstack/react-query";

import Dashboard from './pages/Dashboard';
import Layout from './layout/Layout';
import Login from "./pages/Login.tsx";
import { ErrorBoundary } from 'react-error-boundary';
import { DatabaseFetchingError } from './components/errors/ErrorBoundaryComponent';
import Project from "./pages/Project.tsx";
import NewProject from "./pages/NewProject.tsx";
import Environment from "./pages/Environment.tsx";
import NewEnvironment from "./pages/NewEnvironment.tsx";

const config: QueryClientConfig = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
};

const queryClient = new QueryClient(config);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <Layout>
        <ErrorBoundary
          FallbackComponent={DatabaseFetchingError}
          onError={() => {
            console.log("Error found");
          }}
        >
          <Routes>
            <Route path="/" element={<App />}>
              <Route path="/home" element={<Dashboard />} />
              <Route path="/home/proj/:projId" element={<Project />} />
              <Route path="/home/proj/create" element={<NewProject />} />
              <Route path="/home/env/:environmentId" element={<Environment />} />
              <Route path="/home/env/create" element={<NewEnvironment />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Login />} />
          </Routes>
        </ErrorBoundary>
      </Layout>
    </QueryClientProvider>
  </BrowserRouter>
);
