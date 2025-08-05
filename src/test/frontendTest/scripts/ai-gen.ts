import { OpenAI } from 'openai'
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

async function generate() {
  const script = fs.readFileSync('script.codegen.ts', 'utf-8')

  const prompt = `À partir du script Playwright suivant, génère :
1. Un fichier Page Object Model (TypeScript)
2. Un fichier Gherkin (.feature)
3. Les step definitions correspondants (TypeScript pour Cucumber)

Script :
${script}`

  const response = await openai.chat.completions.create({
   model: 'gpt-3.5-turbo', // ⬅️ Changer ici si GPT-4 non dispo
  messages: [{ role: 'user', content: prompt }],
  temperature: 0.2,
  })

  const output = response.choices[0].message.content || ''
  fs.writeFileSync('generated-output.md', output)
  console.log('✅ Génération IA terminée. Résultat dans "generated-output.md"')
}

generate()
