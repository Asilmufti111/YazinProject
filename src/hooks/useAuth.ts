import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const restore = async () => {
      const { data } = await supabase.auth.getSession();
      const sessionUser = data.session?.user;

      if (sessionUser) {
        setUser({
          id: sessionUser.id,
          email: sessionUser.email!,
          name: sessionUser.user_metadata?.name || '',
        });
      }
    };

    restore();
  }, []);

  return { user, setUser };
};
