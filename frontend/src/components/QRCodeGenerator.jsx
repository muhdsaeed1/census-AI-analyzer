import React, { useState } from 'react';

const QRCodeGenerator = () => {
  const [data, setData] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const generateQRCode = () => {
    if (data) {
      setQrCodeUrl(`/api/qr?data=${encodeURIComponent(data)}`);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">QR Code Generator</h2>
      <div className="flex items-center mb-4">
        <input
          type="text"
          value={data}
          onChange={(e) => setData(e.target.value)}
          placeholder="Enter data for QR code"
          className="border p-2 rounded-l-md w-full"
        />
        <button
          onClick={generateQRCode}
          className="bg-blue-500 text-white p-2 rounded-r-md"
        >
          Generate
        </button>
      </div>
      {qrCodeUrl && (
        <div className="mt-4">
          <img src={qrCodeUrl} alt="QR Code" />
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator;