import React, {useEffect, useState} from "react";
import Loading from "../../components/loading";
import ViewEntityBox from "../../components/view-entity-box";
import {GetStaticPaths, GetStaticProps, NextPage, GetStaticPropsContext, InferGetStaticPropsType} from "next";
import {useRouter} from "next/router";
import {trpc} from "../../utils/trpc";
import {championRouter} from "../../server/router/champion";
import {prisma} from '../../server/db/client';
import {createSSGHelpers} from '@trpc/react/ssg';
import {appRouter} from '../../server/router';
import superjson from 'superjson';
import {createContext} from "../../server/router/context";
import {z} from "zod";
import {Champion} from "@prisma/client";
import Image from "next/image";
import Navigation from "../../components/navigation";
import Heading from "../../components/heading";


const ChampionPage: NextPage = () => {
    const grid_layout = 'h-auto grid md:grid-cols-2 grid-cols-1 mx-3'
    const router = useRouter()
    let {slug} = router.query
    const slugValidator = z.string()
    slug = slugValidator.parse(slug)
    const {data: resData, isLoading} = trpc.useQuery(['champion.bySlug', {slug}]);
    const championData = resData?.championData
    const relatedChampions = resData?.relatedChampions

    if (isLoading || championData == null) {
        return (<Loading/>)
    }
    return (
        <>
            <Navigation/>
            <div className="bg-gray-800 pt-5 md:pt-2 min-h-screen h-full px-3">
                <div className={"w-auto"}>
                    <DisplayChampion champion={championData}/>
                </div>
                <Heading title={"Stories"}/>
                <div className={grid_layout}>
                    {championData.championStories.map((story) => (
                        <div key={story.storyId} className={"mx-5"}>
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
                                <div key={champion.id} className={"mx-5"}>
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
                <div className="flex flex-col items-strech justify-between py-6 px-6">
                    <h1 className={"text-center pt-3 text-4xl text-white"}>{champion.name}</h1>
                    <h1 className={"text-center pb-3 text-3xl text-white"}>{champion.title}</h1>
                    <div>
                        <Image
                            src={champion.imageUrl}
                            layout="responsive"
                            width={1000}
                            height={500}
                            className={"object-cover"}
                            alt={champion.name}
                            priority={true}
                        />
                    </div>
                    <div
                        className={"text-center py-3 text-xl text-white"}>{"Release Date: " + champion.releaseDate}</div>
                </div>
            </div>
        </div>
    )
}

export async function getStaticProps(context: GetStaticPropsContext<{ slug: string }>,) {
    const ssg = createSSGHelpers({
        router: appRouter,
        ctx: await createContext(),
        transformer: superjson, // optional - adds superjson serialization
    });

    const slug = context.params?.slug as string;

    await ssg.fetchQuery('champion.bySlug', {
        slug,
    });

    return {
        props: {
            trpcState: ssg.dehydrate(),
            slug,
        },
        revalidate: 1,
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