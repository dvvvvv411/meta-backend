import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { LogoUpload } from './LogoUpload';
import { brandingSchema, type BrandingFormData } from '@/lib/validators';
import { useCreateBranding, useUpdateBranding, type Branding } from '@/hooks/useBrandings';

interface BrandingFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branding?: Branding | null;
}

export function BrandingFormModal({ open, onOpenChange, branding }: BrandingFormModalProps) {
  const isEditing = !!branding;
  const createBranding = useCreateBranding();
  const updateBranding = useUpdateBranding();

  const form = useForm<BrandingFormData>({
    resolver: zodResolver(brandingSchema),
    defaultValues: {
      name: '',
      domain: '',
      email: '',
      primary_color: '#6366f1',
      logo_url: null,
      is_active: true,
    },
  });

  useEffect(() => {
    if (branding) {
      form.reset({
        name: branding.name,
        domain: branding.domain,
        email: branding.email,
        primary_color: branding.primary_color || '#6366f1',
        logo_url: branding.logo_url,
        is_active: branding.is_active,
      });
    } else {
      form.reset({
        name: '',
        domain: '',
        email: '',
        primary_color: '#6366f1',
        logo_url: null,
        is_active: true,
      });
    }
  }, [branding, form]);

  const onSubmit = async (data: BrandingFormData) => {
    try {
      if (isEditing && branding) {
        await updateBranding.mutateAsync({ id: branding.id, branding: data });
      } else {
        await createBranding.mutateAsync(data);
      }
      onOpenChange(false);
    } catch (error) {
      // Error is handled in the mutation
    }
  };

  const isLoading = createBranding.isPending || updateBranding.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Branding bearbeiten' : 'Neues Branding erstellen'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="logo_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo</FormLabel>
                  <FormControl>
                    <LogoUpload
                      value={field.value || null}
                      onChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unternehmensname *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Acme GmbH"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="domain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Domain *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="acme.de"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-Mail *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="kontakt@acme.de"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="primary_color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primärfarbe</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={field.value || '#6366f1'}
                        onChange={field.onChange}
                        className="h-10 w-14 cursor-pointer rounded border border-input bg-transparent p-1"
                        disabled={isLoading}
                      />
                      <Input
                        {...field}
                        value={field.value || '#6366f1'}
                        className="flex-1 font-mono"
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm font-medium">Status</FormLabel>
                    <p className="text-xs text-muted-foreground">
                      {field.value ? 'Branding ist aktiv' : 'Branding ist inaktiv'}
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Abbrechen
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Wird gespeichert...' : 'Speichern'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
