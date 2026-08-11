import React from "react";

interface FeatureGuardProps {
  featureName: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function FeatureGuard({
  featureName,
  fallback = null,
  children,
}: FeatureGuardProps) {
  // Simple mock implementation of feature flag registration
  const isFeatureEnabled = true; // By default enabled

  if (!isFeatureEnabled) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

export default FeatureGuard;
