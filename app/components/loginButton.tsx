import { loader } from "@/routes/_index";
import { SerializeFrom } from "@remix-run/node";
import { SupabaseClient } from "@supabase/supabase-js";
import { useState } from "react";

type Props = {
  supabase: SupabaseClient;
  session: SerializeFrom<typeof loader>["session"];
};

export const LoginButton = ({ supabase, session }: Props) => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: "http://localhost:3000/auth/callback" },
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
