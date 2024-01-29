import { SerializeFrom } from "@remix-run/node";
import { Session, SupabaseClient } from "@supabase/supabase-js";
import { LoginButton } from "./loginButton";

type Props = {
  session: SerializeFrom<Session> | null;
  supabase: SupabaseClient;
};

export const Header = ({ supabase, session }: Props) => {
  return (
    <div className="flex justify-between items-center px-5 py-3">
      <p>link shortener</p>
      <LoginButton supabase={supabase} session={session} />
    </div>
  );
};
