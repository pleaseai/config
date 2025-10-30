import * as yaml from 'js-yaml'
import type { Config } from './schema.js'
import { DEFAULT_CONFIG } from './schema.js'

/**
 * Options for generating configuration
 */
export interface GenerateConfigOptions {
  language?: 'ko' | 'en'
  enableCodeReview?: boolean
  enableIssueWorkflow?: boolean
}

/**
 * Generates a configuration object with optional customizations
 *
 * @param options - Configuration options to override defaults
 * @returns Generated Config object
 */
export function generateConfig(options: GenerateConfigOptions = {}): Config {
  return {
    ...DEFAULT_CONFIG,
    language: options.language ?? DEFAULT_CONFIG.language,
    code_review: {
      ...DEFAULT_CONFIG.code_review,
      disable: options.enableCodeReview === false,
    },
    issue_workflow: {
      ...DEFAULT_CONFIG.issue_workflow,
      disable: options.enableIssueWorkflow === false,
    },
  }
}

/**
 * Generates a YAML string representation of the configuration
 *
 * @param options - Configuration options to override defaults
 * @returns YAML string representation of the config
 */
export function generateConfigYAML(options: GenerateConfigOptions = {}): string {
  const config = generateConfig(options)
  return yaml.dump(config, {
    indent: 2,
    lineWidth: 80,
    noRefs: true,
    sortKeys: false,
  })
}

/**
 * Check if development help comment should be posted on new issues
 *
 * @param config - Configuration object
 * @returns true if dev help is enabled, false otherwise
 */
export function isDevHelpEnabled(config: Config): boolean {
  return config.issue_workflow?.issue_opened?.post_dev_help ?? true
}

/**
 * Check if automatic code review is enabled on PR opened
 *
 * @param config - Configuration object
 * @returns true if auto code review is enabled, false otherwise
 */
export function isAutoReviewEnabled(config: Config): boolean {
  return config.code_review?.pull_request_opened?.code_review ?? true
}

/**
 * Check if Notion integration is enabled
 *
 * @param config - Configuration object
 * @returns true if Notion is enabled, false otherwise
 */
export function isNotionEnabled(config: Config): boolean {
  return config.integrations?.notion?.enabled ?? false
}

/**
 * Get Notion page ID from config
 *
 * @param config - Configuration object
 * @returns Notion page ID or undefined
 */
export function getNotionPageId(config: Config): string | undefined {
  return config.integrations?.notion?.page_id
}

/**
 * Get Notion database ID from config
 *
 * @param config - Configuration object
 * @returns Notion database ID or undefined
 */
export function getNotionDatabaseId(config: Config): string | undefined {
  return config.integrations?.notion?.database_id
}

/**
 * Check if Slack integration is enabled
 *
 * @param config - Configuration object
 * @returns true if Slack is enabled, false otherwise
 */
export function isSlackEnabled(config: Config): boolean {
  return config.integrations?.slack?.enabled ?? false
}

/**
 * Get Slack webhook URL from config
 *
 * @param config - Configuration object
 * @returns Slack webhook URL or undefined
 */
export function getSlackWebhookUrl(config: Config): string | undefined {
  return config.integrations?.slack?.webhook_url
}
