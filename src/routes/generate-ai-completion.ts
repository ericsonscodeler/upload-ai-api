import { FastifyInstance } from "fastify";
import {prisma} from '../lib/prisma'

import {z} from 'zod'
import { openai } from "../lib/openai";

export async function generateAiCompletionRoute(app: FastifyInstance){
    app.post('/ai/complete', async (request, reply) => {

    const bodySchema = z.object({
        videoId: z.string().uuid(),
        prompt: z.string(),
        temperature: z.number().min(0).max(1).default(0.5)
    })

    const {videoId,temperature,prompt} = bodySchema.parse(request.body)

    const video = await prisma.video.findUniqueOrThrow({
        where: {
            id: videoId,
        }
    })

    if (!video.transcription){
        return reply.status(400).send({
            error: "Video transcription wasn't generated yet."
        })
    }

    const promptMessage = prompt.replace('{transcription}', video.transcription)

    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo-16k',
        temperature,
        messages: [
            {
                role: 'user',
                content: promptMessage
            }
        ]
    })
    return response.choices[0].message.content
  })
}