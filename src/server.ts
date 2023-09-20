import {fastify} from 'fastify'
import {fastifyCors} from "@fastify/cors"
import { createTranscriptionRoute } from './routes/create-transcription'
import { generateAiCompletionRoute } from './routes/generate-ai-completion'
import { getAllPromptRoute } from './routes/get-all-prompts'
import { uploadVideoRoute } from './routes/upload-video'

const app = fastify()

app.register(fastifyCors, {
    origin: "*"
})

app.register(getAllPromptRoute)
app.register(uploadVideoRoute)
app.register(createTranscriptionRoute)
app.register(generateAiCompletionRoute)


app.listen({
    port: 3333,
}).then(() => {
    console.log('HTTP Server Running on Port 3333')
})