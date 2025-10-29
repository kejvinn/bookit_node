import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import Handlebars from 'handlebars'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class EmailTemplates {
  constructor() {
    this.templatesPath = path.join(__dirname, '../../templates/emails')
    this.cache = new Map()
    this.partialsRegistered = false
  }

  // Register Handlebars partials (header, footer, etc.)
  async registerPartials() {
    if (this.partialsRegistered) return

    const partialsDir = path.join(this.templatesPath, 'partials')

    try {
      const files = await fs.readdir(partialsDir)

      for (const file of files) {
        if (file.endsWith('.hbs')) {
          const name = path.parse(file).name
          const content = await fs.readFile(path.join(partialsDir, file), 'utf-8')
          Handlebars.registerPartial(name, content)
        }
      }

      this.partialsRegistered = true
    } catch (error) {
      console.error('Failed to register partials:', error)
    }
  }

  // Load and compile a template
  async loadTemplate(templatePath) {
    const cacheKey = templatePath

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    const content = await fs.readFile(templatePath, 'utf-8')
    const compiled = Handlebars.compile(content)

    if (process.env.NODE_ENV === 'production') {
      this.cache.set(cacheKey, compiled)
    }

    return compiled
  }

  // Render an email template with layout
  async render(templateName, variables = {}) {
    await this.registerPartials()

    // Load content template
    const contentPath = path.join(this.templatesPath, 'content', `${templateName}.hbs`)
    const contentTemplate = await this.loadTemplate(contentPath)
    const renderedContent = contentTemplate(variables)

    // Load layout template
    const layoutPath = path.join(this.templatesPath, 'layouts', 'base.hbs')
    const layoutTemplate = await this.loadTemplate(layoutPath)

    // Render final email with layout
    return layoutTemplate({
      ...variables,
      content: renderedContent,
      year: new Date().getFullYear(),
      title: variables.title || 'Airbnb Clone'
    })
  }
}

export const emailTemplates = new EmailTemplates()
