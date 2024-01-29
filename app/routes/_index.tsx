import { createSupabaseServerClient } from "@/utils/supabase/supabaseClient";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = new Response();
  const client = createSupabaseServerClient({ request, response });
  const { data } = await client.from("countries").select("*");

  const {
    data: { session },
  } = await client.auth.getSession();

  return json({ data, session }, { headers: response.headers });
};

export default function Index() {
  return <div className="">home</div>;
}
