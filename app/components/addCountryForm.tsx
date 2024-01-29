import { Form, useNavigation } from "@remix-run/react";
import { useEffect, useRef } from "react";

export const AddCountryForm = () => {
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
    <Form ref={formRef} replace method="POST" className="join">
      <input
        ref={titleRef}
        type="text"
        name="name"
        disabled={isAdding}
        className="input join-item input-bordered"
      />
      <button type="submit" disabled={isAdding} className="btn join-item">
        Add
      </button>
    </Form>
  );
};
