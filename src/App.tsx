import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/Header';
import { SplashAnimation } from '@/components/SplashAnimation';
import { FileUpload } from '@/components/FileUpload';
import { FileConverter } from '@/components/FileConverter';
import { useTheme } from '@/hooks/useTheme';
import './App.css';

export default function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { darkMode, splash, toggleTheme, completeSplashAnimation } = useTheme();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
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
            Free Unlimited Image Converter
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1], delay: 0.15 }}
            className="app__description"
          >
            Introducing KONVO – your go-to online tool for unlimited and free image conversion, all<br/> 
            processed <span className="app__highlight">locally on your device for enhanced privacy and security</span>.
            Easily convert images without any restrictions. Start converting now and streamline your content effortlessly with KONVO!
          </motion.p>
        </div>

        {!selectedFile ? (
          <FileUpload 
            darkMode={darkMode} 
            onFileSelect={handleFileSelect} 
          />
        ) : (
          <div className="app__converter-container">
            <FileConverter 
              file={selectedFile}
              darkMode={darkMode}
              onRemoveFile={handleRemoveFile}
            />
          </div>
        )}
      </main>
    </div>
  );
} 