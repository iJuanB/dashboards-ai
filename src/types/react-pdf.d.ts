declare module 'react-pdf' {
  import { ComponentType, ReactElement } from 'react';

  export const Document: ComponentType<{
    file: string;
    onLoadSuccess?: (data: { numPages: number }) => void;
    onLoadError?: (error: Error) => void;
    loading?: ReactElement;
    children?: ReactElement;
  }>;

  export const Page: ComponentType<{
    pageNumber: number;
    renderTextLayer?: boolean;
    renderAnnotationLayer?: boolean;
    className?: string;
  }>;

  export const pdfjs: {
    GlobalWorkerOptions: {
      workerSrc: string;
    };
  };
} 