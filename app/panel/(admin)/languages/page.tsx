"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import { trpc } from "@/lib/trpc/client";

export default function LanguagesPage() {
  const utils = trpc.useUtils();

  const { data } = trpc.language.getAll.useQuery();

  const [code, setCode] = useState("");
  const [name, setName] = useState("");

  const createLanguage = trpc.language.create.useMutation({
    onSuccess(data) {
      toast.success(data.message);

      utils.language.getAll.invalidate();

      setCode("");
      setName("");
    },

    onError(error) {
      toast.error(error.message);
    },
  });

  const updateLanguage = trpc.language.update.useMutation({
    onSuccess(data) {
      toast.success(data.message);

      utils.language.getAll.invalidate();
    },

    onError(error) {
      toast.error(error.message);
    },
  });

  const deleteLanguage = trpc.language.delete.useMutation({
    onSuccess(data) {
      toast.success(data.message);

      utils.language.getAll.invalidate();
    },

    onError(error) {
      toast.error(error.message);
    },
  });

  return (
    <div>
      <h2>Languages</h2>

      <div>
        <input
          placeholder="fa"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <input
          placeholder="Persian"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          disabled={createLanguage.isPending}
          onClick={() =>
            createLanguage.mutate({
              code,
              name,
            })
          }
        >
          {createLanguage.isPending ? "Creating..." : "Add"}
        </button>
      </div>

      <hr />

      {data?.map((language) => (
        <div key={language.id}>
          {language.code} - {language.name}
          <button
            disabled={deleteLanguage.isPending}
            onClick={() => {
              deleteLanguage.mutate({
                id: language.id,
              });
            }}
          >
            Delete
          </button>
          <button
            disabled={updateLanguage.isPending}
            onClick={() => {
              const newName = prompt("Language name", language.name);

              if (!newName) return;

              updateLanguage.mutate({
                id: language.id,
                code: language.code,
                name: newName,
                enabled: language.enabled,
                sortOrder: language.sortOrder,
              });
            }}
          >
            Edit
          </button>
          <button
            disabled={updateLanguage.isPending}
            onClick={() => {
              updateLanguage.mutate({
                id: language.id,
                code: language.code,
                name: language.name,
                enabled: !language.enabled,
                sortOrder: language.sortOrder,
              });
            }}
          >
            {language.enabled ? "Disable" : "Enable"}
          </button>
        </div>
      ))}
    </div>
  );
}
