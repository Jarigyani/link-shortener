import { Database } from "@/utils/supabase/database.types";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { Form, json, useLoaderData } from "@remix-run/react";
import { createServerClient } from "@supabase/auth-helpers-remix";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = new Response();
  const supabaseClient = createServerClient<Database>(
    process.env.SUPABASE_URL ?? "",
    process.env.SUPABASE_ANON_KEY ?? "",
    { request, response }
  );

  const { data } = await supabaseClient.from("countries").select("*");

  return json(
    { data },
    {
      headers: response.headers,
    }
  );
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const method = request.method;
  const body = await request.formData();

  const response = new Response();

  const supabaseClient = createServerClient<Database>(
    process.env.SUPABASE_URL ?? "",
    process.env.SUPABASE_ANON_KEY ?? "",
    { request, response }
  );

  if (method === "POST") {
    const name = body.get("name");

    if (!name || typeof name !== "string") {
      console.log("error");
      return "error";
    }

    const { error } = await supabaseClient.from("countries").insert({ name });

    if (error) {
      return "error";
    }

    return "success";
  }

  if (method === "DELETE") {
    const id = body.get("id");

    if (!id || typeof id !== "string") {
      return "error";
    }

    const { error } = await supabaseClient
      .from("countries")
      .delete()
      .eq("id", id);

    if (error) {
      return "error";
    }

    return "success";
  }
};

export default function Index() {
  const { data } = useLoaderData<typeof loader>();
  return (
    <div className="">
      <h1 className="text-3xl">Welcome to Remix</h1>
      <ul>
        {data?.map((country) => (
          <li key={country.id} className="pl-5 flex gap-5">
            {country.name}
            <Form replace method="DELETE">
              <input type="hidden" name="id" value={country.id} />
              <button type="submit">Delete</button>
            </Form>
          </li>
        ))}
      </ul>
      <Form replace method="POST">
        <input type="text" name="name" />
        <button type="submit">Add</button>
      </Form>
    </div>
  );
}
