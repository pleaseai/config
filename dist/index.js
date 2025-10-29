// src/schema.ts
import { z } from "zod";
var SeverityLevel = z.enum(["LOW", "MEDIUM", "HIGH"]);
var Language = z.enum(["ko", "en"]);
var PullRequestOpenedConfigSchema = z.object({
  help: z.boolean().default(false),
  summary: z.boolean().default(true),
  code_review: z.boolean().default(true),
  include_drafts: z.boolean().default(true)
});
var CodeReviewConfigSchema = z.object({
  disable: z.boolean().default(false),
  comment_severity_threshold: SeverityLevel.default("MEDIUM"),
  max_review_comments: z.number().default(-1),
  pull_request_opened: PullRequestOpenedConfigSchema.optional().default({
    help: false,
    summary: true,
    code_review: true,
    include_drafts: true
  })
});
var IssueWorkflowConfigSchema = z.object({
  disable: z.boolean().default(false),
  issue_opened: z.object({
    post_dev_help: z.boolean().default(true)
  }).default({ post_dev_help: true }),
  triage: z.object({
    auto: z.boolean().default(true),
    manual: z.boolean().default(true),
    update_issue_type: z.boolean().default(true)
  }).default({ auto: true, manual: true, update_issue_type: true }),
  investigate: z.object({
    enabled: z.boolean().default(true),
    org_members_only: z.boolean().default(true),
    auto_on_bug_label: z.boolean().default(false)
  }).default({
    enabled: true,
    org_members_only: true,
    auto_on_bug_label: false
  }),
  fix: z.object({
    enabled: z.boolean().default(true),
    org_members_only: z.boolean().default(true),
    require_investigation: z.boolean().default(false),
    auto_create_pr: z.boolean().default(true),
    auto_run_tests: z.boolean().default(true)
  }).default({
    enabled: true,
    org_members_only: true,
    require_investigation: false,
    auto_create_pr: true,
    auto_run_tests: true
  })
});
var CodeWorkspaceConfigSchema = z.object({
  enabled: z.boolean().default(true)
});
var ConfigSchema = z.object({
  code_review: CodeReviewConfigSchema.optional().default({
    disable: false,
    comment_severity_threshold: "MEDIUM",
    max_review_comments: -1,
    pull_request_opened: {
      help: false,
      summary: true,
      code_review: true,
      include_drafts: true
    }
  }),
  issue_workflow: IssueWorkflowConfigSchema.optional().default({
    disable: false,
    issue_opened: { post_dev_help: true },
    triage: { auto: true, manual: true, update_issue_type: true },
    investigate: { enabled: true, org_members_only: true, auto_on_bug_label: false },
    fix: {
      enabled: true,
      org_members_only: true,
      require_investigation: false,
      auto_create_pr: true,
      auto_run_tests: true
    }
  }),
  code_workspace: CodeWorkspaceConfigSchema.optional().default({
    enabled: true
  }),
  ignore_patterns: z.array(z.string()).default([]),
  language: Language.default("ko")
});
var DEFAULT_CONFIG = {
  code_review: {
    disable: false,
    comment_severity_threshold: "MEDIUM",
    max_review_comments: -1,
    pull_request_opened: {
      help: false,
      summary: true,
      code_review: true,
      include_drafts: true
    }
  },
  issue_workflow: {
    disable: false,
    issue_opened: { post_dev_help: true },
    triage: { auto: true, manual: true, update_issue_type: true },
    investigate: { enabled: true, org_members_only: true, auto_on_bug_label: false },
    fix: {
      enabled: true,
      org_members_only: true,
      require_investigation: false,
      auto_create_pr: true,
      auto_run_tests: true
    }
  },
  code_workspace: {
    enabled: true
  },
  ignore_patterns: [],
  language: "ko"
};

