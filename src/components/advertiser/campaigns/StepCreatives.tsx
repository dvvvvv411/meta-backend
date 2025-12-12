import { useState } from 'react';
import { Upload, X, Image, Video, FileText, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DemoTooltip } from './DemoTooltip';

interface MockFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  size: string;
}

interface StepCreativesProps {
  files: MockFile[];
  onFilesChange: (files: MockFile[]) => void;
}

export function StepCreatives({ files, onFilesChange }: StepCreativesProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Mock file addition
    addMockFile();
  };

  const addMockFile = () => {
    const mockTypes: Array<'image' | 'video' | 'document'> = ['image', 'video', 'image'];
    const randomType = mockTypes[Math.floor(Math.random() * mockTypes.length)];
    const extensions = { image: 'jpg', video: 'mp4', document: 'pdf' };
    
    const newFile: MockFile = {
      id: `file-${Date.now()}`,
      name: `creative_${files.length + 1}.${extensions[randomType]}`,
      type: randomType,
      size: `${(Math.random() * 5 + 0.5).toFixed(1)} MB`,
    };
    
    onFilesChange([...files, newFile]);
  };

  const removeFile = (id: string) => {
    onFilesChange(files.filter((f) => f.id !== id));
  };

  const getFileIcon = (type: 'image' | 'video' | 'document') => {
    switch (type) {
      case 'image':
        return <Image className="h-8 w-8 text-blue-500" />;
      case 'video':
        return <Video className="h-8 w-8 text-purple-500" />;
      case 'document':
        return <FileText className="h-8 w-8 text-orange-500" />;
    }
  };

  return (
    <Card className="animate-in fade-in-50 slide-in-from-right-5 duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2">
          <span className="text-xl">🎨</span>
          Werbemittel hochladen
        </CardTitle>
        <DemoTooltip />
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Drag & Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={addMockFile}
          className={cn(
            "relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 cursor-pointer group",
            isDragging
              ? "border-primary bg-primary/5 scale-[1.02]"
              : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
          )}
        >
          <div className="flex flex-col items-center justify-center text-center gap-4">
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200",
              isDragging ? "bg-primary/20" : "bg-muted group-hover:bg-primary/10"
            )}>
              <Upload className={cn(
                "h-8 w-8 transition-colors",
                isDragging ? "text-primary" : "text-muted-foreground group-hover:text-primary"
              )} />
            </div>
            <div>
              <p className="text-foreground font-medium">
                Dateien hierher ziehen
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                oder klicken zum Auswählen
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              JPG, PNG, MP4, GIF (max. 50MB pro Datei)
            </p>
          </div>
        </div>

        {/* Uploaded Files Grid */}
        {files.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">
              Hochgeladene Dateien ({files.length})
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="relative group bg-muted/50 rounded-lg p-4 border border-border hover:border-primary/50 transition-all"
                >
                  <button
                    onClick={() => removeFile(file.id)}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <div className="flex flex-col items-center gap-2">
                    {getFileIcon(file.type)}
                    <span className="text-xs text-foreground font-medium truncate w-full text-center">
                      {file.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {file.size}
                    </span>
                  </div>
                </div>
              ))}
              
              {/* Add More Button */}
              <button
                onClick={addMockFile}
                className="bg-muted/30 rounded-lg p-4 border border-dashed border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50 transition-all flex flex-col items-center justify-center gap-2 min-h-[120px]"
              >
                <Plus className="h-6 w-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Hinzufügen</span>
              </button>
            </div>
          </div>
        )}

        {/* Helper Text */}
        <p className="text-sm text-muted-foreground">
          Lade deine Werbebanner, Videos oder andere Creatives hoch. Unterstützte Formate: 
          JPG, PNG, GIF, MP4, MOV.
        </p>
      </CardContent>
    </Card>
  );
}
