import { OutletContext } from "@/types/types";
import { SerializeFrom } from "@remix-run/node";
import { Form, Link, useFetcher, useOutletContext } from "@remix-run/react";
import { HiOutlineClipboardList } from "react-icons/hi";

type Props = {
  link: SerializeFrom<{
    created_at: string;
    id: string;
    target: string | null;
    user_id: string | null;
  }>;
};

export const LinkItem = ({ link }: Props) => {
  const { env } = useOutletContext<OutletContext>();
  const fetcher = useFetcher();
  const isDeleting =
    fetcher.state !== "idle" && fetcher.formMethod === "DELETE";

  const copyLink = () => {
    navigator.clipboard.writeText(`${env.BASE_URL}/${link.id}`);
  };

  return (
    <tr className="hover">
      <th>{link.id}</th>
      <td>{link.target}</td>
      <td>
        <Link to={`/${link.id}`}>{`${env.BASE_URL}/${link.id}`}</Link>
        <button
          type="button"
          className="btn btn-sm btn-outline"
          onClick={copyLink}
        >
          <HiOutlineClipboardList />
        </button>
      </td>
      <td>
        <Form replace method="DELETE">
          <input type="hidden" name="id" value={link.id} />
          <button type="submit" className="btn" disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </Form>
      </td>
    </tr>
  );
};
