export const THEME = {
  DARK_COLOR: '#0b1531',
  LIGHT_COLOR: '#ffffff',
  DARK_SECONDARY: '#232b3e',
  LIGHT_SECONDARY: '#e0e4ef',
  DARK_BACKGROUND: '#101a36',
  LIGHT_BACKGROUND: '#f7f8fa',
  DARK_BORDER: '#2a3553',
  LIGHT_BORDER: '#bbb',
  DARK_TEXT: '#fff',
  LIGHT_TEXT: '#222',
  DARK_TEXT_SECONDARY: '#b0b8c9',
  LIGHT_TEXT_SECONDARY: '#333',
  ACCENT_COLOR: '#4ea1f7',
} as const;

export const IMAGE_FORMATS: readonly string[] = [
  'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'ico', 'tif', 'tiff'
] as const;

export const AUDIO_FORMATS: readonly string[] = [
  'mp3', 'wav', 'ogg', 'aac', 'wma', 'flac', 'm4a'
] as const;

export const VIDEO_FORMATS: readonly string[] = [
  'mp4', 'm4v', 'webm', 'ogv', 'mkv', 'avi', 'mov', 'flv', 'h264', '264'
] as const;

export const BREAKPOINTS = {
  MOBILE: 600,
  TABLET: 900,
} as const;

export const ANIMATION = {
  DURATION: {
    FAST: 0.2,
    NORMAL: 0.3,
    SLOW: 0.7,
  },
  EASING: [0.4, 0, 0.2, 1] as const,
} as const;

export const FILE_SIZE = {
  KB: 1024,
  MB: 1024 * 1024,
} as const;

export const LAYOUT = {
  HEADER_HEIGHT: 80,
  BORDER_RADIUS: {
    SMALL: 8,
    MEDIUM: 14,
    LARGE: 18,
  },
  PADDING: {
    SMALL: '0.5rem',
    MEDIUM: '1rem',
    LARGE: '2rem',
  },
} as const; 