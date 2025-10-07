import React, { useEffect, useState, type PropsWithChildren } from "react";
import { supabase } from '../lib/supabaseClient';
import type { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      const u = data.session?.user;
      if (u) setUser({ id: u.id, email: u.email!, name: (u.user_metadata?.name as string) || "" });
    })();
  }, []);
  return { user, setUser };
};

// No-JSX provider so this compiles in .ts files
export function AuthProvider({ children }: PropsWithChildren<{}>) {
  return React.createElement(React.Fragment, null, children);
}





