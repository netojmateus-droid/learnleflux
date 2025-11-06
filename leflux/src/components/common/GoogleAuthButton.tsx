import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { LogIn, LogOut, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { useToast } from './Toast';
import { useAuthStore } from '@/store/authStore';

interface GoogleAuthButtonProps {
  variant?: 'solid' | 'ghost';
  className?: string;
}

export function GoogleAuthButton({ variant = 'solid', className }: GoogleAuthButtonProps) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();
  const googleEnabled = Boolean(clientId);
  const { user, setUser, signOut } = useAuthStore();
  const { push } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const login = useGoogleLogin({
    flow: 'implicit',
    scope: 'openid profile email',
    onSuccess: async (tokenResponse) => {
      try {
        const { access_token: accessToken, expires_in: expiresIn } = tokenResponse;
        const profileResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!profileResponse.ok) {
          throw new Error('Falha ao obter perfil');
        }
        const profile = (await profileResponse.json()) as {
          sub: string;
          name: string;
          email: string;
          picture?: string;
        };
        setUser({
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          picture: profile.picture,
          accessToken,
          expiresAt: Date.now() + (expiresIn ?? 3600) * 1000,
        });
        push('Conta Google conectada.', 'success');
      } catch (error) {
        console.error(error);
        push('Não conseguimos finalizar o login com Google.', 'error');
      } finally {
        setIsLoading(false);
      }
    },
    onError: (errorResponse) => {
      console.error('Google login error', errorResponse);
      push('Não foi possível concluir o login agora.', 'error');
      setIsLoading(false);
    },
  });

  if (!googleEnabled) {
    return null;
  }

  const handleSignIn = () => {
    if (isLoading) return;
    setIsLoading(true);
    login();
  };

  const handleSignOut = () => {
    if (isLoading) return;
    signOut();
    push('Conta Google desconectada.', 'info');
  };

  if (user) {
    return (
      <Button
        intent={variant === 'solid' ? 'accent' : 'ghost'}
        onClick={handleSignOut}
        className={className}
        disabled={isLoading}
      >
        <LogOut className="mr-2 h-4 w-4" /> Sair do Google
      </Button>
    );
  }

  return (
    <Button
      intent={variant === 'solid' ? 'accent' : 'ghost'}
      onClick={handleSignIn}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
      Entrar com Google
    </Button>
  );
}
