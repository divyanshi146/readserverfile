"use client";

import React, { useState } from 'react';

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null); // Keep track of the selected file
  const [content, setContent] = useState<string | ArrayBuffer | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile); // Set the selected file
      const reader = new FileReader();

      reader.onload = (e) => {
        const result = e.target?.result;

        if (typeof result === 'string') {
          setContent(result);
          setError(null); // Clear previous error
        } else {
          setContent(null);
          setError('File content is not readable.');
        }
      };

      reader.readAsText(selectedFile); // Read as text
    } else {
      setFile(null); // Clear the file if none is selected
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={handleFileChange}
      />
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {file && (
        <div>
          <h4>Selected File: {file.name}</h4>
        </div>
      )}
      {content && (
        <div>
          <h3>File Content:</h3>
          <pre>{content.toString()}</pre>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
