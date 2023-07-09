import { MeduzaArticles } from "@prisma/client";

import { Article } from "../Article";
import { Dates } from "./Dates";

export function Feed({ entries }: { entries: MeduzaArticles[] }) {
  return (
    <>
      <div className="md:col-span-2"></div>
      <div className="col-span-12 md:col-span-8">
        {entries.map((entry) => {
          return (
            <div className="my-20" key={entry.id}>
              <div id={String(entry.id)} data-section>
                <Article article={entry} />
              </div>
              <hr className="w-full h-px bg-gray-200 my-12"></hr>
            </div>
          );
        })}
      </div>
      <div className="hidden md:col-span-2 md:flex justify-center relative">
        <div className="fixed top-20">
          <Dates entries={entries} />
        </div>
      </div>
    </>
  );
}
