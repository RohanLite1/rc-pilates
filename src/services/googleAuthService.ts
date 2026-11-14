// Google Identity Services (GIS) Integration for RC Pilates Studio
export const GOOGLE_CLIENT_ID = '1092910034933-gnekarbe589vs3gnggsat8rgasmpnsfk.apps.googleusercontent.com';

export interface GoogleUserProfile {
  email: string;
  name: string;
  picture?: string;
  sub: string;
}

// Global declaration for Google GIS SDK
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          prompt: (notification?: (notification: unknown) => void) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: 'standard' | 'icon';
              theme?: 'outline' | 'filled_blue' | 'filled_black';
              size?: 'large' | 'medium' | 'small';
              text?: 'signin_with' | 'signup_with' | 'continue_with';
              shape?: 'rectangular' | 'pill' | 'circle' | 'square';
              logo_alignment?: 'left' | 'center';
              width?: number;
              locale?: string;
            }
          ) => void;
          disableAutoSelect: () => void;
        };
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token?: string; error?: string }) => void;
            error_callback?: (err: unknown) => void;
          }) => {
            requestAccessToken: () => void;
          };
        };
      };
    };
  }
}

// Decode Google JWT (ID Token)
export function decodeGoogleJwt(token: string): GoogleUserProfile | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const parsed = JSON.parse(jsonPayload);
    return {
      email: parsed.email || '',
      name: parsed.name || parsed.email?.split('@')[0] || 'Studio Member',
      picture: parsed.picture,
      sub: parsed.sub || ''
    };
  } catch (err) {
    console.warn('Failed to decode Google JWT token:', err);
    return null;
  }
}

let tokenClient: { requestAccessToken: () => void } | null = null;

/**
 * Initialize Google Identity Services
 */
export function initGoogleAuth(
  onSuccess: (user: GoogleUserProfile) => void,
  onError?: (err: unknown) => void
): void {
  if (typeof window === 'undefined') return;

  const tryInit = () => {
    if (!window.google?.accounts) return false;

    try {
      // 1. Initialize ID token credentials for One Tap & standard button
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: response => {
          if (response.credential) {
            const user = decodeGoogleJwt(response.credential);
            if (user && user.email) {
              onSuccess(user);
            }
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true
      });

      // 2. Initialize OAuth2 token client for custom button click (popup account chooser)
      tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'email profile openid',
        callback: async tokenResponse => {
          if (tokenResponse.error) {
            console.warn('Google sign-in error:', tokenResponse.error);
            onError?.(tokenResponse.error);
            return;
          }

          if (tokenResponse.access_token) {
            try {
              // Fetch user info with access token
              const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: {
                  Authorization: `Bearer ${tokenResponse.access_token}`
                }
              });
              if (res.ok) {
                const data = await res.json();
                onSuccess({
                  email: data.email || '',
                  name: data.name || data.given_name || data.email?.split('@')[0] || 'Studio Member',
                  picture: data.picture,
                  sub: data.sub || ''
                });
              } else {
                throw new Error('Failed to fetch userinfo from Google');
              }
            } catch (fetchErr) {
              console.warn('Error fetching Google userinfo:', fetchErr);
              onError?.(fetchErr);
            }
          }
        },
        error_callback: err => {
          console.warn('Google Token Client error:', err);
          onError?.(err);
        }
      });

      return true;
    } catch (e) {
      console.warn('Google GIS initialization failed:', e);
      return false;
    }
  };

  if (!tryInit()) {
    // Retry once script finishes loading
    const interval = setInterval(() => {
      if (tryInit()) {
        clearInterval(interval);
      }
    }, 200);
    setTimeout(() => clearInterval(interval), 5000);
  }
}

/**
 * Trigger the Google Account Chooser popup on click
 */
export function triggerGoogleSignIn(): boolean {
  if (tokenClient) {
    tokenClient.requestAccessToken();
    return true;
  }

  // Fallback: prompt Google One Tap / dialog
  if (window.google?.accounts?.id) {
    window.google.accounts.id.prompt();
    return true;
  }

  return false;
}
