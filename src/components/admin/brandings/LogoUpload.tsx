import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useImageUpload } from '@/hooks/useImageUpload';
import { cn } from '@/lib/utils';

interface LogoUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  disabled?: boolean;
}

export function LogoUpload({ value, onChange, disabled }: LogoUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { uploadImage, isUploading, validateFile } = useImageUpload({
    bucket: 'branding-logos',
    maxSizeMB: 3,
    allowedTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'],
  });

  const onSelectFile = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) return;

    const url = await uploadImage(file);
    if (url) {
      onChange(url);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onSelectFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onSelectFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      {value ? (
        <div className="relative inline-block">
          <div className="max-h-24 max-w-48 rounded-xl border-2 border-border bg-muted/50 overflow-hidden">
            <img
              src={value}
              alt="Logo Preview"
              className="max-h-24 max-w-48 object-contain"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
            onClick={handleRemove}
            disabled={disabled}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            'relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-colors cursor-pointer',
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50 hover:bg-muted/50',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !disabled && inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/svg+xml"
            onChange={handleInputChange}
            className="hidden"
            disabled={disabled}
          />
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              {isUploading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              ) : (
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Logo hochladen</p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, SVG · Max. 3MB
              </p>
            </div>
            <Button type="button" variant="outline" size="sm" disabled={disabled || isUploading}>
              <Upload className="mr-2 h-4 w-4" />
              Datei auswählen
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
