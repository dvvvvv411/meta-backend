import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AuthLayout from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const loginSchema = z.object({
  email: z.string().email('Bitte geben Sie eine gültige E-Mail-Adresse ein'),
  password: z.string().min(1, 'Bitte geben Sie Ihr Passwort ein'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    const { error } = await signIn(data.email, data.password);
    setIsLoading(false);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Anmeldung fehlgeschlagen',
        description: error,
      });
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <AuthLayout title="Willkommen zurück" subtitle="Melden Sie sich in Ihrem Konto an">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">E-Mail</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="email"
              type="email"
              placeholder="ihre@email.de"
              className="pl-10"
              aria-required="true"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p id="email-error" className="text-sm text-destructive" role="alert">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Passwort</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="pl-10 pr-10"
              aria-required="true"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
              aria-label={showPassword ? "Passwort verbergen" : "Passwort anzeigen"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
            </button>
          </div>
          {errors.password && (
            <p id="password-error" className="text-sm text-destructive" role="alert">{errors.password.message}</p>
          )}
        </div>

        <div className="flex justify-end">
          <Link
            to="/auth/forgot-password"
            className="text-sm text-primary hover:underline"
          >
            Passwort vergessen?
          </Link>
        </div>

        <Button type="submit" variant="gradient" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Wird angemeldet...
            </>
          ) : (
            'Einloggen'
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Noch kein Konto?{' '}
          <Link to="/auth/register" className="text-primary hover:underline font-medium">
            Registrieren
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
