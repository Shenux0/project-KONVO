import { FILE_SIZE } from '@/constants';
import type { ImageFormat, ConversionResult, ConversionError } from '@/types';

export const formatFileSize = (bytes: number): string => {
  if (bytes >= FILE_SIZE.MB) {
    return `${(bytes / FILE_SIZE.MB).toFixed(2)} MB`;
  }
  return `${(bytes / FILE_SIZE.KB).toFixed(2)} KB`;
};

export const validateImageFile = (file: File): ConversionError | null => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp', 'image/x-icon', 'image/tiff'];
  
  if (!validTypes.includes(file.type)) {
    return {
      message: 'Please select a valid image file',
      code: 'INVALID_FILE_TYPE'
    };
  }

  const maxSize = 50 * FILE_SIZE.MB; // 50MB limit
  if (file.size > maxSize) {
    return {
      message: 'File size must be less than 50MB',
      code: 'FILE_TOO_LARGE'
    };
  }

  return null;
};

export const convertImageFormat = async (
  file: File, 
  outputFormat: ImageFormat
): Promise<ConversionResult> => {
  try {
    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve({
              success: false,
              error: {
                message: 'Failed to create canvas context',
                code: 'CANVAS_ERROR'
              }
            });
            return;
          }

          ctx.drawImage(img, 0, 0);
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                resolve({
                  success: true,
                  url
                });
              } else {
                resolve({
                  success: false,
                  error: {
                    message: 'Failed to convert image',
                    code: 'CONVERSION_ERROR'
                  }
                });
              }
            },
            `image/${outputFormat}`,
            0.9 // Quality
          );
        };

        img.onerror = () => {
          resolve({
            success: false,
            error: {
              message: 'Failed to load image',
              code: 'IMAGE_LOAD_ERROR'
            }
          });
        };

        img.src = e.target?.result as string;
      };

      reader.onerror = () => {
        resolve({
          success: false,
          error: {
            message: 'Failed to read file',
            code: 'FILE_READ_ERROR'
          }
        });
      };

      reader.readAsDataURL(file);
    });
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        code: 'UNKNOWN_ERROR'
      }
    };
  }
};

export const downloadFile = (url: string, filename: string): void => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}; 