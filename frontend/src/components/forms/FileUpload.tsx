import React, { useCallback, useRef, useState } from 'react';
import { UploadCloud, X, FileText, Image } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatFileSize } from '@/utils';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  accept?: string;
  maxSizeMB?: number;
  onChange: (file: File | null) => void;
  label?: string;
  description?: string;
  error?: string;
  className?: string;
}

export function FileUpload({
  accept = 'image/*,application/pdf',
  maxSizeMB = 5,
  onChange,
  label = 'Upload File',
  description = 'Drag and drop or click to upload',
  error,
  className,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const validateAndSet = useCallback(
    (f: File) => {
      setLocalError(null);
      if (f.size > maxSizeMB * 1024 * 1024) {
        setLocalError(`File must be under ${maxSizeMB}MB`);
        return;
      }
      setFile(f);
      onChange(f);
      if (f.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(f);
      } else {
        setPreview(null);
      }
    },
    [maxSizeMB, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) validateAndSet(dropped);
    },
    [validateAndSet]
  );

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const displayError = localError ?? error;

  return (
    <div className={cn('space-y-2', className)}>
      {file ? (
        <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
          {preview ? (
            <img src={preview} alt="preview" className="h-12 w-12 rounded object-cover" />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded bg-muted">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            'relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors cursor-pointer',
            isDragOver
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50 hover:bg-muted/30'
          )}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <UploadCloud className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Max {maxSizeMB}MB</p>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) validateAndSet(f);
            }}
          />
        </div>
      )}
      {displayError && (
        <p className="text-xs text-destructive" role="alert">{displayError}</p>
      )}
    </div>
  );
}
