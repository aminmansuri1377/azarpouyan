"use client";

import { useState } from "react";

import { trpc } from "@/lib/trpc/client";

export default function LanguagesPage() {
  const utils = trpc.useUtils();

  const { data } = trpc.language.getAll.useQuery();

  const createLanguage = trpc.language.create.useMutation({
    onSuccess() {
      utils.language.getAll.invalidate();
    },
  });

  const [code, setCode] = useState("");

  const [name, setName] = useState("");
  const deleteLanguage = trpc.language.delete.useMutation({
    onSuccess() {
      utils.language.getAll.invalidate();
    },
  });
  const updateLanguage = trpc.language.update.useMutation({
    onSuccess() {
      utils.language.getAll.invalidate();
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
          onClick={() =>
            createLanguage.mutate({
              code,
              name,
            })
          }
        >
          Add
        </button>
      </div>

      <hr />

      {data?.map((language) => (
        <div key={language.id}>
          {language.code}
          {" - "}
          {language.name}
          <button
            onClick={() => {
              deleteLanguage.mutate({
                id: language.id,
              });
            }}
          >
            Delete
          </button>
          <button
            onClick={() => {
              const name = prompt("Language name", language.name);

              if (!name) return;

              updateLanguage.mutate({
                id: language.id,

                code: language.code,

                name,

                enabled: language.enabled,

                sortOrder: language.sortOrder,
              });
            }}
          >
            Edit
          </button>
          <button
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
