import { AddCountryForm } from "@/components/addCountryForm";
import { CountryItem } from "@/components/countryItem";
import { OutletContext } from "@/types/types";
import { createSupabaseServerClient } from "@/utils/supabase/supabaseClient";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { Form, json, useLoaderData, useOutletContext } from "@remix-run/react";

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

  return json({ data, session }, { headers: response.headers });
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

      await countries.insert({ name });
      return json({}, { headers: response.headers });
    }
    case "DELETE": {
      const id = body.get("id");

      if (!id || typeof id !== "string") {
        return json(
          { error: "Invalid id" },
          { headers: response.headers, status: 400 }
        );
      }

      await countries.delete().eq("id", id);
      return json({}, { headers: response.headers });
    }
  }
};

export default function Index() {
  const { data } = useLoaderData<typeof loader>();

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

const Login = () => {
  const { session } = useLoaderData<typeof loader>();
  const { supabase } = useOutletContext<OutletContext>();

  const handleLogin = () => {
    supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      {session ? (
        <Form replace method="POST" action="/login">
          <input type="hidden" name="action" value="logout" />
          <button type="submit" className="btn btn-primary btn-wide">
            Logout
          </button>
        </Form>
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
