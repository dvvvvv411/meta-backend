import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Loader2, Mail, Lock, Eye, EyeOff, Building2, ArrowLeft, CheckCircle,
  Shield, Check, Lock as LockIcon
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { LegalFooter } from '@/components/ui/legal-footer';
import metaLogo from '@/assets/meta-logo.png';

// Validation Schemas
const loginSchema = z.object({
  email: z.string().email('Bitte geben Sie eine gültige E-Mail-Adresse ein'),
  password: z.string().min(1, 'Bitte geben Sie Ihr Passwort ein'),
});

const registerSchema = z.object({
  email: z.string().email('Bitte geben Sie eine gültige E-Mail-Adresse ein'),
  password: z.string().min(8, 'Das Passwort muss mindestens 8 Zeichen lang sein'),
  companyName: z.string().optional(),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Bitte geben Sie eine gültige E-Mail-Adresse ein'),
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;
type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
type AuthView = 'login' | 'register' | 'forgot-password';

const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialView = searchParams.get('mode') === 'register' ? 'register' : 'login';
  
  const [view, setView] = useState<AuthView>(initialView);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  
  const { signIn, signUp, resetPassword, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Login Form
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Register Form
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  // Forgot Password Form
  const forgotForm = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const handleLogin = async (data: LoginFormData) => {
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

  const handleRegister = async (data: RegisterFormData) => {
    setIsLoading(true);
    const { error } = await signUp(data.email, data.password, data.companyName);
    setIsLoading(false);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Registrierung fehlgeschlagen',
        description: error,
      });
    } else {
      toast({
        title: 'Willkommen!',
        description: 'Ihr Konto wurde erfolgreich erstellt.',
      });
      navigate('/dashboard');
    }
  };

  const handleForgotPassword = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    const { error } = await resetPassword(data.email);
    setIsLoading(false);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Fehler',
        description: error,
      });
    } else {
      setResetSuccess(true);
    }
  };

  const switchView = (newView: AuthView) => {
    setView(newView);
    setResetSuccess(false);
    setShowPassword(false);
  };


  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex">
        {/* Left Column - Forms */}
        <div className="w-full lg:w-[45%] flex flex-col justify-center px-6 py-12 lg:px-16 xl:px-24">
          <div className="w-full max-w-md mx-auto">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-10">
              <img src={metaLogo} alt="Meta" className="h-8 w-auto" />
              <span className="text-xl font-semibold text-foreground">MetaNetwork</span>
            </div>

            {/* Tab Switcher - Only show for login/register */}
            {view !== 'forgot-password' && (
              <div className="flex mb-8 bg-muted/50 rounded-xl p-1">
                <button
                  onClick={() => switchView('login')}
                  className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
                    view === 'login'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Anmelden
                </button>
                <button
                  onClick={() => switchView('register')}
                  className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
                    view === 'register'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Registrieren
                </button>
              </div>
            )}

            {/* Login Form */}
            {view === 'login' && (
              <div className="animate-fade-in">
                <h1 className="text-2xl font-semibold text-foreground mb-2">Willkommen zurück</h1>
                <p className="text-muted-foreground mb-8">Melden Sie sich in Ihrem Konto an</p>

                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">E-Mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="ihre@email.de"
                        className="pl-10 h-11"
                        {...loginForm.register('email')}
                      />
                    </div>
                    {loginForm.formState.errors.email && (
                      <p className="text-sm text-destructive">{loginForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Passwort</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="pl-10 pr-10 h-11"
                        {...loginForm.register('password')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {loginForm.formState.errors.password && (
                      <p className="text-sm text-destructive">{loginForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => switchView('forgot-password')}
                      className="text-sm text-primary hover:underline"
                    >
                      Passwort vergessen?
                    </button>
                  </div>

                  <Button type="submit" variant="gradient" className="w-full h-11" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Wird angemeldet...
                      </>
                    ) : (
                      'Einloggen'
                    )}
                  </Button>
                </form>
              </div>
            )}

            {/* Register Form */}
            {view === 'register' && (
              <div className="animate-fade-in">
                <h1 className="text-2xl font-semibold text-foreground mb-2">Konto erstellen</h1>
                <p className="text-muted-foreground mb-8">Starten Sie jetzt mit MetaNetwork</p>

                <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="register-email">E-Mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="ihre@email.de"
                        className="pl-10 h-11"
                        {...registerForm.register('email')}
                      />
                    </div>
                    {registerForm.formState.errors.email && (
                      <p className="text-sm text-destructive">{registerForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Passwort</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Mindestens 8 Zeichen"
                        className="pl-10 pr-10 h-11"
                        {...registerForm.register('password')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {registerForm.formState.errors.password && (
                      <p className="text-sm text-destructive">{registerForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-company">Firmenname (optional)</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-company"
                        type="text"
                        placeholder="Ihre Firma GmbH"
                        className="pl-10 h-11"
                        {...registerForm.register('companyName')}
                      />
                    </div>
                  </div>

                  <Button type="submit" variant="gradient" className="w-full h-11" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Wird registriert...
                      </>
                    ) : (
                      'Konto erstellen'
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Mit der Registrierung stimmen Sie unseren{' '}
                    <a href="/datenschutz" className="text-primary hover:underline">Datenschutzrichtlinien</a>
                    {' '}zu.
                  </p>
                </form>
              </div>
            )}

            {/* Forgot Password Form */}
            {view === 'forgot-password' && (
              <div className="animate-fade-in">
                {resetSuccess ? (
                  <div className="text-center">
                    <div className="flex justify-center mb-6">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCircle className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <h1 className="text-2xl font-semibold text-foreground mb-2">E-Mail gesendet</h1>
                    <p className="text-muted-foreground mb-8">
                      Wenn ein Konto mit dieser E-Mail-Adresse existiert, haben wir Ihnen einen Link zum Zurücksetzen gesendet.
                    </p>
                    <Button
                      variant="outline"
                      className="w-full h-11"
                      onClick={() => switchView('login')}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Zurück zur Anmeldung
                    </Button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => switchView('login')}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Zurück zur Anmeldung
                    </button>

                    <h1 className="text-2xl font-semibold text-foreground mb-2">Passwort vergessen?</h1>
                    <p className="text-muted-foreground mb-8">Wir senden Ihnen einen Link zum Zurücksetzen</p>

                    <form onSubmit={forgotForm.handleSubmit(handleForgotPassword)} className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="forgot-email">E-Mail</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="forgot-email"
                            type="email"
                            placeholder="ihre@email.de"
                            className="pl-10 h-11"
                            {...forgotForm.register('email')}
                          />
                        </div>
                        {forgotForm.formState.errors.email && (
                          <p className="text-sm text-destructive">{forgotForm.formState.errors.email.message}</p>
                        )}
                      </div>

                      <Button type="submit" variant="gradient" className="w-full h-11" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Wird gesendet...
                          </>
                        ) : (
                          'Link senden'
                        )}
                      </Button>
                    </form>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Clean Meta/Facebook Style */}
        <div className="hidden lg:flex lg:w-[55%] bg-[#f0f2f5] flex-col justify-center items-center p-12 xl:p-16">
          <div className="max-w-md text-center">
            {/* Logo */}
            <img 
              src={metaLogo} 
              alt="Meta" 
              className="h-12 w-auto mx-auto mb-8" 
            />
            
            {/* Headline */}
            <h2 className="text-3xl font-semibold text-[#1c1e21] mb-4">
              Verbinde dich mit deiner Zielgruppe
            </h2>
            
            {/* Subline */}
            <p className="text-lg text-[#606770] mb-12">
              MetaNetwork ermöglicht es dir, verifizierte Agency Accounts 
              zu mieten und professionelle Kampagnen zu erstellen.
            </p>
            
            {/* Simple Feature List */}
            <div className="space-y-4 text-left mb-12">
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-[#1877F2] flex-shrink-0" />
                <span className="text-[#1c1e21]">Verifizierte Agency Accounts mit Business Suite Zugang</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-[#1877F2] flex-shrink-0" />
                <span className="text-[#1c1e21]">Flexible Laufzeiten ohne langfristige Bindung</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-[#1877F2] flex-shrink-0" />
                <span className="text-[#1c1e21]">Sichere Zahlungen mit Kryptowährungen</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-[#1877F2] flex-shrink-0" />
                <span className="text-[#1c1e21]">Professioneller Support für alle Anliegen</span>
              </div>
            </div>
            
            {/* Divider */}
            <div className="border-t border-[#dadde1] mb-8" />
            
            {/* Trust Section */}
            <div className="flex items-center justify-center gap-6 text-sm text-[#606770]">
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                DSGVO-konform
              </span>
              <span className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                SSL-gesichert
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Footer */}
      <LegalFooter />
    </div>
  );
};

export default AuthPage;
