
import React, { useState, useCallback, useMemo } from 'react';
import QRCode from 'react-qr-code';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, Download, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SplashCursor from '@/components/SplashCursor';

const Index = () => {
  const [url, setUrl] = useState('');
  const [qrValue, setQrValue] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Memoize the QR component to prevent unnecessary re-renders
  const qrComponent = useMemo(() => {
    if (!qrValue) return null;
    
    return (
      <QRCode
        id="qr-code"
        value={qrValue}
        size={256}
        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        viewBox="0 0 256 256"
      />
    );
  }, [qrValue]);

  const generateQR = useCallback(() => {
    if (url.trim()) {
      setQrValue(url);
      toast({
        title: "QR Code Generated!",
        description: "Your QR code has been generated successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: "Please enter a valid URL to generate QR code.",
        variant: "destructive",
      });
    }
  }, [url, toast]);

  const downloadQR = useCallback(() => {
    const svg = document.getElementById('qr-code');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx!.fillStyle = 'white';
        ctx!.fillRect(0, 0, canvas.width, canvas.height);
        ctx!.drawImage(img, 0, 0);
        
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = 'qr-code.png';
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      img.src = url;
    }
  }, []);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "URL copied to clipboard.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  }, [url, toast]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      generateQR();
    }
  }, [generateQR]);

  return (
    <div className="min-h-screen bg-gray-900 text-green-400 p-4 relative overflow-hidden">
      <SplashCursor />
      
      {/* Aesthetic background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-600/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-green-500/2 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <QrCode className="w-8 h-8 text-green-400 animate-pulse" />
            <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">
              QR Generator
            </h1>
          </div>
          <p className="text-gray-400">
            Generate QR codes instantly from any URL or text
          </p>
        </div>

        <Card className="bg-gray-800/80 backdrop-blur-sm border-gray-700 mb-8 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              Enter URL or Text
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="https://example.com or any text..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 bg-gray-700/80 backdrop-blur-sm border-gray-600 text-white placeholder:text-gray-400 focus:border-green-400 focus:ring-green-400 transition-all duration-200"
                onKeyPress={handleKeyPress}
              />
              <Button
                onClick={copyToClipboard}
                variant="outline"
                size="icon"
                className="bg-gray-700/80 backdrop-blur-sm border-gray-600 text-green-400 hover:bg-gray-600 hover:text-green-300 transition-all duration-200"
                disabled={!url}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <Button
              onClick={generateQR}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold transition-all duration-200 transform hover:scale-[1.02]"
              disabled={!url.trim()}
            >
              Generate QR Code
            </Button>
          </CardContent>
        </Card>

        {qrValue && (
          <Card className="bg-gray-800/80 backdrop-blur-sm border-gray-700 shadow-2xl animate-fade-in">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center justify-between">
                <span>Your QR Code</span>
                <Button
                  onClick={downloadQR}
                  variant="outline"
                  size="sm"
                  className="bg-gray-700/80 backdrop-blur-sm border-gray-600 text-green-400 hover:bg-gray-600 hover:text-green-300 transition-all duration-200"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center p-6 bg-white rounded-lg shadow-inner">
                {qrComponent}
              </div>
              <div className="mt-4 p-3 bg-gray-700/60 backdrop-blur-sm rounded-lg border border-gray-600/50">
                <p className="text-sm text-gray-300 break-all">
                  <span className="text-green-400 font-semibold">Generated from:</span> {qrValue}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
