import {router, publicProcedure, protectedProcedure} from "../trpc";
import {env} from "../../../env/server.mjs";
import {z} from "zod";
import {Context} from "../context"
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

export const factionRouter = router({
    updateAll: publicProcedure.query(async ({ctx}) => {
        const data = await fetch(env.FACTION_URL)
        const jsonData = await data.json()
        const resData = await upsertInitialData(ctx, jsonData)
        await updateDescriptionAndRelations(ctx, resData);
        return resData
    }),
    bySlug: publicProcedure.input(
        z.object({
            slug: z.string().min(1),
        }))
        .query(({ctx, input}) => {
            return ctx.prisma.faction.findFirst({
                where: {slug: input.slug},
                include: {
                    champions: true,
                }
            })
        }),
    getAll: publicProcedure.query(({ctx}) => {
        return ctx.prisma.faction.findMany({
            orderBy: [
                {slug: 'asc',},
            ],
        })
    }),
    getRandomWithLimit: publicProcedure
        .input(
            z.object({
                limit: z.number().min(1),
            }))
        .query(async ({ctx, input}) => {
            const factions = await ctx.prisma.faction.findMany({})
            const ret = [];
            let counter = 0;
            const randomCount = factions.length > 0 ? input.limit / factions.length : 0;
            for (const faction of factions) {
                if (counter >= input.limit) {
                    break;
                }
                if (Math.random() <= randomCount) {
                    counter++;
                    ret.push(faction)
                }
            }
            return ret;
        })
})