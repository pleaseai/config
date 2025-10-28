import * as fs from 'node:fs'
import * as path from 'node:path'
import * as yaml from 'js-yaml'
import type { Config } from './schema.js'
import { ConfigSchema, DEFAULT_CONFIG } from './schema.js'

/**
 * Loads and validates configuration from .please/config.yml
 *
 * @param repoPath - Path to the repository root
 * @returns Validated configuration object
 * @throws Error if config file is invalid
 */
export async function loadConfig(repoPath: string): Promise<Config> {
  const configPath = path.join(repoPath, '.please', 'config.yml')

  // If config file doesn't exist, return default config
  if (!fs.existsSync(configPath)) {
    return DEFAULT_CONFIG
  }

  try {
    // Read and parse YAML file
    const fileContents = fs.readFileSync(configPath, 'utf8')
    const rawConfig = yaml.load(fileContents)

    // Validate against schema
    const config = ConfigSchema.parse(rawConfig)

    return config
  }
  catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load config from ${configPath}: ${error.message}`)
    }
    throw error
  }
}

/**
 * Loads configuration from Octokit context
 * Fetches .please/config.yml from the repository
 *
 * @param octokit - Octokit instance
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param ref - Git reference (branch/tag/commit)
 * @returns Validated configuration object
 */
export async function loadConfigFromGitHub(
  octokit: any,
  owner: string,
  repo: string,
  ref: string = 'HEAD',
): Promise<Config> {
  try {
    // Fetch config file from GitHub
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path: '.please/config.yml',
      ref,
    })

    // GitHub API returns base64-encoded content
    if ('content' in data && data.content) {
      const fileContents = Buffer.from(data.content, 'base64').toString('utf8')
      const rawConfig = yaml.load(fileContents)

      // Validate against schema
      const config = ConfigSchema.parse(rawConfig)

      return config
    }

    // If file doesn't exist or is a directory, return default
    return DEFAULT_CONFIG
  }
  catch (error: any) {
    // 404 means file doesn't exist, use default config
    if (error.status === 404) {
      return DEFAULT_CONFIG
    }

    // Other errors should be logged but shouldn't break the bot
    console.error('Error loading config from GitHub:', error)
    return DEFAULT_CONFIG
  }
}

/**
 * Checks if code review is disabled in the config
 */
export function isCodeReviewDisabled(config: Config): boolean {
  return config.code_review.disable
}

/**
 * Gets the language preference from config
 */
export function getLanguage(config: Config): 'ko' | 'en' {
  return config.language
}

/**
 * Checks if PR should trigger automatic review based on config
 */
export function shouldReviewPR(config: Config, isDraft: boolean): boolean {
  if (isCodeReviewDisabled(config)) {
    return false
  }

  const prConfig = config.code_review.pull_request_opened

  // If it's a draft and we don't include drafts, skip
  if (isDraft && !prConfig.include_drafts) {
    return false
  }

  return prConfig.code_review
}

/**
 * Checks if PR should show help message
 */
export function shouldShowHelp(config: Config): boolean {
  return config.code_review.pull_request_opened.help
}

/**
 * Checks if PR should show summary
 */
export function shouldShowSummary(config: Config): boolean {
  return config.code_review.pull_request_opened.summary
}

/**
 * Checks if auto-triage is enabled in the config
 */
export function isAutoTriageEnabled(config: Config): boolean {
  return !config.issue_workflow.disable && config.issue_workflow.triage.auto
}

/**
 * Checks if manual triage is enabled in the config
 */
export function isManualTriageEnabled(config: Config): boolean {
  return !config.issue_workflow.disable && config.issue_workflow.triage.manual
}

/**
 * Checks if issue type should be updated during triage
 */
export function shouldUpdateIssueType(config: Config): boolean {
  return config.issue_workflow.triage.update_issue_type
}

/**
 * Checks if investigate is enabled in the config
 */
export function isInvestigateEnabled(config: Config): boolean {
  return !config.issue_workflow.disable && config.issue_workflow.investigate.enabled
}

/**
 * Checks if investigate requires organization membership
 */
export function investigateRequiresOrgMembership(config: Config): boolean {
  return config.issue_workflow.investigate.org_members_only
}

/**
 * Checks if auto-investigate should trigger on bug label
 */
export function shouldAutoInvestigateOnBugLabel(config: Config): boolean {
  return isInvestigateEnabled(config) && config.issue_workflow.investigate.auto_on_bug_label
}

/**
 * Checks if fix is enabled in the config
 */
export function isFixEnabled(config: Config): boolean {
  return !config.issue_workflow.disable && config.issue_workflow.fix.enabled
}

/**
 * Checks if fix requires organization membership
 */
export function fixRequiresOrgMembership(config: Config): boolean {
  return config.issue_workflow.fix.org_members_only
}

/**
 * Checks if fix requires prior investigation
 */
export function fixRequiresInvestigation(config: Config): boolean {
  return config.issue_workflow.fix.require_investigation
}

/**
 * Checks if PR should be auto-created after fix
 */
export function shouldAutoCreatePR(config: Config): boolean {
  return config.issue_workflow.fix.auto_create_pr
}

/**
 * Checks if tests should be auto-run after fix
 */
export function shouldAutoRunTests(config: Config): boolean {
  return config.issue_workflow.fix.auto_run_tests
}

/**
 * Checks if code workspace is enabled in the config
 */
export function isCodeWorkspaceEnabled(config: Config): boolean {
  return config.code_workspace?.enabled ?? false
}
