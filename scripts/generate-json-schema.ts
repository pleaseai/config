#!/usr/bin/env bun
import { z } from 'zod'
import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { ConfigSchema } from '../src/schema'

/**
 * Generate JSON Schema from Zod schema using Zod v4 native toJSONSchema
 */
async function generateJsonSchema() {
  // Get version from package.json
  const packageJsonPath = resolve(__dirname, '../package.json')
  const packageJson = JSON.parse(await Bun.file(packageJsonPath).text())
  const version = packageJson.version

  // Generate JSON Schema using Zod v4 native API
  const jsonSchema = z.toJSONSchema(ConfigSchema, {
    target: 'draft-7',
    reused: 'inline',
  })

  // Add custom metadata
  const schema = {
    ...jsonSchema,
    $id: `https://unpkg.com/@pleaseai/config@${version}/dist/schema.json`,
    title: 'PleaseAI Configuration Schema',
    description: 'Configuration schema for PleaseAI GitHub bot and CLI',
    version,
  }

  // Write to dist/schema.json
  const outputPath = resolve(__dirname, '../dist/schema.json')
  mkdirSync(dirname(outputPath), { recursive: true })
  writeFileSync(outputPath, JSON.stringify(schema, null, 2), 'utf-8')

  console.log(`✅ JSON Schema generated: ${outputPath}`)
  console.log(`   Schema version: ${schema.version}`)
  console.log(`   Schema ID: ${schema.$id}`)
  console.log(`\n📦 CDN URLs:`)
  console.log(`   unpkg: https://unpkg.com/@pleaseai/config@${version}/dist/schema.json`)
  console.log(`   jsdelivr: https://cdn.jsdelivr.net/npm/@pleaseai/config@${version}/dist/schema.json`)
}

// Run
generateJsonSchema()
