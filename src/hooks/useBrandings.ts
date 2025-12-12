import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { BrandingFormData } from '@/lib/validators';

export interface Branding {
  id: string;
  name: string;
  domain: string;
  email: string;
  logo_url: string | null;
  primary_color: string;
  is_active: boolean;
  created_at: string;
  created_by: string | null;
  updated_at: string | null;
  updated_by: string | null;
  created_by_email?: string | null;
  updated_by_email?: string | null;
}

export function useBrandings() {
  return useQuery({
    queryKey: ['brandings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brandings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch profile emails for created_by and updated_by
      const userIds = [...new Set([
        ...data.map(b => b.created_by).filter(Boolean),
        ...data.map(b => b.updated_by).filter(Boolean)
      ])] as string[];

      let profileMap: Record<string, string> = {};
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, email')
          .in('id', userIds);
        
        profileMap = (profiles || []).reduce((acc, p) => {
          acc[p.id] = p.email;
          return acc;
        }, {} as Record<string, string>);
      }

      return data.map(b => ({
        ...b,
        created_by_email: b.created_by ? profileMap[b.created_by] : null,
        updated_by_email: b.updated_by ? profileMap[b.updated_by] : null,
      })) as Branding[];
    },
  });
}

export function useBranding(id: string | undefined) {
  return useQuery({
    queryKey: ['branding', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('brandings')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      // Fetch profile emails
      const userIds = [data.created_by, data.updated_by].filter(Boolean) as string[];
      let profileMap: Record<string, string> = {};
      
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, email')
          .in('id', userIds);
        
        profileMap = (profiles || []).reduce((acc, p) => {
          acc[p.id] = p.email;
          return acc;
        }, {} as Record<string, string>);
      }

      return {
        ...data,
        created_by_email: data.created_by ? profileMap[data.created_by] : null,
        updated_by_email: data.updated_by ? profileMap[data.updated_by] : null,
      } as Branding;
    },
    enabled: !!id,
  });
}

export function useCreateBranding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (branding: BrandingFormData) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('brandings')
        .insert({
          name: branding.name,
          domain: branding.domain,
          email: branding.email,
          primary_color: branding.primary_color || '#6366f1',
          logo_url: branding.logo_url || null,
          is_active: branding.is_active ?? true,
          created_by: user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brandings'] });
      toast.success('Branding erfolgreich erstellt');
    },
    onError: (error) => {
      toast.error('Fehler beim Erstellen des Brandings');
      console.error('Create branding error:', error);
    },
  });
}

export function useUpdateBranding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, branding }: { id: string; branding: Partial<BrandingFormData> }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('brandings')
        .update({
          ...branding,
          updated_by: user?.id,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['brandings'] });
      queryClient.invalidateQueries({ queryKey: ['branding', variables.id] });
      toast.success('Branding erfolgreich gespeichert');
    },
    onError: (error) => {
      toast.error('Fehler beim Aktualisieren des Brandings');
      console.error('Update branding error:', error);
    },
  });
}

export function useDeleteBranding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('brandings')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brandings'] });
      toast.success('Branding erfolgreich gelöscht');
    },
    onError: (error) => {
      toast.error('Fehler beim Löschen des Brandings');
      console.error('Delete branding error:', error);
    },
  });
}
