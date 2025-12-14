import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Plus, X, Image as ImageIcon, Video, ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

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

export interface AdCreativeData {
  type: 'image' | 'video';
  mediaUrl: string;
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
  const [step, setStep] = useState<'media' | 'text'>('media');
  
  // Media state
  const [uploadedMedia, setUploadedMedia] = useState<string | null>(null);
  const [videoThumbnail, setVideoThumbnail] = useState<string | null>(null);
  const [mediaFileName, setMediaFileName] = useState<string>('');
  
  // Text state
  const [primaryTexts, setPrimaryTexts] = useState<string[]>(['']);
  const [headlines, setHeadlines] = useState<string[]>(['']);
  const [description, setDescription] = useState('');
  const [callToAction, setCallToAction] = useState('learn_more');
  
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedMedia(url);
      setMediaFileName(file.name);
    }
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoThumbnail(url);
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

  const handleDone = () => {
    if (!uploadedMedia) return;
    
    onComplete({
      type: creativeType,
      mediaUrl: uploadedMedia,
      videoThumbnailUrl: videoThumbnail || undefined,
      primaryTexts: primaryTexts.filter(t => t.trim() !== ''),
      headlines: headlines.filter(h => h.trim() !== ''),
      description,
      callToAction,
    });
    
    // Reset state
    setStep('media');
    setUploadedMedia(null);
    setVideoThumbnail(null);
    setMediaFileName('');
    setPrimaryTexts(['']);
    setHeadlines(['']);
    setDescription('');
    setCallToAction('learn_more');
  };

  const handleClose = () => {
    setStep('media');
    onOpenChange(false);
  };

  return (
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

              {/* Image Preview - 3 Versions */}
              {creativeType === 'image' && uploadedMedia && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Preview in different formats</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                        <img src={uploadedMedia} alt="1:1 Preview" className="w-full h-full object-cover" />
                      </div>
                      <p className="text-xs text-center text-muted-foreground">1:1 Square</p>
                    </div>
                    <div className="space-y-2">
                      <div className="aspect-[4/5] bg-muted rounded-lg overflow-hidden">
                        <img src={uploadedMedia} alt="4:5 Preview" className="w-full h-full object-cover" />
                      </div>
                      <p className="text-xs text-center text-muted-foreground">4:5 Story</p>
                    </div>
                    <div className="space-y-2">
                      <div className="aspect-[9/16] bg-muted rounded-lg overflow-hidden max-h-[200px]">
                        <img src={uploadedMedia} alt="9:16 Preview" className="w-full h-full object-cover" />
                      </div>
                      <p className="text-xs text-center text-muted-foreground">9:16 Reels</p>
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
                  Primary text ({primaryTexts.length} of 5)
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
                {primaryTexts.length < 5 && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={addPrimaryText}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add text option
                  </Button>
                )}
              </div>

              {/* Headlines */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  Headline ({headlines.length} of 5)
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
                {headlines.length < 5 && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={addHeadline}
                    className="gap-2"
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
              <Button variant="outline" onClick={() => setStep('media')} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleDone}>
                Done
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export { CALL_TO_ACTION_OPTIONS };
