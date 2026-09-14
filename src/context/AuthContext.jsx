import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured, DEMO_TECHNICIANS } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Inicialmente null a menos que exista una sesión previa guardada
  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('neyvix_active_user');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return null;
        }
      }
    }
    return null;
  });

  // Solo mostrar loading si Supabase está realmente configurado y pendiente de verificar
  const [loading, setLoading] = useState(() => isSupabaseConfigured());

  const hydrateUserFromSupabase = useCallback(async (authUser) => {
    if (!authUser) return null;

    try {
      if (isSupabaseConfigured() && supabase) {
        const { data: tech, error } = await supabase
          .from('technicians')
          .select('*')
          .eq('email', authUser.email)
          .maybeSingle();

        if (!error && tech) {
          const hydrated = {
            id: tech?.id || authUser?.id,
            email: authUser?.email || '',
            full_name: tech?.full_name || authUser?.user_metadata?.full_name || 'Técnico Neyvix',
            role: tech?.role || 'technician',
            phone: tech?.phone || '929443131',
            avatar_url: tech?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          };
          setUser(hydrated);
          localStorage.setItem('neyvix_active_user', JSON.stringify(hydrated));
          return hydrated;
        }
      }
    } catch (err) {
      console.warn('Advertencia al consultar tabla technicians:', err);
    }

    // Fallback con datos seguros del usuario de Auth
    const fallbackUser = {
      id: authUser?.id || 'usr-' + Date.now(),
      email: authUser?.email || '',
      full_name: authUser?.user_metadata?.full_name || authUser?.email?.split?.('@')?.[0]?.toUpperCase() || 'Técnico Neyvix',
      role: 'technician',
      phone: '929443131',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    };
    setUser(fallbackUser);
    localStorage.setItem('neyvix_active_user', JSON.stringify(fallbackUser));
    return fallbackUser;
  }, []);

  useEffect(() => {
    let mounted = true;

    // Si Supabase NO está configurado, asegurar de inmediato que loading sea false
    if (!isSupabaseConfigured() || !supabase) {
      setLoading(false);
      return;
    }

    // Temporizador de seguridad: SIEMPRE pasar loading a false tras 1500ms
    const fallbackTimer = setTimeout(() => {
      if (mounted) {
        setLoading(false);
      }
    }, 1500);

    // Consultar sesión activa de Supabase
    supabase.auth
      .getSession()
      .then(async (response) => {
        if (!mounted) return;
        const session = response?.data?.session;
        if (session?.user) {
          await hydrateUserFromSupabase(session.user);
        } else {
          setUser(null);
          localStorage.removeItem('neyvix_active_user');
        }
      })
      .catch((err) => {
        console.warn('Aviso: no se pudo verificar sesión de Supabase:', err);
        if (mounted) {
          setUser(null);
        }
      })
      .finally(() => {
        if (mounted) {
          clearTimeout(fallbackTimer);
          setLoading(false);
        }
      });

    // Listener para cambios de estado de autenticación
    let subscription = null;
    try {
      const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (!mounted) return;
        if (session?.user) {
          await hydrateUserFromSupabase(session.user);
        } else {
          setUser(null);
          localStorage.removeItem('neyvix_active_user');
        }
        setLoading(false);
      });
      subscription = data?.subscription;
    } catch (e) {
      console.warn('Error al suscribir onAuthStateChange:', e);
    }

    return () => {
      mounted = false;
      clearTimeout(fallbackTimer);
      if (subscription?.unsubscribe) {
        subscription.unsubscribe();
      }
    };
  }, [hydrateUserFromSupabase]);

  /**
   * Inicio de sesión exclusivo con correo y contraseña
   */
  const login = async (email, password) => {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      if (data?.user) {
        return await hydrateUserFromSupabase(data.user);
      }
      return null;
    }

    // Modo local / Fallback para taller si Supabase no está conectado
    const foundDemo = DEMO_TECHNICIANS.find(
      (t) => t.email.toLowerCase() === email.toLowerCase()
    );

    if (foundDemo) {
      setUser(foundDemo);
      localStorage.setItem('neyvix_active_user', JSON.stringify(foundDemo));
      return foundDemo;
    }

    // Permitir acceso con credenciales proporcionadas
    const activeUser = {
      id: 'usr-' + Date.now(),
      email: email || '',
      full_name: email?.split?.('@')?.[0]?.toUpperCase() || 'Técnico Neyvix',
      role: email?.toLowerCase()?.includes('admin') ? 'admin' : 'technician',
      phone: '929443131',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    };

    setUser(activeUser);
    localStorage.setItem('neyvix_active_user', JSON.stringify(activeUser));
    return activeUser;
  };

  /**
   * Actualizar datos del perfil del técnico y contraseña
   */
  const updateProfile = async ({ full_name, phone, password }) => {
    if (!user) throw new Error('No hay sesión de usuario activa');

    const updates = {};
    if (full_name && full_name.trim()) updates.full_name = full_name.trim();
    if (phone !== undefined) updates.phone = phone.trim();

    // 1. Si Supabase está conectado, actualizar en Supabase Auth y tabla technicians
    if (isSupabaseConfigured() && supabase) {
      // Si se proporcionó nueva contraseña
      if (password && password.trim()) {
        const { error: passErr } = await supabase.auth.updateUser({
          password: password.trim(),
        });
        if (passErr) throw passErr;
      }

      // Actualizar metadata de auth
      if (updates.full_name) {
        const { error: metaErr } = await supabase.auth.updateUser({
          data: { full_name: updates.full_name },
        });
        if (metaErr) console.warn('Error al actualizar metadata de Auth:', metaErr);
      }

      // Actualizar tabla technicians si existe
      try {
        await supabase
          .from('technicians')
          .update({
            full_name: updates.full_name || user.full_name,
            phone: updates.phone !== undefined ? updates.phone : user.phone,
            updated_at: new Date().toISOString(),
          })
          .eq('email', user.email);
      } catch (err) {
        console.warn('No se pudo actualizar tabla technicians directamente:', err);
      }
    }

    // 2. Actualizar estado reactivo local y localStorage
    const updatedUser = {
      ...user,
      full_name: updates.full_name || user.full_name,
      phone: updates.phone !== undefined ? updates.phone : user.phone,
    };

    setUser(updatedUser);
    localStorage.setItem('neyvix_active_user', JSON.stringify(updatedUser));
    return updatedUser;
  };

  /**
   * Cierre de sesión formal: limpia la sesión pero MANTIENE al usuario dentro de /taller
   * para que de inmediato aparezca el formulario de Login sin redirigir a la landing page comercial
   */
  const logout = async () => {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.error('Error al cerrar sesión en Supabase:', e);
      }
    }
    setUser(null);
    localStorage.removeItem('neyvix_active_user');

    // Mantener la ruta en /taller para que otro técnico pueda ingresar credenciales de inmediato
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname.toLowerCase();
      if (!currentPath.includes('taller') && !currentPath.includes('admin')) {
        window.history.replaceState(null, '', '/taller');
      }
      // Notificar cambio de estado para renderizar login
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isSupabase: isSupabaseConfigured(),
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
