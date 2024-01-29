import { createSupabaseServerClient } from "@/utils/supabase/supabaseClient";
import { LoaderFunction, json, redirect } from "@remix-run/node";

export const loader: LoaderFunction = async ({ params, request }) => {
  const { id } = params;
  const response = new Response();
  const client = createSupabaseServerClient({ response, request });

  if (!id) {
    return json({}, { headers: response.headers });
  }

  const { data, error } = await client
    .from("links")
    .select("target")
    .eq("id", id)
    .single();

  if (error) {
    console.log(error);
  }

  if (data?.target) {
    let url: string;
    if (
      data.target.startsWith("http://") ||
      data.target.startsWith("https://")
    ) {
      url = data.target;
    } else {
      url = `http://${data.target}`;
    }
    return redirect(url);
  }

  return json({}, { headers: response.headers });
};
