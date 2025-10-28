# CLAUDE.md - @pleaseai/config

This file provides guidance to Claude Code when working with the PleaseAI Config package.

**Project Standards:**
@../../docs/STANDARDS.md
@../../docs/TDD.md
@../../docs/commit-convention.md
@package.json

## Overview

PleaseAI configuration schema, loader, and generator. Provides type-safe configuration management for PleaseAI GitHub bot and CLI using Zod validation and YAML serialization.

## Tech Stack

- **Validation**: Zod 4.1.12 (schema validation)
- **YAML**: js-yaml 4.1.0 (parsing/serialization)
- **Build**: tsup (TypeScript bundler)
- **Runtime**: Node.js (ESM)

## Project Structure

```
packages/config/
├── src/
│   ├── index.ts          # Main exports
│   ├── schema.ts         # Zod schemas and types
│   ├── loader.ts         # Config loading from files/GitHub
│   └── generator.ts      # Config generation and helpers
├── tests/                # Test files (*.test.ts)
├── dist/                 # Built output
└── package.json
```

## Development

### Environment Setup

```bash
# Install dependencies (from monorepo root)
bun install

# Build the package
bun --filter @pleaseai/config build

# Development with watch mode
bun --filter @pleaseai/config dev
```

### Testing

```bash
# Run tests
bun --filter @pleaseai/config test

# Watch mode
bun run test:projects:watch

# Specific test file
bun vitest run packages/config/tests/schema.test.ts
```

## Configuration Schema

### Full Configuration (src/schema.ts)

```typescript
import { z } from 'zod'

export const ConfigSchema = z.object({
  // General settings
  language: Language.default('ko'),           // 'ko' | 'en'
  ignore_patterns: z.array(z.string()).default([]),

  // Code review configuration
  code_review: CodeReviewConfigSchema.optional().default({
    disable: false,
    comment_severity_threshold: 'MEDIUM',
    max_review_comments: -1,
    pull_request_opened: {
      help: false,
      summary: true,
      code_review: true,
      include_drafts: true,
    }
  }),

  // Issue workflow configuration
  issue_workflow: IssueWorkflowConfigSchema.optional().default({
    disable: false,
    triage: {
      auto: true,
      manual: true,
      update_issue_type: true,
    },
    investigate: {
      enabled: true,
      org_members_only: true,
      auto_on_bug_label: false,
    },
    fix: {
      enabled: true,
      org_members_only: true,
      require_investigation: false,
      auto_create_pr: true,
      auto_run_tests: true,
    }
  })
})

export type Config = z.infer<typeof ConfigSchema>
```

### Code Review Config

```typescript
export const CodeReviewConfigSchema = z.object({
  disable: z.boolean().default(false),
  comment_severity_threshold: SeverityLevel.default('MEDIUM'), // LOW | MEDIUM | HIGH
  max_review_comments: z.number().default(-1), // -1 for unlimited
  pull_request_opened: PullRequestOpenedConfigSchema.optional()
})
```

**Options:**
- `disable`: Completely disable code review feature
- `comment_severity_threshold`: Only post comments above this severity
- `max_review_comments`: Limit number of review comments (-1 = unlimited)
- `pull_request_opened`: Auto-actions when PR is opened

### Issue Workflow Config

```typescript
export const IssueWorkflowConfigSchema = z.object({
  disable: z.boolean().default(false),

  triage: z.object({
    auto: z.boolean().default(true),          // Auto-triage new issues
    manual: z.boolean().default(true),        // Allow manual /please triage
    update_issue_type: z.boolean().default(true), // Update issue type label
  }),

  investigate: z.object({
    enabled: z.boolean().default(true),
    org_members_only: z.boolean().default(true),
    auto_on_bug_label: z.boolean().default(false),
  }),

  fix: z.object({
    enabled: z.boolean().default(true),
    org_members_only: z.boolean().default(true),
    require_investigation: z.boolean().default(false),
    auto_create_pr: z.boolean().default(true),
    auto_run_tests: z.boolean().default(true),
  })
})
```

## Core Functions

### 1. Loading Config (src/loader.ts)

#### Load from Local File

```typescript
import { loadConfig } from '@pleaseai/config'

// Load from repository root
const config = await loadConfig('/path/to/repo')

// Returns validated Config object
// Falls back to DEFAULT_CONFIG if file doesn't exist
```

