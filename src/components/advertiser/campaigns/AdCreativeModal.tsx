import { useState, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Plus, X, Image as ImageIcon, Video, ArrowLeft, ArrowRight, Scissors, RefreshCw, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useAuth } from '@/contexts/AuthContext';
const CALL_TO_ACTION_OPTIONS = [
  { value: 'subscribe', label: 'Subscribe' },
  { value: 'watch_more', label: 'Watch more' },
  { value: 'get_quote', label: 'Get quote' },
  { value: 'apply_now', label: 'Apply now' },
  { value: 'book_now', label: 'Book now' },
  { value: 'call_now', label: 'Call now' },
  { value: 'contact_us', label: 'Contact us' },
  { value: 'download', label: 'Download' },
  { value: 'get_offer', label: 'Get offer' },
  { value: 'get_promotions', label: 'Get promotions' },
  { value: 'get_showtimes', label: 'Get showtimes' },
  { value: 'learn_more', label: 'Learn more' },
  { value: 'listen_now', label: 'Listen now' },
  { value: 'order_now', label: 'Order now' },
  { value: 'get_access', label: 'Get Access' },
  { value: 'request_time', label: 'Request time' },
  { value: 'see_menu', label: 'See menu' },
  { value: 'get_updates', label: 'Get updates' },
  { value: 'shop_now', label: 'Shop now' },
  { value: 'sign_up', label: 'Sign up' },
];

type FormatType = 'square' | 'vertical' | 'horizontal';

const FORMAT_CONFIG: Record<FormatType, { label: string; ratio: string; aspect: number }> = {
  square: { label: 'Square 1:1', ratio: '1/1', aspect: 1 },
  vertical: { label: 'Vertical 9:16', ratio: '9/16', aspect: 9 / 16 },
  horizontal: { label: 'Horizontal 1.91:1', ratio: '1.91/1', aspect: 1.91 },
};

export interface AdCreativeData {
  type: 'image' | 'video';
  mediaUrl: string;
  images?: {
    square: string;
    vertical: string;
    horizontal: string;
  };
  videoThumbnailUrl?: string;
  primaryTexts: string[];
  headlines: string[];
  description: string;
  callToAction: string;
}

interface AdCreativeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  creativeType: 'image' | 'video';
  onComplete: (data: AdCreativeData) => void;
}

