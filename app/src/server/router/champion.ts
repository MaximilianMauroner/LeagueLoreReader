import {Context, createRouter} from "./context";
import {env} from "../../env/server.mjs";
import {Champion, StoryType, Story} from "@prisma/client";
import {map, z} from "zod";


export const championRouter = createRouter()
    .query("updateAll", {
        async resolve({ctx}) {
            const data = await fetch(env.CHAMPIONS_URL)
            const jsonData = await data.json()
            const resData = await upsertInitialData(ctx, jsonData)
            await updateTitle(ctx, resData);
            return resData
        },
    })
    .query("bySlug", {
            input: z.object({
                slug: z.string().min(1),
            }),
            async resolve({ctx, input}) {

                const champion = await ctx.prisma.champion.findFirst({
                    where: {slug: input.slug},
                    include: {
                        faction: true,
                        ChampionStories: {
                            include: {
                                story: true,
                            }
                        }
                    }
                })
                let stories: number[] = []
                champion?.ChampionStories.forEach((v) => {
                    stories.push(v.storyId)
                })
                const relatedChamps = await ctx.prisma.champion.findMany({
                    where: {
                        ChampionStories: {
                            some: {
                                storyId: {in: stories},
                                NOT: {championId: champion!.id}
                            }
                        },
                    }
                })
                return {championData: champion, relatedChampions: relatedChamps}
            }
        }
    )


async function upsertInitialData(ctx: Context, json: any) {
    for (const champion of json.champions) {
        const faction = await ctx.prisma.faction.findFirst({select: {id: true}, where: {slug: champion.slug}})
        await ctx.prisma.champion.upsert({
            where: {
                slug: champion.slug,
            },
            update: {
                name: champion.name,
                slug: champion.slug,
                releaseDate: champion["release-date"],
                url: env.SINGLE_CHAMPION_URL.replace("championSlug", champion.slug),
                imageUrl: champion.image.uri,
                factionId: faction?.id
            },
            create: {
                name: champion.name,
                slug: champion.slug,
                releaseDate: champion["release-date"],
                url: env.SINGLE_CHAMPION_URL.replace("championSlug", champion.slug),
                imageUrl: champion.image.uri,
                factionId: faction?.id
            },
        })
    }
    return await ctx.prisma.champion.findMany({})
}

async function updateTitle(ctx: Context, resData: Champion[]) {
    let championStories = new Map<string, Set<number>>();
    for (const champion of resData) {

        let stories = []
        const data = await fetch(champion.url);
        const jsonData = await data.json()
        await ctx.prisma.champion.update({
            where: {
                id: champion.id,
            },
            data: {
                title: jsonData.champion.title ?? "",
            },
        })

        stories.push({
            title: jsonData.champion.title,
            textId: jsonData.champion.slug,
            htmlStory: jsonData.champion.biography.full,
            type: StoryType.BIOGRAPHY,
            imageUrl: jsonData.champion.image.uri
        })
        if (!championStories.has(champion.slug)) {
            championStories.set(champion.slug, new Set([champion.id]))
        }


        for (const singleStory of jsonData.modules) {
            if (singleStory.type == "story-preview") {

                const storyData = await fetch(env.SINGLE_STORY_URL.replace("storyUrl", singleStory.url));
                const storyJSONData = await storyData.json()
                let htmlStory = "";
                for (const section of storyJSONData.story["story-sections"]) {
                    for (const subSection of section["story-subsections"]) {
                        htmlStory += "</br>" + subSection.content
                    }
                }
                stories.push({
                    title: storyJSONData.story.title,
                    textId: storyJSONData.id,
                    htmlStory: htmlStory,
                    type: StoryType.COLOUR,
                    imageUrl: storyJSONData.story["story-sections"][0]["background-image"].uri
                })
                if (championStories.has(storyJSONData.id)) {
                    let t = championStories.get(storyJSONData.id);
                    t?.add(champion.id);
                    championStories.set(storyJSONData.id, t!);
                } else {
                    championStories.set(storyJSONData.id, new Set([champion.id]))
                }
            }

        }
        await createStories(ctx, stories);
    }
    await linkChampsAndStories(ctx, championStories)
}

async function createStories(ctx: Context, stories: any) {
    for (const story of stories) {
        await ctx.prisma.story.upsert({
            where: {
                textId: story.textId,
            },
            update: {
                title: story.title,
                textId: story.textId,
                htmlStory: story.htmlStory,
                type: story.type,
                imageUrl: story.imageUrl
            },
            create: {
                title: story.title,
                textId: story.textId,
                htmlStory: story.htmlStory,
                type: story.type,
                imageUrl: story.imageUrl
            }
        })
    }
}

const linkValidator = z.map(z.string(), z.set(z.number()))

async function linkChampsAndStories(ctx: Context, championStories: z.infer<typeof linkValidator>) {

    linkValidator.parse(championStories);
    let keys: string[] = [];
    championStories.forEach((stories, index) => {
        keys.push(index)
    })
    for (const story of keys) {
        const champIds = championStories.get(story)
        const champIdArray: number[] = [];
        champIds!.forEach((v) => champIdArray.push(v));
        for (const singleChampId of champIdArray) {

            const storyRes = await ctx.prisma.story.findFirst({select: {id: true}, where: {textId: story}})
            const allChampStories = await ctx.prisma.championStories.findMany({where: {championId: singleChampId}})
            if (allChampStories.findIndex(v => v.storyId == storyRes?.id! && v.championId == singleChampId) == -1) {
                await ctx.prisma.championStories.create({
                    data: {
                        storyId: storyRes?.id!,
                        championId: singleChampId,
                    }
                })
            }
        }
    }
}