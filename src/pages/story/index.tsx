import {NextPage} from "next";
import {appRouter} from "../../server/trpc/router/_app";
import {createContext, createSessionlessContext} from "../../server/trpc/context";
import superjson from "superjson";
import {trpc} from "../../utils/trpc";
import ViewEntityBox from "../../components/view-entity-box";
import React from "react";
import Navigation from "../../components/navigation";
import {env} from "../../env/server.mjs";
import Head from "next/head";
import Loading from "../../components/loading";
import {createProxySSGHelpers} from "@trpc/react-query/ssg";
import HeadComponent from "../../components/head";


const AllStories: NextPage = () => {
    const grid_layout = 'h-auto grid md:grid-cols-2 xl:grid-cols-3 grid-cols-1 sm:mx-3 mx-1'
    const {data: stories, isLoading} = trpc.story.getAll.useQuery();
    if (isLoading || stories == undefined) {
        return <Loading/>
    }
    return (
        <>
            <HeadComponent title={"All Stories"} description={"List all Stories"}/>
            <Navigation/>
            <div className="bg-gray-800 pt-5 md:pt-2 min-h-screen h-full px-1 sm:px-3 ">
                <div className={grid_layout}>
                    {stories?.map((story) => (
                        <div key={story.textId} className={"mx-1 sm:mx-3 md:mx-5"}>
                            <ViewEntityBox
                                entity={{
                                    imageUrl: story.imageUrl,
                                    name: story.title,
                                    title: story.championStories.map((es) => es.champion.name).join(", "),
                                    link: "/story/" + story.textId
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
export default AllStories;

export async function getStaticProps() {
    const ssg = createProxySSGHelpers({
        router: appRouter,
        ctx: await createSessionlessContext(),
        transformer: superjson
    });


    await ssg.story.getAll.prefetch();

    return {
        props: {
            trpcState: ssg.dehydrate(),
        },
        revalidate: Number.parseInt(env.REVALIDATE_TIME_SECONDS),
    };
}
