import React from "react";
import Loading from "../../components/loading";
import ViewEntityBox from "../../components/view-entity-box";
import type {GetStaticPaths, NextPage, GetStaticPropsContext} from "next";
import {useRouter} from "next/router";
import {trpc} from "../../utils/trpc";
import {prisma} from '../../server/db/client';
import superjson from 'superjson';
import {createSessionlessContext} from "../../server/trpc/context";
import {z} from "zod";
import type {Champion} from "@prisma/client";
import Image from "next/image";
import Navigation from "../../components/navigation";
import Heading from "../../components/heading";
import {env} from "../../env/server.mjs";
import Head from "next/head";
import {createProxySSGHelpers} from "@trpc/react-query/ssg";
import {appRouter} from "../../server/trpc/router/_app";


const ChampionPage: NextPage = () => {
    const grid_layout = 'h-auto grid md:grid-cols-2 grid-cols-1 sm:mx-3 mx-1'
    const router = useRouter()
    let {slug} = router.query
    const slugValidator = z.string()
    slug = slugValidator.parse(slug)
    const {data: resData, isLoading} = trpc.champion.bySlug.useQuery({slug});
    const championData = resData?.championData
    const relatedChampions = resData?.relatedChampions

    if (isLoading || championData == null) {
        return (<Loading/>)
    }
    return (
        <>
            <Head>
                <title>{[championData.name, championData.title].join(" ")}</title>
                <meta name="description"
                      content={[championData.name, championData.title].join(" ")}/>
            </Head>
            <Navigation/>
            <div className="bg-gray-800 pt-5 md:pt-2 min-h-screen h-full px-3">
                <div className={"w-auto"}>
                    <DisplayChampion champion={championData}/>
                </div>
                <Heading title={"Stories"}/>
                <div className={grid_layout}>
                    {championData.championStories.map((story) => (
                        <div key={story.storyId} className={"md:mx-5 sm:mx-3 mx-1"}>
                            <ViewEntityBox
                                entity={{
                                    imageUrl: story.story.imageUrl,
                                    name: story.story.title,
                                    title: championData.name,
                                    link: "/story/" + story.story.textId
                                }}


                            />
                        </div>
                    ))}
                </div>
                {championData?.faction ?
                    <>
                        <Heading title={"Region"}/>
                        <div className={"w-auto"}>
                            <ViewEntityBox
                                entity={{
                                    imageUrl: championData.faction.imageUrl,
                                    title: championData.faction.title,
                                    link: "/faction/" + championData.faction.slug
                                }}

                            />
                        </div>
                    </>
                    : null
                }
                {relatedChampions?.length ?
                    <>
                        <Heading title={"Related Champions"}/>
                        <div className={grid_layout}>
                            {relatedChampions.map((champion) => (
                                <div key={champion.id} className={"md:mx-5 sm:mx-3 mx-1"}>
                                    <ViewEntityBox
                                        entity={{
                                            imageUrl: champion.imageUrl,
                                            name: champion.name,
                                            title: champion.title!,
                                            link: "/champion/" + champion.slug
                                        }}

                                    />
                                </div>
                            ))}
                        </div>
                    </> : null}
            </div>
        </>
    )

}
const DisplayChampion: React.FC<{ champion: Champion }> = ({champion}) => {
    return (
        <div className="container mx-auto py-9 md:py-2">
            <div className="flex items-strech justify-center flex-col ">
                <div className="flex flex-col items-strech justify-between py-3 px-1 md:py-6 md:px-6">
                    <h1 className={"text-center pt-3 text-4xl text-white"}>{champion.name}</h1>
                    <h1 className={"text-center pb-3 text-3xl text-white"}>{champion.title}</h1>
                    <div className={"relative h-96"}>
                        <Image
                            fill
                            src={champion.imageUrl}
                            className={"sm:object-contain object-cover rounded-xl"}
                            alt={champion.name}
                            priority={true}
                        />
                    </div>
                    <div
                        className={"text-center py-3 text-xl text-white"}>{"Release Date: " + champion.releaseDate?.toLocaleDateString()}</div>
                </div>
            </div>
        </div>
    )
}

export async function getStaticProps(context: GetStaticPropsContext<{ slug: string }>) {
    const ssg = createProxySSGHelpers({
        router: appRouter,
        ctx: await createSessionlessContext(),
        transformer: superjson
    });


    const slug = context.params?.slug as string;

    await ssg.champion.bySlug.prefetch({slug});

    return {
        props: {
            trpcState: ssg.dehydrate(),
            slug,
        },
        revalidate: Number.parseInt(env.REVALIDATE_TIME_SECONDS),
    };
}

export const getStaticPaths: GetStaticPaths = async () => {
    const champions = await prisma.champion.findMany({select: {slug: true}});
    return {
        paths: champions.map((champion) => ({
            params: {
                slug: champion.slug,
            },
        })),
        // https://nextjs.org/docs/basic-features/data-fetching#fallback-blocking
        fallback: 'blocking',
    };
}


export default ChampionPage