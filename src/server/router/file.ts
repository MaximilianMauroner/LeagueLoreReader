import {createRouter} from "./context";
import {env} from "../../env/server.mjs";
import {PrismaClient, Story} from "@prisma/client";
import {z} from "zod";
import path from 'path'
import * as ftp from "basic-ftp"
import * as fsp from 'node:fs/promises';


export const fileRouter = createRouter()
    .query("updateAll", {
        async resolve({ctx}) {
            const client = new ftp.Client()
            try {
                await client.access({
                    host: env.FTP_SERVER_HOST,
                    user: env.FTP_SERVER_USERNAME,
                    password: env.FTP_SERVER_PASSWORD,
                    secure: true
                })
                const files = await client.list()
                for (const file of files) {
                    const story = await ctx.prisma.story.findFirst({
                        select: {id: true},
                        where: {textId: file.name.split(".mp3")[0]}
                    })
                    if (story) {
                        await ctx.prisma.file.upsert({
                                where: {storyId: story.id},
                                update: {
                                    fileName: file.name,
                                    savePath: file.name,
                                    storyId: story.id
                                },
                                create: {
                                    fileName: file.name,
                                    savePath: file.name,
                                    storyId: story.id
                                }
                            }
                        )
                    }
                }
            } catch (err) {
                console.log(err)
                client.close()
            }
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
    let gtts = new gTTS(content, 'en');
    const client = new ftp.Client()
    let fileCreated = false;
    try {
        await client.access({
            host: env.FTP_SERVER_HOST,
            user: env.FTP_SERVER_USERNAME,
            password: env.FTP_SERVER_PASSWORD,
            secure: true
        })
        const files = await client.list()

        for (const file of files) {
            if (file.name === story.textId + ".mp3") {
                console.log(`${story.textId}.mp3`, "already exists")
                fileCreated = true;
            }
        }
        if (!fileCreated) {
            await gtts.save(`${story.textId}.mp3`, async function (err: string | undefined, result: any) {
                if (err) {
                    console.log(err)
                    throw new Error(err);
                } else {
                    console.log(result)
                    fileCreated = true
                    const fileCreatedResponse = await client.uploadFrom(`${story.textId}.mp3`, story.textId + ".mp3")
                    console.log("response", fileCreatedResponse)
                    client.close()
                    await fs.unlink(`${story.textId}.mp3`, (err: any) => {
                        if (err) throw err;
                        console.log(`successfully deleted ${story.textId}.mp3`);
                    });
                }
                console.info(`Story with TextId: ${story.textId} created!`);
            })
        }
    } catch
        (err) {
        console.log(err)
        client.close()
    }


    if (fileCreated) {
        await prisma.file.upsert({
                where: {storyId: story.id},
                update: {
                    fileName: `${story.textId}.mp3`,
                    savePath: `${story.textId}.mp3`,
                    storyId: story.id
                },
                create: {
                    fileName: `${story.textId}.mp3`,
                    savePath: `${story.textId}.mp3`,
                    storyId: story.id
                }
            }
        )
    }
}