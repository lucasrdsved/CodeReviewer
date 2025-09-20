
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useAuth() {
  const { data: session, isLoading } = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
    retry: false,
  });

  return {
    user: session?.user,
    session,
    isLoading,
    isAuthenticated: !!session?.user,
  };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signUp(email: string, password: string, metadata?: any) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata
    }
  });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  return { error };
}
