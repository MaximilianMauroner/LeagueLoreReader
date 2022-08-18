import {createRouter} from "./context";
import {env} from "../../env/server.mjs";
import {z} from "zod";


export const storyRouter = createRouter()
    .query("bySlug", {
        input: z.object({
            slug: z.string().min(1),
        }),
        async resolve({ctx, input}) {
            return await ctx.prisma.story.findFirst({
                where: {textId: input.slug},
                include: {
                    championStories: {
                        include: {
                            champion: true,
                        }
                    }
                }
            })
        }
    })
    .query("getAll", {
        async resolve({ctx}) {
            return await ctx.prisma.story.findMany({
                orderBy: [
                    {title: 'asc',},
                    {textId: 'asc',}
                ],
                include: {
                    championStories: {
                        include: {
                            champion: true,
                        }
                    }
                }
            })
        }
    })
;