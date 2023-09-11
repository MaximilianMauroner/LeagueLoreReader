import Heading from "@/components/heading";
import ViewAudioFile from "@/components/view-audio-file";
import ViewEntityBox from "@/components/view-entity-box";
import { db } from "@/server/db/client";
import { StoryType } from "@prisma/client";
import type { Metadata } from "next";

const StoryPage = async ({ params }: { params: { slug: string } }) => {
  const grid_layout =
    "h-auto grid md:grid-cols-2 xl:grid-cols-3 grid-cols-1 sm:mx-3 mx-1";
  const slug = params.slug;
  const story = await db.story.findFirstOrThrow({
    where: { textId: slug },
    include: {
      championStories: {
        include: {
          champion: true,
        },
      },
      file: true,
    },
  });
  return (
    <>
      <div className="h-full min-h-screen bg-gray-800 px-3 pt-2 md:pt-5">
        <div
          className={
            "flex flex-col content-center items-center pb-5 text-white"
          }
        >
          <article className="relative w-full justify-center lg:w-3/4 xl:w-2/3">
            <h1 className="mb-4 text-center text-2xl font-bold tracking-tight text-slate-200">
              {story.title}
            </h1>
            {story?.file && (
              <ViewAudioFile
                story={story}
                champions={story.championStories.map((cs) => cs.champion)}
                file={story.file}
              />
            )}

            <div
              className="prose prose-dark mb-6 tracking-wide  text-gray-200 antialiased"
              dangerouslySetInnerHTML={{ __html: story.htmlStory }}
            />
          </article>
        </div>
        <Heading title={"Related Champions"} />
        <div className={grid_layout}>
          {story.championStories.map((cs) => (
            <div key={cs.champion.id} className={"mx-1 sm:mx-3 md:mx-5"}>
              <ViewEntityBox
                entity={{
                  imageUrl: cs.champion.imageUrl,
                  name: cs.champion.name,
                  title: cs.champion.title ?? "",
                  link: "/champion/" + cs.champion.slug,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
export default StoryPage;
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  // read route params
  const slug = params.slug;

  const story = await db.story.findFirstOrThrow({
    where: { textId: slug },
    include: {
      championStories: {
        include: {
          champion: true,
        },
      },
      file: true,
    },
  });

  let title = `${story.title}: ${story.championStories
    .map((cs) => cs.champion.name)
    .join(", ")}`;

  if (story.type === StoryType.BIOGRAPHY) {
    title = `${story.championStories
      .map((cs) => cs.champion.name)
      .join(", ")} ${story.title}`;
  }

  return {
    title: title,
    description: title,
  };
}
