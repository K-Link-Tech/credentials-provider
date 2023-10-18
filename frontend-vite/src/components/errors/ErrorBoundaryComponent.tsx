import React from "react";
import { FallbackProps } from "react-error-boundary";

export const DatabaseFetchingError: React.ComponentType<FallbackProps> = (props) => {
  const { error, resetErrorBoundary } = props;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-semibold text-red-600 mb-4">Error:</h1>
        <p className="text-2xl text-gray-300 font-semibold">{error.message}</p>
        <button className="mt-4 p-2 bg-blue-300 rounded-xl hover:bg-blue-500 active:bg-blue-600" onClick={resetErrorBoundary}>Reload Page</button>
      </div>
    </div>
  );
   
}
