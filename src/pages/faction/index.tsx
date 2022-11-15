import {NextPage} from "next";
import {appRouter} from "../../server/trpc/router/_app";
import {createSessionlessContext} from "../../server/trpc/context";
import superjson from "superjson";
import {trpc} from "../../utils/trpc";
import ViewEntityBox from "../../components/view-entity-box";
import React from "react";
import Navigation from "../../components/navigation";
import {env} from "../../env/server.mjs";
import Head from "next/head";
import {createProxySSGHelpers} from "@trpc/react-query/ssg";


const AllFactions: NextPage = () => {
    const grid_layout = 'h-auto grid md:grid-cols-2 xl:grid-cols-3 grid-cols-1 mx-3'
    const {data: factions, isLoading} = trpc.faction.getAll.useQuery();
    return <>
        <Head>
            <title>All Factions</title>
            <meta name="description"
                  content="List all Factions"/>
        </Head>
        <Navigation/>
        <div className="bg-gray-800 pt-5 md:pt-2 min-h-screen h-full px-3">
            <div className={grid_layout}>
                {factions?.map((faction) => (
                    <div key={faction.slug} className={"mx-5"}>
                        <ViewEntityBox
                            entity={{
                                imageUrl: faction.imageUrl,
                                title: faction.title,
                                link: "/faction/" + faction.slug
                            }}

                        />
                    </div>
                ))}
            </div>
        </div>
    </>
}
export default AllFactions;

export async function getStaticProps() {
    const ssg = await createProxySSGHelpers({
        router: appRouter,
        ctx: await createSessionlessContext(),
        transformer: superjson
    });


    await ssg.faction.getAll.prefetch();

    return {
        props: {
            trpcState: ssg.dehydrate(),
        },
        revalidate: Number.parseInt(env.REVALIDATE_TIME_SECONDS),
    };
}
