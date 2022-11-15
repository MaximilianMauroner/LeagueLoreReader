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
import {router} from "next/client";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../../components/loading";
import {createProxySSGHelpers} from "@trpc/react-query/ssg";


const AllStories: NextPage = () => {
    const grid_layout = 'h-auto grid md:grid-cols-2 xl:grid-cols-3 grid-cols-1 mx-3'
    const {data: stories, isLoading} = trpc.story.getAll.useQuery();
    if (isLoading || stories == undefined) {
        return <Loading/>
    }
    return (
        <>
            <Head>
                <title>All Stories</title>
                <meta name="description"
                      content="List all Stories"/>
            </Head>
            <Navigation/>
            <div className="bg-gray-800 pt-5 md:pt-2 min-h-screen h-full px-3">
                <InfiniteScroll
                    dataLength={stories.length} //This is important field to render the next data
                    next={() => console.log("new data")}
                    hasMore={true}
                    loader={<Loading/>}
                    endMessage={
                        <p style={{textAlign: 'center'}}>
                            <b>Yay! You have seen it all</b>
                        </p>
                    }
                    // below props only if you need pull down functionality
                    refreshFunction={() => console.log("refresh")}
                    pullDownToRefresh
                    pullDownToRefreshThreshold={50}
                    pullDownToRefreshContent={
                        <h3 style={{textAlign: 'center'}}>&#8595; Pull down to refresh</h3>
                    }
                    releaseToRefreshContent={
                        <h3 style={{textAlign: 'center'}}>&#8593; Release to refresh</h3>
                    }>
                    <div className={grid_layout}>
                        {stories?.map((story) => (
                            <div key={story.textId} className={"mx-5"}>
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
                </InfiniteScroll>
            </div>
        </>
    )
}
export default AllStories;

export async function getStaticProps() {
    const ssg = await createProxySSGHelpers({
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
