import { describe, expect, it } from 'vitest'
import { ConfigSchema, DEFAULT_CONFIG } from '../src/schema'

describe('IssueWorkflowConfig Schema', () => {
  describe('issue_opened configuration', () => {
    it('should have post_dev_help field with default value true', () => {
      const config = ConfigSchema.parse({})

      expect(config.issue_workflow.issue_opened).toBeDefined()
      expect(config.issue_workflow.issue_opened.post_dev_help).toBe(true)
    })

    it('should allow post_dev_help to be set to false', () => {
      const config = ConfigSchema.parse({
        issue_workflow: {
          issue_opened: {
            post_dev_help: false,
          },
        },
      })

      expect(config.issue_workflow.issue_opened.post_dev_help).toBe(false)
    })

    it('should allow post_dev_help to be explicitly set to true', () => {
      const config = ConfigSchema.parse({
        issue_workflow: {
          issue_opened: {
            post_dev_help: true,
          },
        },
      })

      expect(config.issue_workflow.issue_opened.post_dev_help).toBe(true)
    })

    it('should use default value true when issue_opened is not specified', () => {
      const config = ConfigSchema.parse({
        issue_workflow: {
          triage: { auto: true },
        },
      })

      expect(config.issue_workflow.issue_opened.post_dev_help).toBe(true)
    })
  })

  describe('DEFAULT_CONFIG', () => {
    it('should have issue_opened.post_dev_help set to true', () => {
      expect(DEFAULT_CONFIG.issue_workflow.issue_opened).toBeDefined()
      expect(DEFAULT_CONFIG.issue_workflow.issue_opened.post_dev_help).toBe(true)
    })
  })
})
