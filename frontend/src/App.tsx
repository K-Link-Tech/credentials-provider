import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import Register from "./pages/Register";
import { DatabaseFetchingError } from "./components/errors/ErrorBoundaryComponent";

const App: React.FC = () => {
  return (
    <main className="App">
      <ErrorBoundary
        FallbackComponent={DatabaseFetchingError}
        onError={() => {
          console.log("Error found");
        }}
      >
        <Register />
      </ErrorBoundary>
    </main>
  );
};

export default App;
