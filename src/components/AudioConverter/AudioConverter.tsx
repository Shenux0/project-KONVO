import { useState, useRef, useEffect } from 'react';
import { AUDIO_FORMATS } from '@/constants';
// @ts-ignore
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import '../FileConverter/FileConverter.css';

interface AudioConverterProps {
  file: File;
  onRemoveFile: () => void;
  darkMode?: boolean;
}

export const AudioConverter: React.FC<AudioConverterProps> = ({ file, onRemoveFile, darkMode }) => {
  const [outputFormat, setOutputFormat] = useState<string>('');
  const [isConverting, setIsConverting] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [progress, setProgress] = useState(0);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const ffmpegRef = useRef<any>(null);

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

  useEffect(() => {
    setConvertedUrl(null);
    setError(null);
    setProgress(0);
    setOutputFormat('');
  }, [file]);

  const handleConvert = async () => {
    if (!outputFormat) return;
    setIsConverting(true);
    setError(null);
    setProgress(0);
    setConvertedUrl(null);
    try {
      if (!ffmpegRef.current) {
        ffmpegRef.current = createFFmpeg({ 
          log: true,
          corePath: '/ffmpeg/ffmpeg-core.js',
          progress: ({ ratio }: { ratio: number }) => setProgress(ratio)
        });
        await ffmpegRef.current.load();
      }
      const inputName = file.name;
      const outputName = inputName.replace(/\.[^.]+$/, '') + '.' + outputFormat;
      ffmpegRef.current.FS('writeFile', inputName, await fetchFile(file));
      await ffmpegRef.current.run('-i', inputName, outputName);
      const data = ffmpegRef.current.FS('readFile', outputName);
      setConvertedUrl(URL.createObjectURL(new Blob([data.buffer], { type: `audio/${outputFormat}` })));
    } catch (err) {
      setError('Conversion failed. ' + (err instanceof Error ? err.message : String(err)));
      console.error('FFmpeg conversion error:', err);
    } finally {
      setIsConverting(false);
    }
  };

  const isMobile = windowWidth < 600;

  return (
    <div className="file-converter">
      <div className={`file-converter__file-info ${isMobile ? 'file-converter__file-info--mobile' : ''}`}>
        <div className="file-converter__file-details">
          <img 
            src="/img.png" 
            alt="File" 
            className="file-converter__file-icon" 
          />
          <span className="file-converter__file-name">
            {file.name}
            <span className="file-converter__file-size">
              ({(file.size / 1024).toFixed(1)} KB)
            </span>
          </span>
        </div>
        <div className="file-converter__format-selector">
          <span className="file-converter__format-label">Convert to</span>
          <div ref={dropdownRef} className="file-converter__dropdown">
            <button
              type="button"
              onClick={() => setDropdownOpen(open => !open)}
              className={`file-converter__dropdown-button`}
            >
              {outputFormat || <span className="file-converter__placeholder">Select format</span>}
              <span className="file-converter__dropdown-arrow">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.293 8.293a1 1 0 011.414 0L10 9.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z" fill="currentColor" />
                </svg>
              </span>
            </button>
            {dropdownOpen && (
              <div className={`file-converter__dropdown-menu file-converter__dropdown-menu--${darkMode ? 'dark' : 'light'}`}>
                {AUDIO_FORMATS.map((format) => (
                  <div
                    key={format}
                    onClick={() => { setOutputFormat(format); setDropdownOpen(false); }}
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
        {convertedUrl ? (
          <a
            href={convertedUrl}
            download={`converted.${outputFormat}`}
            className={`file-converter__convert-button file-converter__convert-button--active`}
            style={{ textAlign: 'center', display: 'inline-block', textDecoration: 'none' }}
          >
            Download Converted File
          </a>
        ) : (
          <button
            className={`file-converter__convert-button ${outputFormat ? 'file-converter__convert-button--active' : 'file-converter__convert-button--disabled'}`}
            onClick={handleConvert}
            disabled={!outputFormat || isConverting}
          >
            {isConverting ? `Converting... (${Math.round(progress * 100)}%)` : 'Convert Now'}
          </button>
        )}
      </div>
    </div>
  );
};