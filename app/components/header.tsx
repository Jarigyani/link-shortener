import { SerializeFrom } from "@remix-run/node";
import { Session, SupabaseClient } from "@supabase/supabase-js";
import { LoginButton } from "./loginButton";

type Props = {
  session: SerializeFrom<Session> | null;
  supabase: SupabaseClient;
  env: SerializeFrom<{ [key: string]: string }>;
};

export const Header = ({ supabase, session, env }: Props) => {
  return (
    <div className="flex justify-between items-center px-5 py-3">
      <p>link shortener</p>
      <LoginButton supabase={supabase} session={session} env={env} />
    </div>
  );
};
