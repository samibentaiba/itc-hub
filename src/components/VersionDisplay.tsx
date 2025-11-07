"use client";

import React from "react";

export function VersionDisplay() {
  const version = process.env.NEXT_PUBLIC_APP_VERSION || "N/A";
  const state = process.env.state || "local";
  const repositoryUrl = "https://github.com/samibentaiba/itc-hub"; // Assuming this is the repository URL

  return (
    <div className="fixed bottom-2 right-2 text-xs text-gray-500">
      {state}:{" "}
      <a
        href={`${repositoryUrl}/tree/${state}`}
        target="_blank"
        rel="noopener noreferrer"
        className="underline"
      >
        {version}
      </a>
    </div>
  );
}