**Implementation:**

```typescript
export async function loadConfig(repoPath: string): Promise<Config> {
  const configPath = path.join(repoPath, '.please', 'config.yml')

  // Check if config file exists
  if (!fs.existsSync(configPath)) {
    return DEFAULT_CONFIG
  }

  // Read and parse YAML
  const content = await fs.promises.readFile(configPath, 'utf-8')
  const data = yaml.load(content)

  // Validate with Zod schema
  return ConfigSchema.parse(data)
}
```

#### Load from GitHub

```typescript
import { loadConfigFromGitHub } from '@pleaseai/config'
import { Octokit } from '@octokit/rest'

const octokit = new Octokit({ auth: 'token' })

// Load from GitHub repository
const config = await loadConfigFromGitHub(
  octokit,
  'owner',
  'repo',
  'main'  // optional ref (branch/tag/commit)
)
```

**Implementation:**

```typescript
export async function loadConfigFromGitHub(
  octokit: Octokit,
  owner: string,
  repo: string,
  ref?: string
): Promise<Config> {
  try {
    // Fetch .please/config.yml from GitHub
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path: '.please/config.yml',
      ref,
    })

    // Decode base64 content
    const content = Buffer.from(data.content, 'base64').toString('utf-8')
    const parsed = yaml.load(content)

    // Validate with Zod
    return ConfigSchema.parse(parsed)
  } catch (error) {
    // File not found or invalid
    return DEFAULT_CONFIG
  }
}
```

### 2. Generating Config (src/generator.ts)

#### Generate Config Object

```typescript
import { generateConfig } from '@pleaseai/config'

const config = generateConfig({
  language: 'en',
  enableCodeReview: true,
  enableIssueWorkflow: true,
})
```

**Implementation:**

```typescript
export interface GenerateConfigOptions {
  language?: 'ko' | 'en'
  enableCodeReview?: boolean
  enableIssueWorkflow?: boolean
  ignorePatterns?: string[]
}

export function generateConfig(options: GenerateConfigOptions): Config {
  return {
    language: options.language || 'ko',
    ignore_patterns: options.ignorePatterns || [],
    code_review: {
      disable: !options.enableCodeReview,
      ...DEFAULT_CONFIG.code_review,
    },
    issue_workflow: {
      disable: !options.enableIssueWorkflow,
      ...DEFAULT_CONFIG.issue_workflow,
    },
  }
}
```

#### Generate YAML String

```typescript
import { generateConfigYAML } from '@pleaseai/config'

const yaml = generateConfigYAML({
  language: 'ko',
  enableCodeReview: true,
})

console.log(yaml)
// Output:
// language: ko
// code_review:
//   disable: false
//   ...
```

**Implementation:**

```typescript
export function generateConfigYAML(options: GenerateConfigOptions): string {
  const config = generateConfig(options)
  return yaml.dump(config, {
    indent: 2,
    lineWidth: 100,
    noRefs: true,
  })
}
```

### 3. Helper Functions (src/generator.ts)

#### Code Review Helpers

```typescript
import {
  isCodeReviewDisabled,
  shouldReviewPR,
  getCommentSeverityThreshold,
  getMaxReviewComments,
} from '@pleaseai/config'

// Check if code review is disabled
if (isCodeReviewDisabled(config)) {
  return // Skip review
}

// Check if PR should be reviewed
const isDraft = true
if (shouldReviewPR(config, isDraft)) {
  // Perform review
}

// Get severity threshold
const threshold = getCommentSeverityThreshold(config) // 'LOW' | 'MEDIUM' | 'HIGH'

// Get max comments limit
const maxComments = getMaxReviewComments(config) // number (-1 for unlimited)
```

#### Issue Workflow Helpers

```typescript
import {
  isAutoTriageEnabled,
  isInvestigateEnabled,
  isFixEnabled,
  getLanguage,
} from '@pleaseai/config'

// Check if auto-triage is enabled
if (isAutoTriageEnabled(config)) {
  // Auto-triage new issue
}

// Check if investigate is enabled
if (isInvestigateEnabled(config)) {
  // Allow /please investigate command
}

// Check if fix is enabled
if (isFixEnabled(config)) {
  // Allow /please fix command
}

// Get language preference
const language = getLanguage(config) // 'ko' | 'en'
```

