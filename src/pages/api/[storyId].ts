import type {
    NextApiRequest,
    NextApiResponse,
} from 'next/types';

import fs from 'fs'
import path from 'path'

export default function (req: NextApiRequest, res: NextApiResponse) {
    const {storyId} = req.query
    const filePath = path.resolve('.', `src/pages/api/LoreFiles/${storyId}`)
    const audioBuffer = fs.readFileSync(filePath)
    res.setHeader('Content-Type', 'audio/mpeg')
    res.send(audioBuffer)
}