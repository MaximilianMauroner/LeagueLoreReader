import {createRouter} from "./context";
import {env} from "../../env/server.mjs";
import {z} from "zod";
import {createContext} from "preact/compat";
import type {Context} from "./context"
import {Faction} from "@prisma/client";


async function upsertInitialData(ctx: Context, json: any) {
    for (const faction of json.factions) {
        await ctx.prisma.faction.upsert({
            where: {
                slug: faction.slug,
            },
            update: {
                title: faction.name,
                slug: faction.slug,
                url: env.SINGLE_FACTION_URL.replace("factionName", faction.slug),
                imageUrl: faction.image.uri
            },
            create: {
                title: faction.name,
                slug: faction.slug,
                description: "",
                url: env.SINGLE_FACTION_URL.replace("factionName", faction.slug),
                imageUrl: faction.image.uri
            },
        })
    }
    return await ctx.prisma.faction.findMany({})

}

async function updateDescriptionAndRelations(ctx: Context, resData: Faction[]) {
    for (const faction of resData) {
        const data = await fetch(faction.url);
        const jsonData = await data.json()
        await ctx.prisma.faction.update({
            where: {
                id: faction.id,
            },
            data: {
                description: jsonData.faction.overview.short ?? "",
            },
        })
    }
}

export const factionRouter = createRouter()
    .query("updateAll", {
        async resolve({ctx}) {
            const data = await fetch(env.FACTION_URL)
            const jsonData = await data.json()
            const resData = await upsertInitialData(ctx, jsonData)
            await updateDescriptionAndRelations(ctx, resData);
            return resData
        },
    })
    .query("bySlug", {
        input: z.object({
            slug: z.string().min(1),
        }),
        async resolve({ctx, input}) {
            return await ctx.prisma.faction.findFirst({
                where: {slug: input.slug},
                include: {
                    champions: true,
                }
            })
        }
    })
    .query("getAll", {
        async resolve({ctx}) {
            return await ctx.prisma.faction.findMany({
                orderBy: [
                    {slug: 'asc',},
                ],
            })
        }
    });