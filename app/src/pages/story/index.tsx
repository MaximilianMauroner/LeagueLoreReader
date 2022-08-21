import {NextPage} from "next";
import {createSSGHelpers} from "@trpc/react/ssg";
import {appRouter} from "../../server/router";
import {createContext} from "../../server/router/context";
import superjson from "superjson";
import {trpc} from "../../utils/trpc";
import ViewEntityBox from "../../components/view-entity-box";
import React from "react";
import Navigation from "../../components/navigation";
import {env} from "../../env/server.mjs";


const AllStories: NextPage = () => {
    const grid_layout = 'h-auto grid md:grid-cols-2 xl:grid-cols-3 grid-cols-1 mx-3'
    const {data: stories} = trpc.useQuery(['story.getAll']);
    return (
        <>
            <Navigation/>
            <div className="bg-gray-800 pt-5 md:pt-2 min-h-screen h-full px-3">
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
            </div>
        </>
    )
}
export default AllStories;

export async function getStaticProps() {
    const ssg = createSSGHelpers({
        router: appRouter,
        ctx: await createContext(),
        transformer: superjson, // optional - adds superjson serialization
    });

    await ssg.fetchQuery('story.getAll');

    return {
        props: {
            trpcState: ssg.dehydrate(),
        },
        revalidate: Number.parseInt(env.REVALIDATE_TIME_SECONDS),
    };
}
