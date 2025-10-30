import { describe, it, expect } from 'vitest'
import {
  ConfigSchema,
  DEFAULT_CONFIG,
  type Config,
} from '../src/schema.js'
import {
  isNotionEnabled,
  getNotionPageId,
  getNotionDatabaseId,
  isSlackEnabled,
  getSlackWebhookUrl,
} from '../src/generator.js'

describe('Integrations Schema', () => {
  describe('Notion Integration', () => {
    it('should have Notion integration disabled by default', () => {
      expect(DEFAULT_CONFIG.integrations.notion.enabled).toBe(false)
    })

    it('should validate Notion integration config', () => {
      const config = {
        ...DEFAULT_CONFIG,
        integrations: {
          notion: {
            enabled: true,
            page_id: 'abc123',
            database_id: 'def456',
          },
          slack: {
            enabled: false,
          },
        },
      }

      const result = ConfigSchema.safeParse(config)
      expect(result.success).toBe(true)
    })

    it('should allow optional Notion fields', () => {
      const config = {
        ...DEFAULT_CONFIG,
        integrations: {
          notion: {
            enabled: true,
            // page_id and database_id are optional
          },
          slack: {
            enabled: false,
          },
        },
      }

      const result = ConfigSchema.safeParse(config)
      expect(result.success).toBe(true)
    })

    it('should work without integrations field', () => {
      const config = {
        code_review: DEFAULT_CONFIG.code_review,
        issue_workflow: DEFAULT_CONFIG.issue_workflow,
        code_workspace: DEFAULT_CONFIG.code_workspace,
        ignore_patterns: [],
        language: 'ko' as const,
        // integrations is optional
      }

      const result = ConfigSchema.safeParse(config)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.integrations.notion.enabled).toBe(false)
      }
    })
  })

  describe('Slack Integration', () => {
    it('should have Slack integration disabled by default', () => {
      expect(DEFAULT_CONFIG.integrations.slack.enabled).toBe(false)
    })

    it('should validate Slack integration config', () => {
      const config = {
        ...DEFAULT_CONFIG,
        integrations: {
          notion: {
            enabled: false,
          },
          slack: {
            enabled: true,
            webhook_url: 'https://hooks.slack.com/services/xxx',
            channel: '#general',
          },
        },
      }

      const result = ConfigSchema.safeParse(config)
      expect(result.success).toBe(true)
    })
  })

  describe('Multiple Integrations', () => {
    it('should support enabling multiple integrations', () => {
      const config = {
        ...DEFAULT_CONFIG,
        integrations: {
          notion: {
            enabled: true,
            page_id: 'page123',
            database_id: 'db456',
          },
          slack: {
            enabled: true,
            webhook_url: 'https://hooks.slack.com/services/xxx',
            channel: '#specs',
          },
        },
      }

      const result = ConfigSchema.safeParse(config)
      expect(result.success).toBe(true)
    })
  })
})

describe('Integration Helper Functions', () => {
  describe('Notion Helpers', () => {
    it('should detect when Notion is enabled', () => {
      const config: Config = {
        ...DEFAULT_CONFIG,
        integrations: {
          notion: {
            enabled: true,
            page_id: 'page123',
          },
          slack: {
            enabled: false,
          },
        },
      }

      expect(isNotionEnabled(config)).toBe(true)
    })

    it('should detect when Notion is disabled', () => {
      expect(isNotionEnabled(DEFAULT_CONFIG)).toBe(false)
    })

    it('should get Notion page ID', () => {
      const config: Config = {
        ...DEFAULT_CONFIG,
        integrations: {
          notion: {
            enabled: true,
            page_id: 'page123',
          },
          slack: {
            enabled: false,
          },
        },
      }

      expect(getNotionPageId(config)).toBe('page123')
    })

    it('should return undefined for missing page ID', () => {
      expect(getNotionPageId(DEFAULT_CONFIG)).toBeUndefined()
    })

    it('should get Notion database ID', () => {
      const config: Config = {
        ...DEFAULT_CONFIG,
        integrations: {
          notion: {
            enabled: true,
            database_id: 'db456',
          },
          slack: {
            enabled: false,
          },
        },
      }

      expect(getNotionDatabaseId(config)).toBe('db456')
    })

    it('should return undefined for missing database ID', () => {
      expect(getNotionDatabaseId(DEFAULT_CONFIG)).toBeUndefined()
    })
  })

  describe('Slack Helpers', () => {
    it('should detect when Slack is enabled', () => {
      const config: Config = {
        ...DEFAULT_CONFIG,
        integrations: {
          notion: {
            enabled: false,
          },
          slack: {
            enabled: true,
            webhook_url: 'https://hooks.slack.com/services/xxx',
          },
        },
      }

      expect(isSlackEnabled(config)).toBe(true)
    })

    it('should detect when Slack is disabled', () => {
      expect(isSlackEnabled(DEFAULT_CONFIG)).toBe(false)
    })

    it('should get Slack webhook URL', () => {
      const config: Config = {
        ...DEFAULT_CONFIG,
        integrations: {
          notion: {
            enabled: false,
          },
          slack: {
            enabled: true,
            webhook_url: 'https://hooks.slack.com/services/xxx',
          },
        },
      }

      expect(getSlackWebhookUrl(config)).toBe('https://hooks.slack.com/services/xxx')
    })

    it('should return undefined for missing webhook URL', () => {
      expect(getSlackWebhookUrl(DEFAULT_CONFIG)).toBeUndefined()
    })
  })
})
