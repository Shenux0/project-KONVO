export interface FileInfo {
  file: File;
  name: string;
  size: number;
  type: string;
}

export interface SplashAnimation {
  show: boolean;
  x: number;
  y: number;
  toDark: boolean;
}

export interface ThemeContextType {
  darkMode: boolean;
  toggleTheme: () => void;
}

export interface ConversionError {
  message: string;
  code: string;
}

export type ImageFormat = 'jpg' | 'jpeg' | 'png' | 'gif' | 'bmp' | 'webp' | 'ico' | 'tif' | 'tiff';

export interface ConversionResult {
  success: boolean;
  url?: string;
  error?: ConversionError;
} 