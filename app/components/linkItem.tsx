import { SerializeFrom } from "@remix-run/node";
import { Form, Link, useFetcher } from "@remix-run/react";

type Props = {
  link: SerializeFrom<{
    created_at: string;
    id: string;
    target: string | null;
    user_id: string | null;
  }>;
};

export const LinkItem = ({ link }: Props) => {
  const fetcher = useFetcher();
  const isDeleting =
    fetcher.state !== "idle" && fetcher.formMethod === "DELETE";

  const copyLink = () => {
    navigator.clipboard.writeText(`http://localhost:3000/${link.id}`);
  };

  return (
    <li key={link.id} className="flex items-center gap-5">
      <span>{link.target}</span>
      <Link to={`/${link.id}`}>{`http://localhost:3000/${link.id}`}</Link>
      <button type="button" className="btn" onClick={copyLink}>
        copy
      </button>
      <Form replace method="DELETE">
        <input type="hidden" name="id" value={link.id} />
        <button type="submit" className="btn" disabled={isDeleting}>
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </Form>
    </li>
  );
};
