import { CountryItem } from "@/components/countryItem";
import { client } from "@/utils/supabase/supabaseClient";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { Form, json, useLoaderData, useNavigation } from "@remix-run/react";
import { useEffect, useRef } from "react";

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

  const nav = useNavigation();

  const isAdding = nav.state !== "idle" && nav.formMethod === "POST";

  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAdding) {
      formRef.current?.reset();
      titleRef.current?.focus();
    }
  }, [isAdding]);

  return (
    <div className="">
      <h1 className="text-3xl">Welcome to Remix</h1>
      <ul>
        {data?.map((country) => (
          <CountryItem key={country.id} country={country} />
        ))}
      </ul>
      <Form ref={formRef} replace method="POST">
        <input ref={titleRef} type="text" name="name" disabled={isAdding} />
        <button type="submit" disabled={isAdding}>
          Add
        </button>
      </Form>
    </div>
  );
}
