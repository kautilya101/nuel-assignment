import React from "react";

export default function ErrorData({ errorData }) {
  return (
    <div className="p-4 bg-red-100 text-red-700 rounded-md font-mono text-sm overflow-auto">
      <strong>Error:</strong>
      <pre className="mt-2 whitespace-pre-wrap break-words">
        {JSON.stringify(errorData, null, 2)}
      </pre>
    </div>
  );
}
