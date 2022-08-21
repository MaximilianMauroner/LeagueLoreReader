import {createRouter} from "./context";
import {env} from "../../env/server.mjs";
import {PrismaClient, Story} from "@prisma/client";
import {z} from "zod";

export const fileRouter = createRouter()
    .query("updateAll", {
        async resolve({ctx}) {
            const fs = require('fs');
            const path = env.NODE_ENV === "development" ? env.DEV_FILE_PATH : env.PROD_FILE_PATH

            await fs.readdir(path, async (err: any, files: any[]) => {
                for (const file of files) {
                    const story = await ctx.prisma.story.findFirst({
                        select: {id: true},
                        where: {textId: file.split(".mp3")[0]}
                    })
                    if (story) {
                        await ctx.prisma.file.upsert({
                                where: {storyId: story.id},
                                update: {
                                    fileName: file,
                                    savePath: path + file,
                                    storyId: story.id
                                },
                                create: {
                                    fileName: file,
                                    savePath: path + file,
                                    storyId: story.id
                                }
                            }
                        )
                    }
                }
            });
            return await ctx.prisma.file.findMany({})
        },
    }).query("create", {
        input: z.object({
            textId: z.string().min(1),
        }),
        async resolve({ctx, input}) {
            const story = await ctx.prisma.story.findFirst({
                where: {textId: input.textId},
                include: {
                    championStories: {
                        include: {
                            champion: true,
                        }
                    }
                }
            })
            if (story) {
                await createFile(story, ctx.prisma);
            }
            return story
        }
    })
    .query("createRandom", {
        async resolve({ctx}) {
            const story = await ctx.prisma.story.findFirst({
                where: {file: null},
                include: {
                    championStories: {
                        include: {
                            champion: true,
                        }
                    },
                    file: true,
                }
            })
            if (story) {
                await createFile(story, ctx.prisma);
            }
            return story
        }
    })


async function createFile(story: Story, prisma: PrismaClient) {
    const content = story.htmlStory.replace(/(<([^>]+)>)/gi, "")
    const gTTS = require('gtts');
    const fs = require('fs');
    var gtts = new gTTS(content, 'en');

    const path = env.NODE_ENV === "development" ? env.DEV_FILE_PATH : env.PROD_FILE_PATH
    let createFile = false;
    if (fs.existsSync(`${path + story.textId}.mp3`)) {
        console.log(`${path + story.textId}.mp3`, "already exists")
        createFile = true;
    } else {
        await gtts.save(`${path + story.textId}.mp3`, async function (err: string | undefined, result: any) {
            if (err) {
                throw new Error(err);
            } else {
                createFile = true
            }
            console.info(`Story with TextId: ${story.textId} created!`);
        });
    }
    if (createFile) {
        await prisma.file.upsert({
                where: {storyId: story.id},
                update: {
                    fileName: `${story.textId}.mp3`,
                    savePath: `${path + story.textId}.mp3`,
                    storyId: story.id
                },
                create: {
                    fileName: `${story.textId}.mp3`,
                    savePath: `${path + story.textId}.mp3`,
                    storyId: story.id
                }
            }
        )
    }


}