export function AdCreativeModal({ open, onOpenChange, creativeType, onComplete }: AdCreativeModalProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<'media' | 'text'>('media');
  const [isUploading, setIsUploading] = useState(false);
  
  // Image upload hook
  const { uploadImage } = useImageUpload({
    bucket: 'campaign-creatives',
    maxSizeMB: 10,
    allowedTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'],
  });
  
  // Media state - store both blob URLs (for preview) and file objects (for upload)
  const [uploadedMedia, setUploadedMedia] = useState<string | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [images, setImages] = useState<Record<FormatType, string | null>>({
    square: null,
    vertical: null,
    horizontal: null,
  });
  const [imageFiles, setImageFiles] = useState<Record<FormatType, File | null>>({
    square: null,
    vertical: null,
    horizontal: null,
  });
  const [videoThumbnail, setVideoThumbnail] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [mediaFileName, setMediaFileName] = useState<string>('');
  
  // Crop modal state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropFormat, setCropFormat] = useState<FormatType>('square');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop>();
  const cropImageRef = useRef<HTMLImageElement>(null);
  
  // Text state
  const [primaryTexts, setPrimaryTexts] = useState<string[]>(['']);
  const [headlines, setHeadlines] = useState<string[]>(['']);
  const [description, setDescription] = useState('');
  const [callToAction, setCallToAction] = useState('learn_more');
  
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRefs = {
    square: useRef<HTMLInputElement>(null),
    vertical: useRef<HTMLInputElement>(null),
    horizontal: useRef<HTMLInputElement>(null),
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedMedia(url);
      setMediaFile(file);
      setMediaFileName(file.name);
      // Set all formats to the same initial image
      setImages({
        square: url,
        vertical: url,
        horizontal: url,
      });
      setImageFiles({
        square: file,
        vertical: file,
        horizontal: file,
      });
    }
  };

  const handleReplaceImage = (format: FormatType) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImages(prev => ({ ...prev, [format]: url }));
      setImageFiles(prev => ({ ...prev, [format]: file }));
    }
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoThumbnail(url);
      setThumbnailFile(file);
    }
  };

  const openCropModal = (format: FormatType) => {
    setCropFormat(format);
    setCrop(undefined);
    setCompletedCrop(undefined);
    setCropModalOpen(true);
  };

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const aspect = FORMAT_CONFIG[cropFormat].aspect;
    
    const newCrop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        aspect,
        width,
        height
      ),
      width,
      height
    );
    
    setCrop(newCrop);
  }, [cropFormat]);

  const applyCrop = async () => {
    if (!completedCrop || !cropImageRef.current) {
      setCropModalOpen(false);
      return;
    }

    const image = cropImageRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const pixelCrop = {
      x: completedCrop.x * scaleX,
      y: completedCrop.y * scaleY,
      width: completedCrop.width * scaleX,
      height: completedCrop.height * scaleY,
    };

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    // Convert canvas to blob/file for upload
    canvas.toBlob((blob) => {
      if (blob) {
        const croppedFile = new File([blob], `cropped-${cropFormat}.jpg`, { type: 'image/jpeg' });
        const croppedUrl = URL.createObjectURL(blob);
        setImages(prev => ({ ...prev, [cropFormat]: croppedUrl }));
        setImageFiles(prev => ({ ...prev, [cropFormat]: croppedFile }));
      }
    }, 'image/jpeg', 0.95);
    
    setCropModalOpen(false);
  };

  // Helper to convert data URL to File
  const dataUrlToFile = async (dataUrl: string, filename: string): Promise<File> => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
  };

  // Upload all images to Supabase Storage
  const uploadAllImages = async (): Promise<{
    mediaUrl: string;
    images?: { square: string; vertical: string; horizontal: string };
    thumbnailUrl?: string;
  } | null> => {
    if (!user?.id) return null;
    
    const timestamp = Date.now();
    const basePath = `${user.id}/${timestamp}`;
    
    try {
      // Upload main media
      let finalMediaUrl = uploadedMedia;
      if (mediaFile) {
        const mediaPath = `${basePath}/main-${mediaFile.name}`;
        const uploadedMediaUrl = await uploadImage(mediaFile, mediaPath);
        if (uploadedMediaUrl) finalMediaUrl = uploadedMediaUrl;
      }
      
      // For images, upload all 3 formats
      if (creativeType === 'image') {
        const uploadedImages: { square: string; vertical: string; horizontal: string } = {
          square: finalMediaUrl || '',
          vertical: finalMediaUrl || '',
          horizontal: finalMediaUrl || '',
        };
        
        for (const format of ['square', 'vertical', 'horizontal'] as FormatType[]) {
          const file = imageFiles[format];
          const imageUrl = images[format];
          
          if (file) {
            const path = `${basePath}/${format}-${file.name}`;
            const url = await uploadImage(file, path);
            if (url) uploadedImages[format] = url;
          } else if (imageUrl?.startsWith('data:')) {
            // Handle data URLs from cropping
            const file = await dataUrlToFile(imageUrl, `${format}.jpg`);
            const path = `${basePath}/${format}.jpg`;
            const url = await uploadImage(file, path);
            if (url) uploadedImages[format] = url;
          } else if (imageUrl && !imageUrl.startsWith('blob:')) {
            // Already a permanent URL
            uploadedImages[format] = imageUrl;
          } else if (finalMediaUrl) {
            uploadedImages[format] = finalMediaUrl;
          }
        }
        
        return {
          mediaUrl: finalMediaUrl || '',
          images: uploadedImages,
        };
      }
      
      // For videos, upload thumbnail
      let finalThumbnailUrl = videoThumbnail;
      if (thumbnailFile) {
        const thumbnailPath = `${basePath}/thumbnail-${thumbnailFile.name}`;
        const uploadedThumbnailUrl = await uploadImage(thumbnailFile, thumbnailPath);
        if (uploadedThumbnailUrl) finalThumbnailUrl = uploadedThumbnailUrl;
      }
      
      return {
        mediaUrl: finalMediaUrl || '',
        thumbnailUrl: finalThumbnailUrl || undefined,
      };
    } catch (error) {
      console.error('Error uploading images:', error);
      return null;
    }
  };

  const addPrimaryText = () => {
    if (primaryTexts.length < 5) {
      setPrimaryTexts([...primaryTexts, '']);
    }
  };

  const updatePrimaryText = (index: number, value: string) => {
    const updated = [...primaryTexts];
    updated[index] = value;
    setPrimaryTexts(updated);
  };

  const removePrimaryText = (index: number) => {
    if (primaryTexts.length > 1) {
      setPrimaryTexts(primaryTexts.filter((_, i) => i !== index));
    }
  };

  const addHeadline = () => {
    if (headlines.length < 5) {
      setHeadlines([...headlines, '']);
    }
  };

  const updateHeadline = (index: number, value: string) => {
    const updated = [...headlines];
    updated[index] = value;
    setHeadlines(updated);
  };

  const removeHeadline = (index: number) => {
    if (headlines.length > 1) {
      setHeadlines(headlines.filter((_, i) => i !== index));
    }
  };

  const canProceedToText = () => {
    if (!uploadedMedia) return false;
    if (creativeType === 'video' && !videoThumbnail) return false;
    return true;
  };

  const handleDone = async () => {
    if (!uploadedMedia) return;
    
    setIsUploading(true);
    
    try {
      // Upload all images to Supabase Storage
      const uploadedUrls = await uploadAllImages();
      
      if (!uploadedUrls) {
        // Fallback to blob URLs if upload fails (they won't persist)
        onComplete({
          type: creativeType,
          mediaUrl: uploadedMedia,
          images: creativeType === 'image' ? {
            square: images.square || uploadedMedia,
            vertical: images.vertical || uploadedMedia,
            horizontal: images.horizontal || uploadedMedia,
          } : undefined,
          videoThumbnailUrl: videoThumbnail || undefined,
          primaryTexts: primaryTexts.filter(t => t.trim() !== ''),
          headlines: headlines.filter(h => h.trim() !== ''),
          description,
          callToAction,
        });
      } else {
        // Use permanent Storage URLs
        onComplete({
          type: creativeType,
          mediaUrl: uploadedUrls.mediaUrl,
          images: uploadedUrls.images,
          videoThumbnailUrl: uploadedUrls.thumbnailUrl,
          primaryTexts: primaryTexts.filter(t => t.trim() !== ''),
          headlines: headlines.filter(h => h.trim() !== ''),
          description,
          callToAction,
        });
      }
      
      // Reset state
      setStep('media');
      setUploadedMedia(null);
      setMediaFile(null);
      setImages({ square: null, vertical: null, horizontal: null });
      setImageFiles({ square: null, vertical: null, horizontal: null });
      setVideoThumbnail(null);
      setThumbnailFile(null);
      setMediaFileName('');
      setPrimaryTexts(['']);
      setHeadlines(['']);
      setDescription('');
      setCallToAction('learn_more');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setStep('media');
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="lg:max-w-2xl">
          {step === 'media' ? (
            <>
              <DialogHeader>
                <DialogTitle>Upload your {creativeType === 'image' ? 'Image' : 'Video'}</DialogTitle>
                <DialogDescription>
                  {creativeType === 'image' 
                    ? 'Upload an image for your ad. We will display it in multiple formats.'
                    : 'Upload a video for your ad. You will also need to provide a thumbnail.'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {/* Media Upload Zone */}
                <div
                  onClick={() => mediaInputRef.current?.click()}
                  className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                    uploadedMedia ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
                  )}
                >
                  <input
                    ref={mediaInputRef}
                    type="file"
                    accept={creativeType === 'image' ? 'image/*' : 'video/*'}
                    onChange={handleMediaUpload}
                    className="hidden"
                  />
                  {!uploadedMedia ? (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-10 w-10 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Drag & drop or click to upload
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {creativeType === 'image' ? 'PNG, JPG, GIF up to 10MB' : 'MP4, MOV up to 100MB'}
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      {creativeType === 'image' ? (
                        <ImageIcon className="h-10 w-10 text-primary" />
                      ) : (
                        <Video className="h-10 w-10 text-primary" />
                      )}
                      <p className="text-sm font-medium">{mediaFileName}</p>
                      <p className="text-xs text-muted-foreground">Click to replace</p>
                    </div>
                  )}
                </div>

                {/* Image Preview - 3 Versions with Crop & Replace */}
                {creativeType === 'image' && uploadedMedia && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Preview in different formats</Label>
                    <div className="grid grid-cols-3 gap-4">
                      {/* Square 1:1 */}
                      <div className="space-y-2">
                        <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                          <img 
                            src={images.square || uploadedMedia} 
                            alt="Square Preview" 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <p className="text-xs text-center text-muted-foreground">Square 1:1</p>
                        <div className="flex gap-1 justify-center">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 px-2 text-xs gap-1"
                            onClick={() => openCropModal('square')}
                          >
                            <Scissors className="h-3 w-3" />
                            Crop
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 px-2 text-xs gap-1"
                            onClick={() => replaceInputRefs.square.current?.click()}
                          >
                            <RefreshCw className="h-3 w-3" />
                            Replace
                          </Button>
                          <input
                            ref={replaceInputRefs.square}
                            type="file"
                            accept="image/*"
                            onChange={handleReplaceImage('square')}
                            className="hidden"
                          />
                        </div>
                      </div>

                      {/* Vertical 9:16 */}
                      <div className="space-y-2">
                        <div className="aspect-[9/16] bg-muted rounded-lg overflow-hidden max-h-[180px]">
                          <img 
                            src={images.vertical || uploadedMedia} 
                            alt="Vertical Preview" 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <p className="text-xs text-center text-muted-foreground">Vertical 9:16</p>
                        <div className="flex gap-1 justify-center">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 px-2 text-xs gap-1"
                            onClick={() => openCropModal('vertical')}
                          >
                            <Scissors className="h-3 w-3" />
                            Crop
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 px-2 text-xs gap-1"
                            onClick={() => replaceInputRefs.vertical.current?.click()}
                          >
                            <RefreshCw className="h-3 w-3" />
                            Replace
                          </Button>
                          <input
                            ref={replaceInputRefs.vertical}
                            type="file"
                            accept="image/*"
                            onChange={handleReplaceImage('vertical')}
                            className="hidden"
                          />
                        </div>
                      </div>

                      {/* Horizontal 1.91:1 */}
                      <div className="space-y-2">
                        <div className="aspect-[1.91/1] bg-muted rounded-lg overflow-hidden">
                          <img 
                            src={images.horizontal || uploadedMedia} 
                            alt="Horizontal Preview" 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <p className="text-xs text-center text-muted-foreground">Horizontal 1.91:1</p>
                        <div className="flex gap-1 justify-center">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 px-2 text-xs gap-1"
                            onClick={() => openCropModal('horizontal')}
                          >
                            <Scissors className="h-3 w-3" />
                            Crop
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 px-2 text-xs gap-1"
                            onClick={() => replaceInputRefs.horizontal.current?.click()}
                          >
                            <RefreshCw className="h-3 w-3" />
                            Replace
                          </Button>
                          <input
                            ref={replaceInputRefs.horizontal}
                            type="file"
                            accept="image/*"
                            onChange={handleReplaceImage('horizontal')}
                            className="hidden"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Video Thumbnail Upload */}
                {creativeType === 'video' && uploadedMedia && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Video thumbnail (required)</Label>
                    <div
                      onClick={() => thumbnailInputRef.current?.click()}
                      className={cn(
                        "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
                        videoThumbnail ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
                      )}
                    >
                      <input
                        ref={thumbnailInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                        className="hidden"
                      />
                      {!videoThumbnail ? (
                        <div className="flex flex-col items-center gap-2">
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Upload video thumbnail</p>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-4">
                          <img src={videoThumbnail} alt="Thumbnail" className="h-20 w-20 object-cover rounded" />
                          <p className="text-sm text-muted-foreground">Click to replace</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  onClick={() => setStep('text')} 
                  disabled={!canProceedToText()}
                  className="gap-2"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Text</DialogTitle>
                <DialogDescription>
                  Add multiple text options and we'll show the one we predict will perform best when your ad is delivered.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4 max-h-[60vh] overflow-y-auto">
                {/* Primary Text */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Primary text{primaryTexts.some(t => t.trim()) && ` (${primaryTexts.filter(t => t.trim()).length} of 5)`}
                  </Label>
                  {primaryTexts.map((text, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={text}
                        onChange={(e) => updatePrimaryText(index, e.target.value)}
                        placeholder="Tell people what your ad is about"
                        className="flex-1"
                      />
                      {primaryTexts.length > 1 && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => removePrimaryText(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {primaryTexts.length < 5 && primaryTexts[primaryTexts.length - 1]?.trim() && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={addPrimaryText}
                      className="gap-2 text-blue-600 border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <Plus className="h-4 w-4" />
                      Add text option
                    </Button>
                  )}
                </div>

                {/* Headlines */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Headline{headlines.some(t => t.trim()) && ` (${headlines.filter(t => t.trim()).length} of 5)`}
                  </Label>
                  {headlines.map((headline, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={headline}
                        onChange={(e) => updateHeadline(index, e.target.value)}
                        placeholder="Write a short headline"
                        className="flex-1"
                      />
                      {headlines.length > 1 && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => removeHeadline(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {headlines.length < 5 && headlines[headlines.length - 1]?.trim() && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={addHeadline}
                      className="gap-2 text-blue-600 border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <Plus className="h-4 w-4" />
                      Add headline
                    </Button>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Description</Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add a description for your ad"
                    rows={3}
                  />
                </div>

                {/* Call to Action */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Call to action</Label>
                  <Select value={callToAction} onValueChange={setCallToAction}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CALL_TO_ACTION_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep('media')} className="gap-2 text-blue-600 border-blue-300 hover:bg-blue-50 hover:text-blue-700">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button onClick={handleDone} disabled={isUploading}>
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    'Done'
                  )}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Crop Modal */}
      <Dialog open={cropModalOpen} onOpenChange={setCropModalOpen}>
        <DialogContent className="lg:max-w-xl">
          <DialogHeader>
            <DialogTitle>Crop image for {FORMAT_CONFIG[cropFormat].label}</DialogTitle>
            <DialogDescription>
              Adjust the crop area to fit the {FORMAT_CONFIG[cropFormat].label} format.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {uploadedMedia && (
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={FORMAT_CONFIG[cropFormat].aspect}
                className="max-h-[400px] mx-auto"
              >
                <img
                  ref={cropImageRef}
                  src={uploadedMedia}
                  alt="Crop preview"
                  onLoad={onImageLoad}
                  className="max-h-[400px] w-auto mx-auto"
                />
              </ReactCrop>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setCropModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={applyCrop}>
              Apply Crop
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export { CALL_TO_ACTION_OPTIONS };
