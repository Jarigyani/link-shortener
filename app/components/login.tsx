import type { OutletContext } from "@/types/types";
import { useOutletContext } from "@remix-run/react";

export const Login = () => {
  const { supabase, session } = useOutletContext<OutletContext>();

  const handleLogin = () => {
    supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  const handleLogout = () => {
    supabase.auth.signOut();
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      {session ? (
        <button
          type="button"
          className="btn btn-primary btn-wide"
          onClick={handleLogout}
        >
          Logout
        </button>
      ) : (
        <button
          type="button"
          className="btn btn-primary btn-wide"
          onClick={handleLogin}
        >
          Login
        </button>
      )}
    </div>
  );
};
