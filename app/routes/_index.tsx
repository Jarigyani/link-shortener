import { AddCountryForm } from "@/components/addCountryForm";
import { CountryItem } from "@/components/countryItem";
import { Login } from "@/components/login";
import { createSupabaseServerClient } from "@/utils/supabase/supabaseClient";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";

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

  console.log(session);

  return json(data);
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const response = new Response();
  const client = createSupabaseServerClient({ request, response });

  const method = request.method;
  const body = await request.formData();
  const countries = client.from("countries");

  switch (method) {
    case "POST": {
      const name = body.get("name");

      if (!name || typeof name !== "string") {
        return json({ error: "Invalid name" }, { status: 400 });
      }

      return await countries.insert({ name });
    }
    case "DELETE": {
      const id = body.get("id");

      if (!id || typeof id !== "string") {
        return json({ error: "Invalid id" }, { status: 400 });
      }

      return await countries.delete().eq("id", id);
    }
  }
};

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="">
      <h1 className="text-3xl">Welcome to Remix</h1>
      <ul>
        {data?.map((country) => (
          <CountryItem key={country.id} country={country} />
        ))}
      </ul>
      <AddCountryForm />
      <Login />
    </div>
  );
}
