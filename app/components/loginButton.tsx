import { loader } from "@/routes/_index";
import { OutletContext } from "@/types/types";
import { SerializeFrom } from "@remix-run/node";
import { useOutletContext } from "@remix-run/react";
import { useState } from "react";

type Props = {
  session: SerializeFrom<typeof loader>["session"];
};

export const LoginButton = ({ session }: Props) => {
  const { supabase } = useOutletContext<OutletContext>();
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
    <div className="flex h-full w-full items-center justify-center">
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
    </div>
  );
};
