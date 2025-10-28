import { describe, expect, it } from 'vitest'
import { DEFAULT_CONFIG } from '../src/schema'
import { generateConfig, isDevHelpEnabled } from '../src/generator'

describe('isDevHelpEnabled', () => {
  it('should return true for default config', () => {
    expect(isDevHelpEnabled(DEFAULT_CONFIG)).toBe(true)
  })

  it('should return true when post_dev_help is explicitly set to true', () => {
    const config = generateConfig({})
    config.issue_workflow.issue_opened.post_dev_help = true

    expect(isDevHelpEnabled(config)).toBe(true)
  })

  it('should return false when post_dev_help is set to false', () => {
    const config = generateConfig({})
    config.issue_workflow.issue_opened.post_dev_help = false

    expect(isDevHelpEnabled(config)).toBe(false)
  })

  it('should return true when issue_workflow is undefined (fallback)', () => {
    const config: any = {
      language: 'ko',
      code_review: DEFAULT_CONFIG.code_review,
      ignore_patterns: [],
    }

    expect(isDevHelpEnabled(config)).toBe(true)
  })

  it('should return true when issue_opened is undefined (fallback)', () => {
    const config: any = {
      ...DEFAULT_CONFIG,
      issue_workflow: {
        disable: false,
        triage: { auto: true },
      },
    }

    expect(isDevHelpEnabled(config)).toBe(true)
  })

  it('should return true when post_dev_help is undefined (fallback)', () => {
    const config: any = {
      ...DEFAULT_CONFIG,
      issue_workflow: {
        ...DEFAULT_CONFIG.issue_workflow,
        issue_opened: {},
      },
    }

    expect(isDevHelpEnabled(config)).toBe(true)
  })
})
