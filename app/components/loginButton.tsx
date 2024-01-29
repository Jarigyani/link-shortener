import { SerializeFrom } from "@remix-run/node";
import { Session, SupabaseClient } from "@supabase/supabase-js";
import { useState } from "react";

type Props = {
  supabase: SupabaseClient;
  session: SerializeFrom<Session> | null;
  env: SerializeFrom<{ [key: string]: string }>;
};

export const LoginButton = ({ supabase, session, env }: Props) => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${env.BASE_URL}/auth/callback` },
    });
    setLoading(false);
  };

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
  };

  return (
    <>
      {session ? (
        <button
          type="button"
          className="btn"
          onClick={handleLogout}
          disabled={loading}
        >
          Logout
        </button>
      ) : (
        <button
          type="button"
          className="btn"
          onClick={handleLogin}
          disabled={loading}
        >
          Login
        </button>
      )}
    </>
  );
};
