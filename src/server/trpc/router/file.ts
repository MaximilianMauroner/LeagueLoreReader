import {router, publicProcedure} from "../trpc";
import {env} from "../../../env/server.mjs";
import {PrismaClient, Story} from "@prisma/client";
import {z} from "zod";
import * as ftp from "basic-ftp"


export const fileRouter = router({
    updateAll: publicProcedure.query(async ({ctx}) => {
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
    }),
    create: publicProcedure.input(
        z.object({
            textId: z.string().min(1),
        })).query(async ({ctx, input}) => {
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
    }),
    createRandom: publicProcedure.query(async ({ctx}) => {
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
    })
})


async function createFile(story: Story, prisma: PrismaClient) {
    const content = story.htmlStory.replace(/(<([^>]+)>)/gi, "")
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const gTTS = require('gtts');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require('fs');
    const google_text_to_speech = new gTTS(content, 'en');
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
        const filePath = `/app/tempfiles/${story.textId}.mp3`;
        if (!fileCreated) {
            await google_text_to_speech.save(filePath, async function (err: string | undefined, result: any) {
                if (err) {
                    console.log(err)
                    throw new Error(err);
                } else {
                    console.log(result)
                    fileCreated = true
                    const fileCreatedResponse = await client.uploadFrom(filePath, story.textId + ".mp3")
                    console.log("response", fileCreatedResponse)
                    client.close()
                    await fs.unlink(filePath, (err: never) => {
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