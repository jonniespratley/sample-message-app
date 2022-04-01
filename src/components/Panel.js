import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./ErrorFallback";


export const Panel = ({ title, children }) => (
  <div className="panel">
    {title && <h2>{title}</h2>}
    <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>
  </div>
);
