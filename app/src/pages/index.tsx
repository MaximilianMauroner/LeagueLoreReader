import type {NextPage} from "next";
import Head from "next/head";
import {trpc} from "../utils/trpc";
import Navigation from "../components/navigation";
import AllFactions from "./faction";
import AllChampions from "./champion";
import AllStories from "./story";
import {createSSGHelpers} from "@trpc/react/ssg";
import {appRouter} from "../server/router";
import {createContext} from "../server/router/context";
import superjson from "superjson";
import ViewEntityBox from "../components/view-entity-box";
import React, {ReactElement} from "react";
import Loading from "../components/loading";
import {array} from "zod";
import {Champion, Faction, Story, ChampionStories} from "@prisma/client";

type TechnologyCardProps = {
    name: string;
    description: string;
    documentation: string;
};

function prepareFactionData(factions: Faction[], combinedData: ReactElement[]) {
    factions.forEach((faction) => {
        combinedData.push(
            <div key={faction.slug} className={"mx-5"}>
                <ViewEntityBox
                    entity={{
                        imageUrl: faction.imageUrl,
                        title: faction.title!,
                        link: "/faction/" + faction.slug!
                    }}
                />
            </div>
        )
    })
}

function prepareStoryData(stories: (Story & { championStories: (ChampionStories & { champion: Champion })[] })[], combinedData: ReactElement[]) {
    stories.forEach((story) => {
        combinedData.push(
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
        )
    })
}

function prepareChampionData(champions: Champion[], combinedData: ReactElement[]) {
    champions.forEach((champion) => {
        combinedData.push(
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
        )
    })
}

function randomizeArray(combinedData: ReactElement[]) {
    //randomize positions in array
    for (let i = combinedData.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        // @ts-ignore
        [combinedData[i], combinedData[j]] = [combinedData[j], combinedData[i]];
    }
}

const Home: NextPage = () => {
    const grid_layout = 'h-auto grid md:grid-cols-2 xl:grid-cols-3 grid-cols-1 mx-3'
    const combinedData: ReactElement[] = [];
    const {data: factions, isLoading: factionLoading} = trpc.useQuery(['faction.getAll']);
    const {data: champions, isLoading: championLoading} = trpc.useQuery(['champion.getAll']);
    const {data: stories, isLoading: storyLoading} = trpc.useQuery(['story.getAll']);


    if (factionLoading || championLoading || storyLoading || !factions || !champions || !stories) {
        return <Loading/>
    }
    prepareFactionData(factions, combinedData);
    prepareStoryData(stories, combinedData);
    prepareChampionData(champions, combinedData);
    return (
        <>
            <Head>
                <title>Lorereader</title>
                <meta name="description" content="LoreReader"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className="bg-gray-800 pt-5 md:pt-2 min-h-screen h-full px-3">
                <Navigation/>
                <div className={grid_layout}>
                    {combinedData}
                </div>
            </main>
        </>
    );
};

export async function getStaticProps() {
    const ssg = createSSGHelpers({
        router: appRouter,
        ctx: await createContext(),
        transformer: superjson, // optional - adds superjson serialization
    });

    await ssg.fetchQuery('faction.getAll');
    await ssg.fetchQuery('champion.getAll');
    await ssg.fetchQuery('story.getAll');

    return {
        props: {
            trpcState: ssg.dehydrate(),
        },
        revalidate: 1,
    };
}


export default Home;
