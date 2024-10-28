"use client";

import React, { useState } from 'react';

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [content, setContent] = useState<string | ArrayBuffer | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
    setContent(null); // Clear content when a new file is selected
    setError(null); // Clear error
    setPdfUrl(null); // Clear PDF URL
  };

  const handleUpload = () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result;

      if (result !== undefined) {
        if (file.type.startsWith('image/')) {
          setContent(result as string); // Result is a Data URL for images
          setError(null);
        } else if (file.type === 'application/pdf') {
          const blob = new Blob([result as ArrayBuffer], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          setPdfUrl(url); // Set the URL for the PDF
          setContent(null); // Clear content for non-PDF files
          setError(null);
        } else if (typeof result === 'string') {
          setContent(result);
          setError(null);
        } else {
          setContent(null);
          setError('File content is not readable.');
        }
      }
    };

    if (file.type.startsWith('image/')) {
      reader.readAsDataURL(file); // Read as Data URL for images
    } else if (file.type === 'application/pdf') {
      reader.readAsArrayBuffer(file); // Read as ArrayBuffer for PDFs
    } else {
      reader.readAsText(file); // Read as text for other types
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={handleFileChange}
      />
      <button onClick={handleUpload}>Upload</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {file && (
        <div>
          <h4>Selected File: {file.name}</h4>
        </div>
      )}
      {content && !pdfUrl && (
        <div>
          <h3>File Content:</h3>
          {file?.type.startsWith('image/') ? (
            <img src={content as string} alt="Uploaded" style={{ maxWidth: '100%' }} />
          ) : (
            <pre>{content.toString()}</pre>
          )}
        </div>
      )}
      {pdfUrl && (
        <div>
          <h3>PDF Preview:</h3>
          <iframe
            src={pdfUrl}
            width="600"
            height="400"
            title="PDF Preview"
          />
          <button onClick={() => window.open(pdfUrl)}>Print PDF</button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;




// "use client";

// import React, { useState } from 'react';

// const FileUpload = () => {
//   const [file, setFile] = useState<File | null>(null);
//   const [content, setContent] = useState<string | ArrayBuffer | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = event.target.files?.[0];
//     if (selectedFile) {
//       setFile(selectedFile);
//       const reader = new FileReader();

//       reader.onload = (e) => {
//         const result = e.target?.result;

//         // Ensure result is defined before using it
//         if (result !== undefined) {
//           // Check the file type and read accordingly
//           if (selectedFile.type.startsWith('image/')) {
//             setContent(result as string); // Result is a Data URL for images
//             setError(null);
//           } else if (selectedFile.type === 'application/pdf') {
//             setContent(result); // For PDF, you may want to handle it differently
//             setError(null);
//           } else if (typeof result === 'string') {
//             setContent(result);
//             setError(null);
//           } else {
//             setContent(null);
//             setError('File content is not readable.');
//           }
//         }
//       };

//       if (selectedFile.type.startsWith('image/')) {
//         reader.readAsDataURL(selectedFile); // Read as Data URL for images
//       } else if (selectedFile.type === 'application/pdf') {
//         reader.readAsArrayBuffer(selectedFile); // Read as ArrayBuffer for PDFs
//       } else {
//         reader.readAsText(selectedFile); // Read as text for other types
//       }
//     } else {
//       setFile(null);
//     }
//   };

//   return (
//     <div>
//       <input
//         type="file"
//         onChange={handleFileChange}
//       />
//       {error && <div style={{ color: 'red' }}>{error}</div>}
//       {file && (
//         <div>
//           <h4>Selected File: {file.name}</h4>
//         </div>
//       )}
//       {content && (
//         <div>
//           <h3>File Content:</h3>
//           {file?.type.startsWith('image/') ? (
//             <img src={content as string} alt="Uploaded" style={{ maxWidth: '100%' }} />
//           ) : file?.type === 'application/pdf' ? (
//             <iframe src={URL.createObjectURL(new Blob([content as ArrayBuffer]))} width="600" height="400" />
//           ) : (
//             <pre>{content.toString()}</pre>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default FileUpload;


// "use client";

// import React, { useState } from 'react';

// const FileUpload = () => {
//   const [file, setFile] = useState<File | null>(null); // Keep track of the selected file
//   const [content, setContent] = useState<string | ArrayBuffer | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = event.target.files?.[0];
//     if (selectedFile) {
//       setFile(selectedFile); // Set the selected file
//       const reader = new FileReader();

//       reader.onload = (e) => {
//         const result = e.target?.result;

//         if (typeof result === 'string') {
//           setContent(result);
//           setError(null); // Clear previous error
//         } else {
//           setContent(null);
//           setError('File content is not readable.');
//         }
//       };

//       reader.readAsText(selectedFile); // Read as text
//     } else {
//       setFile(null); // Clear the file if none is selected
//     }
//   };

//   return (
//     <div>
//       <input
//         type="file"
//         onChange={handleFileChange}
//       />
//       {error && <div style={{ color: 'red' }}>{error}</div>}
//       {file && (
//         <div>
//           <h4>Selected File: {file.name}</h4>
//         </div>
//       )}
//       {content && (
//         <div>
//           <h3>File Content:</h3>
//           <pre>{content.toString()}</pre>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FileUpload;
