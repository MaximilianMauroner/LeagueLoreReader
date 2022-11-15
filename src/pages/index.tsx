import type {NextPage} from "next";
import Head from "next/head";
import {trpc} from "../utils/trpc";
import Navigation from "../components/navigation";
import ViewEntityBox from "../components/view-entity-box";
import React, {ReactElement, useEffect, useState} from "react";
import Loading from "../components/loading";
import {Champion, Faction, Story, ChampionStories} from "@prisma/client";

const box_class = "md:mx-5 sm:mx-3 mx-1" 

function prepareFactionData(factions: Faction[], combinedData: ReactElement[]) {
    factions.forEach((faction) => {
        combinedData.push(
            <div key={faction.slug} className={box_class}>
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
            <div key={story.textId} className={box_class}>
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
            <div key={champion.id} className={box_class}>
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

const Home: NextPage = () => {
    const grid_layout = 'h-auto grid md:grid-cols-2 xl:grid-cols-3 grid-cols-1 sm:mx-3 mx-1'
    const combinedData: ReactElement[] = [];
    const [shuffled, setShuffled] = useState<ReactElement[]>([]);
    const {data: factions, isLoading: factionLoading} = trpc.faction.getAll.useQuery();
    const {data: champions, isLoading: championLoading} = trpc.champion.getAll.useQuery();
    const {data: stories, isLoading: storyLoading} = trpc.story.getAll.useQuery();
    const [dataLoaded, setDataLoaded] = useState<boolean>(false);

    useEffect(() => {
        const shuffle = (array: ReactElement[]) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                const temp = array[i];
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                array[i] = array[j];
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                array[j] = temp;
            }
        };
        setShuffled(() => {
            shuffle(combinedData);
            return combinedData;
        })
    }, [dataLoaded])

    if (factionLoading || championLoading || storyLoading || !factions || !champions || !stories) {
        return <Loading/>
    }

    prepareFactionData(factions, combinedData);
    prepareStoryData(stories, combinedData);
    prepareChampionData(champions, combinedData);
    if (!dataLoaded) {
        setDataLoaded(true)
    }


    return (
        <>
            <Head>
                <title>League of Legends Lore Reader</title>
                <meta name="description" content="LoreReader"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <Navigation/>
            <main className="bg-gray-800 pt-5 md:pt-2  min-h-screen h-full px-1 sm:px-3">
                <div className={grid_layout}>
                    {shuffled}
                </div>
            </main>
        </>
    );
};

export default Home;
