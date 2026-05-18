'use client';

import { Facebook, Twitter, Link as LinkIcon, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ShareButtons() {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUrl(window.location.href);
    }
  }, []);

  const handleFacebookShare = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      '_blank'
    );
  };

  const handleTwitterShare = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
      '_blank'
    );
  };

  const handleCopyLink = () => {
    if (!url) return;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Chia sẻ:</span>
      <div className="flex gap-2">
        <button 
          onClick={handleFacebookShare}
          className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
          title="Chia sẻ qua Facebook"
        >
          <Facebook className="w-5 h-5" />
        </button>
        <button 
          onClick={handleTwitterShare}
          className="w-10 h-10 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all cursor-pointer"
          title="Chia sẻ qua X"
        >
          <Twitter className="w-5 h-5" />
        </button>
        <button 
          onClick={handleCopyLink}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            copied ? 'bg-green-600 text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-500 hover:text-white'
          }`}
          title="Sao chép đường dẫn"
        >
          {copied ? <Check className="w-5 h-5" /> : <LinkIcon className="w-5 h-5" />}
        </button>
      </div>
      {copied && (
        <span className="text-xs font-bold text-green-600 animate-in fade-in duration-300">
          Đã sao chép!
        </span>
      )}
    </div>
  );
}