## Example Configuration Files

### Minimal Config (Korean, defaults)

```yaml
language: ko
```

### Full Config (English, customized)

```yaml
language: en

code_review:
  disable: false
  comment_severity_threshold: HIGH
  max_review_comments: 10
  pull_request_opened:
    help: true
    summary: true
    code_review: true
    include_drafts: false

issue_workflow:
  disable: false
  triage:
    auto: true
    manual: true
    update_issue_type: true
  investigate:
    enabled: true
    org_members_only: true
    auto_on_bug_label: false
  fix:
    enabled: true
    org_members_only: true
    require_investigation: true
    auto_create_pr: true
    auto_run_tests: true

ignore_patterns:
  - "*.md"
  - "docs/**"
  - "tests/**"
```

### Disable Code Review

```yaml
language: ko
code_review:
  disable: true
```

### Disable Issue Workflow

```yaml
language: en
issue_workflow:
  disable: true
```

## Type Exports

All types are exported for external use:

```typescript
import type {
  Config,
  Language,
  SeverityLevel,
  CodeReviewConfig,
  IssueWorkflowConfig,
  PullRequestOpenedConfig,
  GenerateConfigOptions,
} from '@pleaseai/config'

// Use in your code
function processConfig(config: Config) {
  const language: Language = config.language
  const threshold: SeverityLevel = config.code_review.comment_severity_threshold
}
```

## Validation Errors

Zod provides detailed validation errors:

```typescript
try {
  const config = ConfigSchema.parse(data)
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('Configuration validation failed:')
    error.errors.forEach((err) => {
      console.error(`  - ${err.path.join('.')}: ${err.message}`)
    })
  }
}
```

**Example error output:**

```
Configuration validation failed:
  - language: Invalid enum value. Expected 'ko' | 'en', received 'fr'
  - code_review.comment_severity_threshold: Invalid enum value
  - issue_workflow.triage.auto: Expected boolean, received string
```

## Testing

### Unit Tests

Test all functions with TDD approach:

```typescript
import { describe, it, expect } from 'vitest'
import { loadConfig, generateConfig, isCodeReviewDisabled } from '../src'

describe('Config Loading', () => {
  it('should load valid config from file', async () => {
    const config = await loadConfig('./fixtures/valid-config')
    expect(config.language).toBe('ko')
  })

  it('should return default config if file not found', async () => {
    const config = await loadConfig('./fixtures/nonexistent')
    expect(config).toEqual(DEFAULT_CONFIG)
  })

  it('should throw on invalid config', async () => {
    await expect(loadConfig('./fixtures/invalid-config')).rejects.toThrow()
  })
})

describe('Config Generation', () => {
  it('should generate config with defaults', () => {
    const config = generateConfig({})
    expect(config.language).toBe('ko')
    expect(config.code_review.disable).toBe(false)
  })

  it('should respect custom options', () => {
    const config = generateConfig({
      language: 'en',
      enableCodeReview: false,
    })
    expect(config.language).toBe('en')
    expect(config.code_review.disable).toBe(true)
  })
})

describe('Helper Functions', () => {
  it('should detect disabled code review', () => {
    const config = generateConfig({ enableCodeReview: false })
    expect(isCodeReviewDisabled(config)).toBe(true)
  })

  it('should respect draft PR setting', () => {
    const config = generateConfig({})
    config.code_review.pull_request_opened.include_drafts = false
    expect(shouldReviewPR(config, true)).toBe(false)
  })
})
```

### Integration Tests

Test with actual YAML files:

```typescript
describe('YAML Loading', () => {
  it('should load and validate YAML config', async () => {
    // fixtures/test-config/.please/config.yml
    const config = await loadConfig('./fixtures/test-config')

    expect(config.language).toBe('en')
    expect(config.code_review.disable).toBe(false)
    expect(config.issue_workflow.triage.auto).toBe(true)
  })
})
```

## Code Style

- Use Zod for all validation
- Provide sensible defaults
- Make all fields optional when possible
- Use helper functions for common checks
- Follow TDD: Write tests first
- Export all types for external use

## Related Packages

- `@pleaseai/api` - Uses config for bot behavior
- `@pleaseai/cli` - Generates config files

## Resources

- [Zod Documentation](https://zod.dev/)
- [js-yaml Documentation](https://github.com/nodeca/js-yaml)
