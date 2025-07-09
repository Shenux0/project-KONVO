import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/Header';
import { SplashAnimation } from '@/components/SplashAnimation';
import { FileUpload } from '@/components/FileUpload';
import { FileConverter } from '@/components/FileConverter';
import { AudioConverter } from '@/components/AudioConverter';
import { VideoConverter } from '@/components/VideoConverter';
import { useTheme } from '@/hooks/useTheme';
import './App.css';
import { AUDIO_FORMATS, IMAGE_FORMATS, VIDEO_FORMATS } from '@/constants';

export default function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<'image' | 'audio' | 'video' | null>(null);
  const { darkMode, splash, toggleTheme, completeSplashAnimation } = useTheme();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    // Detect file type by MIME
    if (file.type.startsWith('image/')) {
      setFileType('image');
    } else if (file.type.startsWith('audio/')) {
      setFileType('audio');
    } else if (file.type.startsWith('video/')) {
      setFileType('video');
    } else {
      // fallback: check extension
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext && IMAGE_FORMATS.includes(ext)) setFileType('image');
      else if (ext && AUDIO_FORMATS.includes(ext)) setFileType('audio');
      else if (ext && VIDEO_FORMATS.includes(ext)) setFileType('video');
      else setFileType(null);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFileType(null);
  };

  return (
    <div 
      className={`app ${darkMode ? 'app--dark' : 'app--light'}`}
      data-theme={darkMode ? 'dark' : 'light'}
    >
      <AnimatePresence>
        {splash.show && (
          <SplashAnimation
            splash={splash}
            onComplete={completeSplashAnimation}
          />
        )}
      </AnimatePresence>

      <Header 
        darkMode={darkMode} 
        onThemeToggle={toggleTheme} 
      />

      <main className="app__main">
        <div className="app__hero">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            className="app__title"
          >
            Free Unlimited File Converter
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1], delay: 0.15 }}
            className="app__description"
          >
            Introducing <strong>KONVO</strong> – your go-to online tool for unlimited and free multimedia conversion, all <br/>processed <span className="app__highlight">locally on your device for enhanced privacy and security</span>.Easily convert images,<br/> audio, and videos without any restrictions.Start converting now and streamline your content<br/> effortlessly with <strong>KONVO</strong>!
          </motion.p>
        </div>

        {!selectedFile ? (
          <FileUpload 
            darkMode={darkMode} 
            onFileSelect={handleFileSelect} 
          />
        ) : (
          <div className="app__converter-container">
            {fileType === 'image' && (
              <FileConverter 
                file={selectedFile}
                darkMode={darkMode}
                onRemoveFile={handleRemoveFile}
              />
            )}
            {fileType === 'audio' && (
              <AudioConverter file={selectedFile} onRemoveFile={handleRemoveFile} darkMode={darkMode} />
            )}
            {fileType === 'video' && (
              <VideoConverter file={selectedFile} onRemoveFile={handleRemoveFile} darkMode={darkMode} />
            )}
          </div>
        )}
      </main>
      <footer className="app__footer">
        <span>© 2025 KONVO. All rights reserved.</span>
        <a
          href="https://github.com/Shenux0"
          target="_blank"
          rel="noopener noreferrer"
          className="github-btn-corner"
          aria-label="GitHub Profile"
        >
          <img src={darkMode ? "/Githubdarkside.png" : "/GithubLightside.png"} alt="GitHub" height={28} />
        </a>
      </footer>
    </div>
  );
} 