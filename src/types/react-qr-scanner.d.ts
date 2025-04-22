declare module 'react-qr-scanner' {
  import React from 'react';

  interface QrReaderProps {
    delay?: number;
    style?: React.CSSProperties;
    onError: (err: any) => void;
    onScan: (data: { text: string } | null) => void;
    constraints?: MediaStreamConstraints;
    resolution?: number;
    facingMode?: string;
    className?: string;
  }

  const QrReader: React.ComponentType<QrReaderProps>;
  
  export default QrReader;
} 