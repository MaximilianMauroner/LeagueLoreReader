import React from "react";
import Loading from "../../components/loading";
import ViewEntityBox from "../../components/view-entity-box";
import ViewAudioFile from "../../components/view-audio-file";
import {GetStaticPaths, GetStaticPropsContext, NextPage} from "next";
import {useRouter} from "next/router";
import {createSSGHelpers} from "@trpc/react/ssg";
import {appRouter} from "../../server/router";
import {createContext} from "../../server/router/context";
import superjson from "superjson";
import {prisma} from "../../server/db/client";
import {z} from "zod";
import {trpc} from "../../utils/trpc";
import Heading from "../../components/heading";
import Navigation from "../../components/navigation";
import {env} from "../../env/server.mjs";

export const StoryPage: NextPage = () => {
    const grid_layout = 'h-auto grid md:grid-cols-2 xl:grid-cols-3 grid-cols-1 mx-3'
    const router = useRouter()
    let {slug} = router.query
    const slugValidator = z.string()
    slug = slugValidator.parse(slug)
    const {data: story, isLoading} = trpc.useQuery(['story.bySlug', {slug}]);

    if (isLoading || story == null) {
        return (<Loading/>)
    }
    return <>
        <Navigation/>
        <div className="bg-gray-800 md:pt-5 pt-2 min-h-screen h-full px-3">
            <div className={"pb-5 text-white content-center flex flex-col items-center"}>
                <article className="relative justify-center xl:w-2/3 w-full lg:w-3/4">
                    <h1 className="mb-4 text-2xl tracking-tight font-bold text-slate-200 text-center">
                        {story.title}
                    </h1>
                    {story?.file ? <ViewAudioFile story={story} champions={story.championStories.map(cs => cs.champion)}
                                                  file={story.file}/> : null}

                    <div className="mb-6 prose text-gray-200 antialiased  tracking-wide prose-dark"
                         dangerouslySetInnerHTML={{__html: story.htmlStory}}/>
                </article>
            </div>
            <Heading title={"Related Champions"}/>
            <div className={grid_layout}>
                {story.championStories.map((cs) => (
                    <div key={cs.champion.id} className={"mx-5"}>
                        <ViewEntityBox
                            entity={{
                                imageUrl: cs.champion.imageUrl,
                                name: cs.champion.name,
                                title: cs.champion.title!,
                                link: "/champion/" + cs.champion.slug
                            }}
                            
                        />
                    </div>
                ))}
            </div>
        </div>
    </>
}
export default StoryPage;

export async function getStaticProps(context: GetStaticPropsContext<{ slug: string }>,) {
    const ssg = createSSGHelpers({
        router: appRouter,
        ctx: await createContext(),
        transformer: superjson,
    });

    const slug = context.params?.slug as string;

    await ssg.fetchQuery('story.bySlug', {
        slug,
    });

    return {
        props: {
            trpcState: ssg.dehydrate(),
            slug,
        },
        revalidate: Number.parseInt(env.REVALIDATE_TIME_SECONDS),
    };
}

export const getStaticPaths: GetStaticPaths = async () => {
    const stories = await prisma.story.findMany({select: {textId: true}});
    return {
        paths: stories.map((story) => ({
            params: {
                slug: story.textId,
            },
        })),
        // https://nextjs.org/docs/basic-features/data-fetching#fallback-blocking
        fallback: 'blocking',
    };
}