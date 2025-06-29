import React, { useState, useRef, useEffect } from 'react';
import uploadWhite from './assets/uploadwhite.png';
import uploaddark from './assets/uploaddark.png';
import darkLogo from './assets/darksidelogo.png';
import lightLogo from './assets/lightsidelogo.png';
import imgIcon from './assets/img.png';
import { FaMoon, FaSun, FaFileImage } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const DARK_COLOR = '#0b1531';
const LIGHT_COLOR = '#ffffff';

const IMAGE_FORMATS = [
  'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'ico', 'tif', 'tiff'
];

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef();
  const [outputFormat, setOutputFormat] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const [splash, setSplash] = useState({ show: false, x: 0, y: 0, toDark: false });
  const headerRef = useRef();
  const themeBtnRef = useRef();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Splash animation handler
  const handleThemeToggle = () => {
    if (!themeBtnRef.current) {
      setDarkMode(dm => !dm);
      return;
    }
    const btnRect = themeBtnRef.current.getBoundingClientRect();
    const rootRect = document.body.getBoundingClientRect();
    // Center of the button relative to viewport
    const x = btnRect.left + btnRect.width / 2 - rootRect.left;
    const y = btnRect.top + btnRect.height / 2 - rootRect.top;
    setSplash({ show: true, x, y, toDark: !darkMode });
  };

  // Splash component
  const Splash = ({ x, y, toDark, onComplete }) => {
    // Calculate max radius needed to cover the screen
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const maxRadius = Math.sqrt(vw * vw + vh * vh);
    return (
      <motion.div
        initial={{
          scale: 0,
          opacity: 0.7,
          background: toDark ? '#0b1531' : '#fff',
        }}
        animate={{
          scale: maxRadius / 50, // 50 is the initial size
          opacity: 1,
          background: toDark ? '#0b1531' : '#fff',
        }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        style={{
          position: 'fixed',
          left: x - 50,
          top: y - 50,
          width: 100,
          height: 100,
          borderRadius: '50%',
          zIndex: 9999,
          pointerEvents: 'none',
        }}
        onAnimationComplete={onComplete}
      />
    );
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setOutputFormat('');
  };

  const handleConvert = async () => {
    if (!selectedFile || !outputFormat) return;
    setIsConverting(true);
    const img = new window.Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d').drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `converted.${outputFormat}`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
          }
        }, `image/${outputFormat}`);
        setIsConverting(false);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(selectedFile);
  };

  return (
    <div style={{ minHeight: '100vh', background: darkMode ? DARK_COLOR : LIGHT_COLOR, color: darkMode ? '#fff' : '#222', transition: 'background 0.3s', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <AnimatePresence>
        {splash.show && (
          <Splash
            x={splash.x}
            y={splash.y}
            toDark={splash.toDark}
            onComplete={() => {
              setSplash(s => {
                if (s.toDark !== darkMode) setDarkMode(s.toDark);
                return { ...s, show: false };
              });
            }}
          />
        )}
      </AnimatePresence>
      <header ref={headerRef} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem 2.5rem 0.5rem 2.5rem', minHeight: 80 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src={darkMode ? darkLogo : lightLogo} alt="KONVO Logo" style={{ width: 43, height: 43, objectFit: 'contain', display: 'block' }} />
          <div style={{ fontWeight: 700, fontSize: '2rem', letterSpacing: '2px', color: darkMode ? '#fff' : '#0b1531', lineHeight: 1, display: 'flex', alignItems: 'center' }}>KONVO</div>
        </div>
        <button
          aria-label="Toggle theme"
          ref={themeBtnRef}
          onClick={handleThemeToggle}
          style={{
            border: 'none',
            background: darkMode ? '#232b3e' : '#e0e4ef',
            borderRadius: '50%',
            width: 28,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: darkMode ? '0 2px 8px #0002' : '0 2px 8px #0001',
            transition: 'background 0.2s',
            fontSize: 15,
            padding: 0,
            color: darkMode ? '#fff' : '#0b1531',
          }}
        >
          {darkMode ? <FaMoon /> : <FaSun />}
        </button>
      </header>
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', minHeight: 0, marginTop: '0' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            style={{ fontSize: '3.2rem', fontWeight: 600, margin: 0, color: darkMode ? '#fff' : '#0b1531', letterSpacing: '-1px', lineHeight: 1.1 }}
          >
            Free Unlimited Image Converter
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1], delay: 0.15 }}
            style={{ maxWidth: 800, margin: '2.2rem auto 0', fontSize: '0.9rem', color: darkMode ? '#b0b8c9' : '#333', lineHeight: 1.5, fontWeight: 400 }}
          >
            Introducing KONVO – your go-to online tool for unlimited and free image conversion, all<br/> processed <span style={{ color: '#4ea1f7', textDecoration: 'underline' }}>locally on your device for enhanced privacy and security</span>.
            Easily convert images without any restrictions. Start converting now and streamline your content effortlessly with KONVO!
          </motion.p>
        </div>
        <section
          style={{
            margin: '0 auto',
            padding: selectedFile ? 0 : '4rem 2rem',
            border: selectedFile ? 'none' : `2px dashed ${darkMode ? '#2a3553' : '#bbb'}`,
            borderRadius: 18,
            background: selectedFile ? 'transparent' : (darkMode ? '#101a36' : '#f7f8fa'),
            maxWidth: 1200,
            width: '100%',
            minHeight: selectedFile ? 0 : 180,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
            transition: 'padding 0.2s, min-height 0.2s',
          }}
          onDrop={e => { e.preventDefault(); if (e.dataTransfer.files && e.dataTransfer.files[0]) { setSelectedFile(e.dataTransfer.files[0]); } }}
          onDragOver={e => e.preventDefault()}
        >
          <input
            id="file-input"
            type="file"
            style={{ display: 'none' }}
            ref={fileInputRef}
            accept={IMAGE_FORMATS.map(f => '.' + f).join(',')}
            onChange={handleFileChange}
          />
          {!selectedFile && (
            <label htmlFor="file-input" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: 180, cursor: 'pointer' }}>
              <img src={darkMode ? uploadWhite : uploaddark} alt="Upload" style={{ width: 80, height: 80, marginBottom: 18, opacity: 0.85 }} />
              <div style={{ fontSize: '1.35rem', fontWeight: 500, color: darkMode ? '#b0b8c9' : '#222', textAlign: 'center', marginTop: 10 }}>Click, or drop your image files here</div>
            </label>
          )}
          {selectedFile && (
            <>
              <div style={{
                margin: '1.5rem 0 0 0',
                display: windowWidth < 600 ? 'block' : 'flex',
                alignItems: 'center',
                background: 'none',
                border: `1px solid ${darkMode ? '#232b3e' : '#bbb'}`,
                borderRadius: 16,
                padding: windowWidth < 600 ? '0.7rem 0.5rem' : '0.7rem 1.2rem',
                width: '100%',
                maxWidth: 800,
                minWidth: windowWidth < 600 ? 'unset' : 700,
                boxSizing: 'border-box',
                boxShadow: 'none',
                fontSize: '0.9rem',
                justifyContent: 'space-between',
                flexDirection: windowWidth < 600 ? 'column' : 'row',
                gap: windowWidth < 600 ? 10 : 0,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <img src={imgIcon} alt="File" style={{ width: 28, height: 28, flexShrink: 0, display: 'block' }} />
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: darkMode ? '#fff' : '#222', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200, display: 'flex', alignItems: 'center', gap: 6 }}>
                    {selectedFile.name}
                    <span style={{ color: darkMode ? '#b0b8c9' : '#666', fontWeight: 400, fontSize: '0.9rem', marginLeft: 8, whiteSpace: 'nowrap' }}>
                      ({(selectedFile.size / (1024 * 1024)) > 1 ? (selectedFile.size / (1024 * 1024)).toFixed(2) + ' MB' : (selectedFile.size / 1024).toFixed(2) + ' KB'})
                    </span>
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span style={{ fontWeight: 500, color: darkMode ? '#b0b8c9' : '#222', fontSize: '0.9rem', minWidth: 90 }}>Convert to</span>
                  <div ref={dropdownRef} style={{ position: 'relative' }}>
                    <button
                      type="button"
                      onClick={() => setDropdownOpen((open) => !open)}
                      style={{
                        padding: '0.5rem 1.2rem',
                        borderRadius: 8,
                        fontSize: '0.9rem',
                        minWidth: 120,
                        background: 'transparent',
                        color: darkMode ? '#fff' : '#222',
                        border: `1px solid ${darkMode ? '#232b3e' : '#bbb'}`,
                        outline: 'none',
                        boxShadow: 'none',
                        appearance: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        position: 'relative',
                      }}
                    >
                      {outputFormat || <span style={{ color: darkMode ? '#b0b8c9' : '#888' }}>Select format</span>}
                      <span style={{ marginLeft: 8, display: 'flex', alignItems: 'center' }}>
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7.293 8.293a1 1 0 011.414 0L10 9.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z" fill={darkMode ? '#b0b8c9' : '#333'} />
                        </svg>
                      </span>
                    </button>
                    {dropdownOpen && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '110%',
                          left: 0,
                          zIndex: 10,
                          background: darkMode ? '#1a2a4a' : '#fff',
                          color: darkMode ? '#fff' : '#222',
                          border: `1px solid ${darkMode ? '#232b3e' : '#bbb'}`,
                          borderRadius: 10,
                          boxShadow: '0 4px 24px 0 rgba(0,0,0,0.18)',
                          padding: '0.5rem 0.7rem',
                          minWidth: 220,
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '0.2rem 1.5rem',
                        }}
                      >
                        {IMAGE_FORMATS.map((opt) => (
                          <div
                            key={opt}
                            onClick={() => { setOutputFormat(opt); setDropdownOpen(false); }}
                            style={{
                              padding: '0.35rem 0.7rem',
                              borderRadius: 6,
                              background: outputFormat === opt ? (darkMode ? '#232b3e' : '#e0e4ef') : 'none',
                              color: outputFormat === opt ? (darkMode ? '#fff' : '#222') : (darkMode ? '#fff' : '#222'),
                              fontWeight: outputFormat === opt ? 600 : 400,
                              cursor: 'pointer',
                              textAlign: 'left',
                              fontSize: '0.95em',
                              transition: 'background 0.15s',
                            }}
                            onMouseDown={e => e.preventDefault()}
                          >
                            {opt}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleRemoveFile}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: darkMode ? '#fff' : '#222',
                    fontSize: 14,
                    cursor: 'pointer',
                    marginLeft: 12
                  }}
                  title="Remove file"
                >
                  ✕
                </button>
              </div>
              <div style={{ width: '100%', maxWidth: 700, display: 'flex', flexDirection: windowWidth < 600 ? 'column' : 'row', justifyContent: windowWidth < 600 ? 'center' : 'flex-start', alignItems: windowWidth < 600 ? 'stretch' : 'center', marginTop: 10, marginLeft: windowWidth < 600 ? 0 : 1200, gap: windowWidth < 600 ? 10 : 0 }}>
                <button
                  style={{
                    padding: '0.7rem 2.2rem',
                    borderRadius: 14,
                    fontSize: '0.8rem',
                    background: outputFormat ? (darkMode ? '#fff' : '#181f2e') : '#888c99',
                    color: outputFormat ? (darkMode ? '#181f2e' : '#fff') : '#181f2e',
                    border: 'none',
                    cursor: outputFormat ? 'pointer' : 'not-allowed',
                    fontWeight: 700,
                    boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
                    opacity: outputFormat ? 1 : 0.7,
                    transition: 'background 0.2s, color 0.2s, opacity 0.2s',
                  }}
                  onClick={handleConvert}
                  disabled={!outputFormat || isConverting}
                >
                  {isConverting ? 'Converting...' : 'Convert Now'}
                </button>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
} 