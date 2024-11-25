import { Outlet } from "@remix-run/react";
import { localeAtom } from "~/atoms/locale";
import { useAtom } from "jotai";

export default function Forms() {
  const [locale, setLocale] = useAtom(localeAtom);

  return (
    <div>
      <header className="bg-slate-700 text-white">
        <h1 className="py-3 mx-auto text-center">Generative Forms</h1>
      </header>
      <main className="max-w-screen-md mx-auto min-h-screen px-5 text-slate-700">
        <div className="mt-5 flex justify-end">
          <div className="flex">
            <button
              className={`px-4 py-1.5 rounded ${
                locale === "ja" ? "bg-slate-700 text-white" : ""
              }`}
              onClick={() => setLocale("ja")}
            >
              日本語
            </button>
            <button
              className={`px-4 py-1.5 rounded ${
                locale === "en" ? "bg-slate-700 text-white" : ""
              }`}
              onClick={() => setLocale("en")}
            >
              ENGLISH
            </button>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
