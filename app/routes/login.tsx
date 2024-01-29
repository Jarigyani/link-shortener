import { createSupabaseServerClient } from "@/utils/supabase/supabaseClient";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return redirect("/");
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const response = new Response();
  const client = createSupabaseServerClient({ request, response });

  const body = await request.formData();
  const action = body.get("action");

  switch (action) {
    case "logout":
      await client.auth.signOut();
      return json({}, { headers: response.headers });
    default:
      return json({}, { headers: response.headers });
  }
};
