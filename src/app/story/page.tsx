import ViewEntityBox from "@/components/view-entity-box";
import { db } from "@/utils/db/client";
import type { Metadata } from "next";
import { Pagination } from "@/components/Pagination";

const AllStories = async ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: Record<string, string | string[] | undefined>;
}) => {
  const grid_layout =
    "h-auto grid md:grid-cols-2 xl:grid-cols-3 grid-cols-1 sm:mx-3 mx-1";

  const pageNumber = +(searchParams?.page ?? 1);

  const pageSize = 20;
  const skip = (pageNumber - 1) * pageSize;
  const take = pageSize;

  const stories = await db.story.findMany({
    skip,
    take,
    include: { championStories: { include: { champion: true } } },
  });

  const total = await db.story.count();

  const maxPage = Math.ceil((total ?? 1) / pageSize);

  const hasNext = skip + take < total;
  const hasPrev = pageNumber > 1;

  return (
    <>
      <div className="h-full min-h-screen bg-gray-800 px-1 pt-5 sm:px-3 md:pt-2 ">
        <div className={grid_layout}>
          {stories?.map((story) => (
            <div key={story.textId} className={"mx-1 sm:mx-3 md:mx-5"}>
              <ViewEntityBox
                entity={{
                  imageUrl: story.imageUrl,
                  name: story.title,
                  title: story.championStories
                    .map((es) => es.champion.name)
                    .join(", "),
                  link: "/story/" + story.textId,
                }}
              />
            </div>
          ))}
        </div>
        <Pagination
          paginationInfo={{ current: pageNumber, hasNext, hasPrev, maxPage }}
        />
      </div>
    </>
  );
};
export const metadata: Metadata = {
  title: "All Stories",
  description: "List of all League of Legends Stories.",
};
export default AllStories;
