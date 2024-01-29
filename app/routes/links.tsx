import { LinkItem } from "@/components/linkItem";
import { createSupabaseServerClient } from "@/utils/supabase/supabaseClient";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { nanoid } from "nanoid";
import { useEffect, useRef } from "react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = new Response();
  const client = createSupabaseServerClient({ request, response });
  const session = await client.auth.getSession();
  const userId = session.data.session?.user.id;

  if (!userId) {
    return redirect("/");
  }

  const { data, error } = await client
    .from("links")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.log(error);
  }

  return json({ data }, { headers: response.headers });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  console.log("call");
  const response = new Response();
  const client = createSupabaseServerClient({ request, response });
  const session = await client.auth.getSession();
  const userId = session.data.session?.user.id;
  const body = new URLSearchParams(await request.text());

  switch (request.method) {
    case "POST": {
      let target = body.get("target");
      const id = nanoid(5);

      if (!target) {
        return redirect("/links");
      }

      if (target.startsWith("http://") || target.startsWith("https://")) {
        // delete protocol
        target = target.replace(/(^\w+:|^)\/\//, "");
      }

      const { data, error } = await client
        .from("links")
        .insert({ id, target, user_id: userId });

      if (error) {
        console.log(error);
      }

      return json({}, { headers: response.headers });
    }
    case "DELETE": {
      const id = body.get("id");

      if (!id) {
        return redirect("/links");
      }

      const { data, error } = await client.from("links").delete().eq("id", id);

      if (error) console.log(error);

      return json({}, { headers: response.headers });
    }
  }
};

export default function Links() {
  const { data } = useLoaderData<typeof loader>();
  const [animateRef] = useAutoAnimate();

  const nav = useNavigation();

  const isAdding = nav.state !== "idle" && nav.formMethod === "POST";

  const formRef = useRef<HTMLFormElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAdding) {
      formRef.current?.reset();
      linkRef.current?.focus();
    }
  }, [isAdding]);

  return (
    <div>
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th />
            <th>link</th>
            <th>generated</th>
            <th />
          </tr>
        </thead>
        <tbody ref={animateRef}>
          {data?.map((link) => (
            <LinkItem link={link} key={link.id} />
          ))}
        </tbody>
      </table>
      <Form ref={formRef} replace method="POST" className="join">
        <input
          ref={linkRef}
          type="text"
          name="target"
          required
          className="input input-bordered join-item"
          placeholder="example.com"
        />
        <button type="submit" className="btn join-item" disabled={isAdding}>
          add link
        </button>
      </Form>
    </div>
  );
}
