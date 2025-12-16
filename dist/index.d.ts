import { z } from 'zod';

/**
 * Individual formatter entry configuration
 */
declare const FormatterEntrySchema: z.ZodObject<{
    disabled: z.ZodOptional<z.ZodBoolean>;
    command: z.ZodArray<z.ZodString>;
    environment: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    extensions: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
type FormatterEntry = z.infer<typeof FormatterEntrySchema>;
/**
 * Formatter configuration - can be false to disable all or object with named formatters
 */
declare const FormatterConfigSchema: z.ZodUnion<readonly [z.ZodLiteral<false>, z.ZodRecord<z.ZodString, z.ZodObject<{
    disabled: z.ZodOptional<z.ZodBoolean>;
    command: z.ZodArray<z.ZodString>;
    environment: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    extensions: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>>]>;
type FormatterConfig = z.infer<typeof FormatterConfigSchema>;
/**
 * Severity levels for review comments
 */
declare const SeverityLevel: z.ZodEnum<{
    LOW: "LOW";
    MEDIUM: "MEDIUM";
    HIGH: "HIGH";
}>;
type SeverityLevel = z.infer<typeof SeverityLevel>;
/**
 * Language options for bot responses
 */
declare const Language: z.ZodEnum<{
    ko: "ko";
    en: "en";
}>;
type Language = z.infer<typeof Language>;
/**
 * Pull request opened event configuration
 */
declare const PullRequestOpenedConfigSchema: z.ZodObject<{
    help: z.ZodDefault<z.ZodBoolean>;
    summary: z.ZodDefault<z.ZodBoolean>;
    code_review: z.ZodDefault<z.ZodBoolean>;
    include_drafts: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
type PullRequestOpenedConfig = z.infer<typeof PullRequestOpenedConfigSchema>;
/**
 * Code review configuration
 */
declare const CodeReviewConfigSchema: z.ZodObject<{
    disable: z.ZodDefault<z.ZodBoolean>;
    comment_severity_threshold: z.ZodDefault<z.ZodEnum<{
        LOW: "LOW";
        MEDIUM: "MEDIUM";
        HIGH: "HIGH";
    }>>;
    max_review_comments: z.ZodDefault<z.ZodNumber>;
    pull_request_opened: z.ZodDefault<z.ZodOptional<z.ZodObject<{
        help: z.ZodDefault<z.ZodBoolean>;
        summary: z.ZodDefault<z.ZodBoolean>;
        code_review: z.ZodDefault<z.ZodBoolean>;
        include_drafts: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
type CodeReviewConfig = z.infer<typeof CodeReviewConfigSchema>;
/**
 * Issue workflow configuration (triage → investigate → fix)
 */
declare const IssueWorkflowConfigSchema: z.ZodObject<{
    disable: z.ZodDefault<z.ZodBoolean>;
    issue_opened: z.ZodDefault<z.ZodObject<{
        post_dev_help: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>>;
    triage: z.ZodDefault<z.ZodObject<{
        auto: z.ZodDefault<z.ZodBoolean>;
        manual: z.ZodDefault<z.ZodBoolean>;
        update_issue_type: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>>;
    investigate: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        org_members_only: z.ZodDefault<z.ZodBoolean>;
        auto_on_bug_label: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>>;
    fix: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        org_members_only: z.ZodDefault<z.ZodBoolean>;
        require_investigation: z.ZodDefault<z.ZodBoolean>;
        auto_create_pr: z.ZodDefault<z.ZodBoolean>;
        auto_run_tests: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>>;
}, z.core.$strip>;
type IssueWorkflowConfig = z.infer<typeof IssueWorkflowConfigSchema>;
/**
 * Code workspace configuration
 */
declare const CodeWorkspaceConfigSchema: z.ZodObject<{
    enabled: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
type CodeWorkspaceConfig = z.infer<typeof CodeWorkspaceConfigSchema>;
/**
 * Notion integration configuration
 */
declare const NotionIntegrationConfigSchema: z.ZodObject<{
    enabled: z.ZodDefault<z.ZodBoolean>;
    page_id: z.ZodOptional<z.ZodString>;
    database_id: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
type NotionIntegrationConfig = z.infer<typeof NotionIntegrationConfigSchema>;
/**
 * Slack integration configuration
 */
declare const SlackIntegrationConfigSchema: z.ZodObject<{
    enabled: z.ZodDefault<z.ZodBoolean>;
    webhook_url: z.ZodOptional<z.ZodString>;
    channel: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
type SlackIntegrationConfig = z.infer<typeof SlackIntegrationConfigSchema>;
/**
 * Integrations configuration
 */
declare const IntegrationsConfigSchema: z.ZodObject<{
    notion: z.ZodDefault<z.ZodOptional<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        page_id: z.ZodOptional<z.ZodString>;
        database_id: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
    slack: z.ZodDefault<z.ZodOptional<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        webhook_url: z.ZodOptional<z.ZodString>;
        channel: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
type IntegrationsConfig = z.infer<typeof IntegrationsConfigSchema>;
/**
 * Main configuration schema
 */
declare const ConfigSchema: z.ZodObject<{
    code_review: z.ZodDefault<z.ZodOptional<z.ZodObject<{
        disable: z.ZodDefault<z.ZodBoolean>;
        comment_severity_threshold: z.ZodDefault<z.ZodEnum<{
            LOW: "LOW";
            MEDIUM: "MEDIUM";
            HIGH: "HIGH";
        }>>;
        max_review_comments: z.ZodDefault<z.ZodNumber>;
        pull_request_opened: z.ZodDefault<z.ZodOptional<z.ZodObject<{
            help: z.ZodDefault<z.ZodBoolean>;
            summary: z.ZodDefault<z.ZodBoolean>;
            code_review: z.ZodDefault<z.ZodBoolean>;
            include_drafts: z.ZodDefault<z.ZodBoolean>;
        }, z.core.$strip>>>;
    }, z.core.$strip>>>;
    issue_workflow: z.ZodDefault<z.ZodOptional<z.ZodObject<{
        disable: z.ZodDefault<z.ZodBoolean>;
        issue_opened: z.ZodDefault<z.ZodObject<{
            post_dev_help: z.ZodDefault<z.ZodBoolean>;
        }, z.core.$strip>>;
        triage: z.ZodDefault<z.ZodObject<{
            auto: z.ZodDefault<z.ZodBoolean>;
            manual: z.ZodDefault<z.ZodBoolean>;
            update_issue_type: z.ZodDefault<z.ZodBoolean>;
        }, z.core.$strip>>;
        investigate: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            org_members_only: z.ZodDefault<z.ZodBoolean>;
            auto_on_bug_label: z.ZodDefault<z.ZodBoolean>;
        }, z.core.$strip>>;
        fix: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            org_members_only: z.ZodDefault<z.ZodBoolean>;
            require_investigation: z.ZodDefault<z.ZodBoolean>;
            auto_create_pr: z.ZodDefault<z.ZodBoolean>;
            auto_run_tests: z.ZodDefault<z.ZodBoolean>;
        }, z.core.$strip>>;
    }, z.core.$strip>>>;
    code_workspace: z.ZodDefault<z.ZodOptional<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>>>;
    formatter: z.ZodDefault<z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<false>, z.ZodRecord<z.ZodString, z.ZodObject<{
        disabled: z.ZodOptional<z.ZodBoolean>;
        command: z.ZodArray<z.ZodString>;
        environment: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        extensions: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>>]>>>;
    ignore_patterns: z.ZodDefault<z.ZodArray<z.ZodString>>;
    language: z.ZodDefault<z.ZodEnum<{
        ko: "ko";
        en: "en";
    }>>;
    integrations: z.ZodDefault<z.ZodOptional<z.ZodObject<{
        notion: z.ZodDefault<z.ZodOptional<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            page_id: z.ZodOptional<z.ZodString>;
            database_id: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>>;
        slack: z.ZodDefault<z.ZodOptional<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            webhook_url: z.ZodOptional<z.ZodString>;
            channel: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
type Config = z.infer<typeof ConfigSchema>;
/**
 * Default configuration values
 */
declare const DEFAULT_CONFIG: Config;

/**
 * Loads and validates configuration from .please/config.yml
 *
 * @param repoPath - Path to the repository root
 * @returns Validated configuration object
 * @throws Error if config file is invalid
 */
declare function loadConfig(repoPath: string): Promise<Config>;
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
declare function loadConfigFromGitHub(octokit: any, owner: string, repo: string, ref?: string): Promise<Config>;
/**
 * Checks if code review is disabled in the config
 */
declare function isCodeReviewDisabled(config: Config): boolean;
/**
 * Gets the language preference from config
 */
declare function getLanguage(config: Config): 'ko' | 'en';
/**
 * Checks if PR should trigger automatic review based on config
 */
declare function shouldReviewPR(config: Config, isDraft: boolean): boolean;
/**
 * Checks if PR should show help message
 */
declare function shouldShowHelp(config: Config): boolean;
/**
 * Checks if PR should show summary
 */
declare function shouldShowSummary(config: Config): boolean;
/**
 * Checks if auto-triage is enabled in the config
 */
declare function isAutoTriageEnabled(config: Config): boolean;
/**
 * Checks if manual triage is enabled in the config
 */
declare function isManualTriageEnabled(config: Config): boolean;
/**
 * Checks if issue type should be updated during triage
 */
declare function shouldUpdateIssueType(config: Config): boolean;
/**
 * Checks if investigate is enabled in the config
 */
declare function isInvestigateEnabled(config: Config): boolean;
/**
 * Checks if investigate requires organization membership
 */
declare function investigateRequiresOrgMembership(config: Config): boolean;
/**
 * Checks if auto-investigate should trigger on bug label
 */
declare function shouldAutoInvestigateOnBugLabel(config: Config): boolean;
/**
 * Checks if fix is enabled in the config
 */
declare function isFixEnabled(config: Config): boolean;
/**
 * Checks if fix requires organization membership
 */
declare function fixRequiresOrgMembership(config: Config): boolean;
/**
 * Checks if fix requires prior investigation
 */
declare function fixRequiresInvestigation(config: Config): boolean;
/**
 * Checks if PR should be auto-created after fix
 */
declare function shouldAutoCreatePR(config: Config): boolean;
/**
 * Checks if tests should be auto-run after fix
 */
declare function shouldAutoRunTests(config: Config): boolean;
/**
 * Checks if code workspace is enabled in the config
 */
declare function isCodeWorkspaceEnabled(config: Config): boolean;

/**
 * Options for generating configuration
 */
interface GenerateConfigOptions {
    language?: 'ko' | 'en';
    enableCodeReview?: boolean;
    enableIssueWorkflow?: boolean;
}
/**
 * Generates a configuration object with optional customizations
 *
 * @param options - Configuration options to override defaults
 * @returns Generated Config object
 */
declare function generateConfig(options?: GenerateConfigOptions): Config;
/**
 * Generates a YAML string representation of the configuration
 *
 * @param options - Configuration options to override defaults
 * @returns YAML string representation of the config
 */
declare function generateConfigYAML(options?: GenerateConfigOptions): string;
/**
 * Check if development help comment should be posted on new issues
 *
 * @param config - Configuration object
 * @returns true if dev help is enabled, false otherwise
 */
declare function isDevHelpEnabled(config: Config): boolean;
/**
 * Check if automatic code review is enabled on PR opened
 *
 * @param config - Configuration object
 * @returns true if auto code review is enabled, false otherwise
 */
declare function isAutoReviewEnabled(config: Config): boolean;
/**
 * Check if Notion integration is enabled
 *
 * @param config - Configuration object
 * @returns true if Notion is enabled, false otherwise
 */
declare function isNotionEnabled(config: Config): boolean;
/**
 * Get Notion page ID from config
 *
 * @param config - Configuration object
 * @returns Notion page ID or undefined
 */
declare function getNotionPageId(config: Config): string | undefined;
/**
 * Get Notion database ID from config
 *
 * @param config - Configuration object
 * @returns Notion database ID or undefined
 */
declare function getNotionDatabaseId(config: Config): string | undefined;
/**
 * Check if Slack integration is enabled
 *
 * @param config - Configuration object
 * @returns true if Slack is enabled, false otherwise
 */
declare function isSlackEnabled(config: Config): boolean;
/**
 * Get Slack webhook URL from config
 *
 * @param config - Configuration object
 * @returns Slack webhook URL or undefined
 */
declare function getSlackWebhookUrl(config: Config): string | undefined;

export { type CodeReviewConfig, CodeReviewConfigSchema, type CodeWorkspaceConfig, CodeWorkspaceConfigSchema, type Config, ConfigSchema, DEFAULT_CONFIG, type FormatterConfig, FormatterConfigSchema, type FormatterEntry, FormatterEntrySchema, type GenerateConfigOptions, type IntegrationsConfig, IntegrationsConfigSchema, type IssueWorkflowConfig, IssueWorkflowConfigSchema, Language, type NotionIntegrationConfig, NotionIntegrationConfigSchema, type PullRequestOpenedConfig, PullRequestOpenedConfigSchema, SeverityLevel, type SlackIntegrationConfig, SlackIntegrationConfigSchema, fixRequiresInvestigation, fixRequiresOrgMembership, generateConfig, generateConfigYAML, getLanguage, getNotionDatabaseId, getNotionPageId, getSlackWebhookUrl, investigateRequiresOrgMembership, isAutoReviewEnabled, isAutoTriageEnabled, isCodeReviewDisabled, isCodeWorkspaceEnabled, isDevHelpEnabled, isFixEnabled, isInvestigateEnabled, isManualTriageEnabled, isNotionEnabled, isSlackEnabled, loadConfig, loadConfigFromGitHub, shouldAutoCreatePR, shouldAutoInvestigateOnBugLabel, shouldAutoRunTests, shouldReviewPR, shouldShowHelp, shouldShowSummary, shouldUpdateIssueType };
