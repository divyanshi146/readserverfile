"use client";

import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [content, setContent] = useState<string | ArrayBuffer | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [excelData, setExcelData] = useState<any[][]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
    setContent(null);
    setError(null);
    setPdfUrl(null);
    setExcelData([]); // Clear previous Excel data
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
          setContent(result as string); // Data URL for images
          setError(null);
        } else if (file.type === 'application/pdf') {
          const blob = new Blob([result as ArrayBuffer], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          setPdfUrl(url);
          setContent(null);
          setError(null);
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                   file.type === 'application/vnd.ms-excel') {
          // Handle Excel files using SheetJS
          const data = new Uint8Array(result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0]; // Get the first sheet name
          const worksheet = workbook.Sheets[firstSheetName]; // Get the first sheet
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Convert to JSON format
          setExcelData(jsonData as any[][]); // Set the Excel data with explicit typing
          setContent(null);
          setError(null);
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
                   file.type === 'application/msword') {
          const blob = new Blob([result as ArrayBuffer], { type: file.type });
          const url = URL.createObjectURL(blob);
          setContent(null);
          setPdfUrl(url);
          setError(null);
        } else if (file.type === 'text/plain') {
          // Handle Notepad (.txt) files
          setContent(result as string);
          setError(null);
        } else if (file.type === 'application/xml' || file.type === 'text/xml') {
          // Handle XML files
          setContent(result as string);
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
    } else if (file.type.startsWith('application/vnd.openxmlformats-officedocument') || 
               file.type.startsWith('application/vnd.ms-excel')) {
      reader.readAsArrayBuffer(file); // Read as ArrayBuffer for Excel and Word
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
          ) : file?.type.startsWith('application/vnd.openxmlformats-officedocument') ? (
            <pre>{content.toString()}</pre> // Display for Excel
          ) : (
            <pre>{content.toString()}</pre> // Display text for Notepad and XML
          )}
        </div>
      )}
      {excelData.length > 0 && (
        <div>
          <h3>Excel Data:</h3>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <tbody>
              {excelData.map((row: any[], rowIndex: number) => (
                <tr key={rowIndex}>
                  {row.map((cell: any, cellIndex: number) => (
                    <td key={cellIndex} style={{ border: '1px solid black', padding: '8px' }}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {pdfUrl && (
        <div>
          <h3>Preview:</h3>
          <iframe
            src={pdfUrl}
            width="600"
            height="400"
            title="Document Preview"
          />
          <button onClick={() => window.open(pdfUrl)}>Print Document</button>
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
