import { client } from "@/utils/supabase/supabaseClient";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { Form, json, useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { data } = await client.from("countries").select("*");

  return json(data);
};

export const action = async ({ request }: ActionFunctionArgs) => {
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