// src/loader.ts
import * as fs from "fs";
import * as path from "path";
import * as yaml from "js-yaml";
async function loadConfig(repoPath) {
  const configPath = path.join(repoPath, ".please", "config.yml");
  if (!fs.existsSync(configPath)) {
    return DEFAULT_CONFIG;
  }
  try {
    const fileContents = fs.readFileSync(configPath, "utf8");
    const rawConfig = yaml.load(fileContents);
    const config = ConfigSchema.parse(rawConfig);
    return config;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load config from ${configPath}: ${error.message}`);
    }
    throw error;
  }
}
async function loadConfigFromGitHub(octokit, owner, repo, ref = "HEAD") {
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path: ".please/config.yml",
      ref
    });
    if ("content" in data && data.content) {
      const fileContents = Buffer.from(data.content, "base64").toString("utf8");
      const rawConfig = yaml.load(fileContents);
      const config = ConfigSchema.parse(rawConfig);
      return config;
    }
    return DEFAULT_CONFIG;
  } catch (error) {
    if (error.status === 404) {
      return DEFAULT_CONFIG;
    }
    console.error("Error loading config from GitHub:", error);
    return DEFAULT_CONFIG;
  }
}
function isCodeReviewDisabled(config) {
  return config.code_review.disable;
}
function getLanguage(config) {
  return config.language;
}
function shouldReviewPR(config, isDraft) {
  if (isCodeReviewDisabled(config)) {
    return false;
  }
  const prConfig = config.code_review.pull_request_opened;
  if (isDraft && !prConfig.include_drafts) {
    return false;
  }
  return prConfig.code_review;
}
function shouldShowHelp(config) {
  return config.code_review.pull_request_opened.help;
}
function shouldShowSummary(config) {
  return config.code_review.pull_request_opened.summary;
}
function isAutoTriageEnabled(config) {
  return !config.issue_workflow.disable && config.issue_workflow.triage.auto;
}
function isManualTriageEnabled(config) {
  return !config.issue_workflow.disable && config.issue_workflow.triage.manual;
}
function shouldUpdateIssueType(config) {
  return config.issue_workflow.triage.update_issue_type;
}
function isInvestigateEnabled(config) {
  return !config.issue_workflow.disable && config.issue_workflow.investigate.enabled;
}
function investigateRequiresOrgMembership(config) {
  return config.issue_workflow.investigate.org_members_only;
}
function shouldAutoInvestigateOnBugLabel(config) {
  return isInvestigateEnabled(config) && config.issue_workflow.investigate.auto_on_bug_label;
}
function isFixEnabled(config) {
  return !config.issue_workflow.disable && config.issue_workflow.fix.enabled;
}
function fixRequiresOrgMembership(config) {
  return config.issue_workflow.fix.org_members_only;
}
function fixRequiresInvestigation(config) {
  return config.issue_workflow.fix.require_investigation;
}
function shouldAutoCreatePR(config) {
  return config.issue_workflow.fix.auto_create_pr;
}
function shouldAutoRunTests(config) {
  return config.issue_workflow.fix.auto_run_tests;
}
function isCodeWorkspaceEnabled(config) {
  return config.code_workspace?.enabled ?? false;
}

// src/generator.ts
import * as yaml2 from "js-yaml";
function generateConfig(options = {}) {
  return {
    ...DEFAULT_CONFIG,
    language: options.language ?? DEFAULT_CONFIG.language,
    code_review: {
      ...DEFAULT_CONFIG.code_review,
      disable: options.enableCodeReview === false
    },
    issue_workflow: {
      ...DEFAULT_CONFIG.issue_workflow,
      disable: options.enableIssueWorkflow === false
    }
  };
}
function generateConfigYAML(options = {}) {
  const config = generateConfig(options);
  return yaml2.dump(config, {
    indent: 2,
    lineWidth: 80,
    noRefs: true,
    sortKeys: false
  });
}
function isDevHelpEnabled(config) {
  return config.issue_workflow?.issue_opened?.post_dev_help ?? true;
}
function isAutoReviewEnabled(config) {
  return config.code_review?.pull_request_opened?.code_review ?? true;
}
export {
  CodeReviewConfigSchema,
  CodeWorkspaceConfigSchema,
  ConfigSchema,
  DEFAULT_CONFIG,
  IssueWorkflowConfigSchema,
  Language,
  PullRequestOpenedConfigSchema,
  SeverityLevel,
  fixRequiresInvestigation,
  fixRequiresOrgMembership,
  generateConfig,
  generateConfigYAML,
  getLanguage,
  investigateRequiresOrgMembership,
  isAutoReviewEnabled,
  isAutoTriageEnabled,
  isCodeReviewDisabled,
  isCodeWorkspaceEnabled,
  isDevHelpEnabled,
  isFixEnabled,
  isInvestigateEnabled,
  isManualTriageEnabled,
  loadConfig,
  loadConfigFromGitHub,
  shouldAutoCreatePR,
  shouldAutoInvestigateOnBugLabel,
  shouldAutoRunTests,
  shouldReviewPR,
  shouldShowHelp,
  shouldShowSummary,
  shouldUpdateIssueType
};
//# sourceMappingURL=index.js.map