import { getHost } from "~/lib/host";
import { localeAtom } from "~/atoms/locale";
import { useAtom } from "jotai";

export default function Result() {
  const [locale] = useAtom(localeAtom);

  return (
    <>
      <div className="text-center mt-10 bg-slate-100 text-slate-700 px-10 py-10 font-bold">
        {locale === "ja"
          ? "ご回答ありがとうございました。"
          : "Thank you for your response."}
      </div>
      <a href={`${getHost()}/forms/create`}>
        <button className="bg-slate-500 hover: text-white px-5 py-3 mt-14 text-sm rounded">
          {locale === "ja"
            ? "アンケートフォームを作成する"
            : "Create survey form"}
        </button>
      </a>
    </>
  );
}
