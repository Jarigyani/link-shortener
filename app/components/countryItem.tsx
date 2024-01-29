import { useFetcher } from "@remix-run/react";

type Props = {
  country: {
    id: number;
    name: string;
  };
};

export const CountryItem = ({ country }: Props) => {
  const fetcher = useFetcher();
  const isDeleting =
    fetcher.state !== "idle" && fetcher.formMethod === "DELETE";

  return (
    <li key={country.id} className="pl-5 flex gap-5">
      {country.name}
      <fetcher.Form method="DELETE">
        <input type="hidden" name="id" value={country.id} />
        <button type="submit" disabled={isDeleting} className="btn">
          Delete
        </button>
      </fetcher.Form>
    </li>
  );
};
