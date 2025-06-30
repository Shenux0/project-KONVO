import { useState, useRef, useEffect } from 'react';
import { IMAGE_FORMATS, BREAKPOINTS } from '@/constants';
import { formatFileSize, validateImageFile, convertImageFormat, downloadFile } from '@/utils/fileUtils';
import type { ImageFormat } from '@/types';
import './FileConverter.css';

interface FileConverterProps {
  file: File;
  darkMode: boolean;
  onRemoveFile: () => void;
}

export const FileConverter: React.FC<FileConverterProps> = ({ 
  file, 
  darkMode, 
  onRemoveFile 
}) => {
  const [outputFormat, setOutputFormat] = useState<ImageFormat | ''>('');
  const [isConverting, setIsConverting] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [error, setError] = useState<string | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const handleConvert = async () => {
    if (!outputFormat) return;

    // Validate file
    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError.message);
      return;
    }

    setIsConverting(true);
    setError(null);

    try {
      const result = await convertImageFormat(file, outputFormat);
      
      if (result.success && result.url) {
        const filename = `converted.${outputFormat}`;
        downloadFile(result.url, filename);
      } else {
        setError(result.error?.message || 'Conversion failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsConverting(false);
    }
  };

  const isMobile = windowWidth < BREAKPOINTS.MOBILE;

  return (
    <div className="file-converter">
      <div className={`file-converter__file-info ${isMobile ? 'file-converter__file-info--mobile' : ''}`}>
        <div className="file-converter__file-details">
          <img 
            src="/src/assets/img.png" 
            alt="File" 
            className="file-converter__file-icon" 
          />
          <span className="file-converter__file-name">
            {file.name}
            <span className="file-converter__file-size">
              ({formatFileSize(file.size)})
            </span>
          </span>
        </div>
        
        <div className="file-converter__format-selector">
          <span className="file-converter__format-label">Convert to</span>
          <div ref={dropdownRef} className="file-converter__dropdown">
            <button
              type="button"
              onClick={() => setDropdownOpen(open => !open)}
              className={`file-converter__dropdown-button ${darkMode ? 'file-converter__dropdown-button--dark' : 'file-converter__dropdown-button--light'}`}
            >
              {outputFormat || <span className="file-converter__placeholder">Select format</span>}
              <span className="file-converter__dropdown-arrow">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.293 8.293a1 1 0 011.414 0L10 9.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z" fill="currentColor" />
                </svg>
              </span>
            </button>
            
            {dropdownOpen && (
              <div className={`file-converter__dropdown-menu ${darkMode ? 'file-converter__dropdown-menu--dark' : 'file-converter__dropdown-menu--light'}`}>
                {IMAGE_FORMATS.map((format) => (
                  <div
                    key={format}
                    onClick={() => { setOutputFormat(format as ImageFormat); setDropdownOpen(false); }}
                    className={`file-converter__dropdown-item ${outputFormat === format ? 'file-converter__dropdown-item--selected' : ''}`}
                    onMouseDown={e => e.preventDefault()}
                  >
                    {format}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <button
          onClick={onRemoveFile}
          className="file-converter__remove-button"
          title="Remove file"
          aria-label="Remove file"
        >
          ✕
        </button>
      </div>

      {error && (
        <div className="file-converter__error">
          {error}
        </div>
      )}

      <div className={`file-converter__actions ${isMobile ? 'file-converter__actions--mobile' : ''}`}>
        <button
          className={`file-converter__convert-button ${outputFormat ? 'file-converter__convert-button--active' : 'file-converter__convert-button--disabled'}`}
          onClick={handleConvert}
          disabled={!outputFormat || isConverting}
        >
          {isConverting ? 'Converting...' : 'Convert Now'}
        </button>
      </div>
    </div>
  );
}; 