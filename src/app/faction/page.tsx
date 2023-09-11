import ViewEntityBox from "@/components/view-entity-box";
import { db } from "@/server/db/client";
import type { Faction } from "@prisma/client";
import type { Metadata } from "next";

const AllFactions = async () => {
  const grid_layout =
    "h-auto grid md:grid-cols-2 xl:grid-cols-3 grid-cols-1 sm:mx-3 mx-1";
  const factions = await db.faction.findMany();
  return (
    <>
      <div className="h-full min-h-screen bg-gray-800 px-1 pt-5 sm:px-3 md:pt-2">
        <div className={grid_layout}>
          {factions?.map((faction: Faction) => (
            <div key={faction.slug} className={"mx-1 sm:mx-3 md:mx-5"}>
              <ViewEntityBox
                entity={{
                  imageUrl: faction.imageUrl,
                  title: faction.title,
                  link: "/faction/" + faction.slug,
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
  title: "All Factions",
  description: "List of all League of Legends Factions.",
};
export default AllFactions;
