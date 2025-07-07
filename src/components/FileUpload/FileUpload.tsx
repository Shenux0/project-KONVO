import { useRef, useState } from 'react';
import { IMAGE_FORMATS, AUDIO_FORMATS, VIDEO_FORMATS } from '@/constants';
import './FileUpload.css';

interface FileUploadProps {
  darkMode: boolean;
  onFileSelect: (file: File) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ darkMode, onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  // const handleClick = () => {
  //   fileInputRef.current?.click();
  // };

  return (
    <section
      className={`file-upload ${darkMode ? 'file-upload--dark' : 'file-upload--light'}${isDragActive ? ' file-upload--drag-active' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        id="file-input"
        type="file"
        className="file-upload__input"
        ref={fileInputRef}
        accept={[
          ...IMAGE_FORMATS.map(f => `.${f}`),
          ...AUDIO_FORMATS.map(f => `.${f}`),
          ...VIDEO_FORMATS.map(f => `.${f}`)
        ].join(',')}
        onChange={handleFileChange}
      />
      
      <label 
        htmlFor="file-input" 
        className="file-upload__label"
      >
        <img 
          src={darkMode ? '/src/assets/uploadwhite.png' : '/src/assets/uploaddark.png'} 
          alt="Upload" 
          className="file-upload__icon" 
        />
        <div className="file-upload__text">
          Click, or drop your image, audio, or video files here
        </div>
      </label>
    </section>
  );
}; 