import ViewEntityBox from "@/components/view-entity-box";
import { db } from "@/utils/db/client";
import type { Champion } from "@prisma/client";
import type { Metadata } from "next";

const AllChampions = async () => {
  const grid_layout =
    "h-auto grid md:grid-cols-2 xl:grid-cols-4 grid-cols-1 sm:mx-3 mx-1";
  const champions = await db.champion.findMany({});
  return (
    <>
      <div className="h-full min-h-screen bg-gray-800 px-1 pt-5 sm:px-3 md:pt-2">
        <div className={grid_layout}>
          {champions.map((champion: Champion) => (
            <div key={champion.id} className={"mx-1 sm:mx-3 md:mx-5"}>
              <ViewEntityBox
                entity={{
                  imageUrl: champion.imageUrl,
                  name: champion.name,
                  title: champion.title!,
                  link: "/champion/" + champion.slug,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
export const metadata: Metadata = {
  title: "All Champions",
  description: "List of all League of Legends champions.",
};
export default AllChampions;
