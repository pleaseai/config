# @pleaseai/config

PleaseAI configuration schema, loader, and generator.

## Overview

This package provides:
- **Type-safe schema** using Zod for validation
- **Config loading** from local files or GitHub
- **Config generation** with customizable options
- **Helper functions** for config inspection

## Installation

```bash
bun add @pleaseai/config
```

## Usage

### Load Config from File

```typescript
import { loadConfig } from '@pleaseai/config'

const config = await loadConfig('/path/to/repo')
// Returns validated Config object or DEFAULT_CONFIG if file doesn't exist
```

### Load Config from GitHub

```typescript
import { loadConfigFromGitHub } from '@pleaseai/config'

const config = await loadConfigFromGitHub(
  octokit,
  'owner',
  'repo',
  'main' // optional ref
)
// Fetches .please/config.yml from repository
```

### Generate Config

```typescript
import { generateConfig, generateConfigYAML } from '@pleaseai/config'

// Generate config object with defaults
const config = generateConfig({
  language: 'en',
  enableCodeReview: true,
  enableIssueWorkflow: true,
})

// Generate YAML string
const yaml = generateConfigYAML({ language: 'ko' })
```

### Use Helper Functions

```typescript
import {
  isCodeReviewDisabled,
  shouldReviewPR,
  isAutoTriageEnabled,
  isInvestigateEnabled,
  isFixEnabled,
  getLanguage,
} from '@pleaseai/config'

if (isCodeReviewDisabled(config)) {
  // Skip code review
}

if (shouldReviewPR(config, isDraft)) {
  // Perform review
}

const language = getLanguage(config) // 'ko' | 'en'
```

## Config Schema

### code_review

```yaml
code_review:
  disable: false
  comment_severity_threshold: MEDIUM # LOW | MEDIUM | HIGH
  max_review_comments: -1 # -1 for unlimited
  pull_request_opened:
    help: false
    summary: true
    code_review: true
    include_drafts: true
```

### issue_workflow

```yaml
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
    require_investigation: false
    auto_create_pr: true
    auto_run_tests: true
```

### General Settings

```yaml
ignore_patterns: []
language: ko # ko | en
```

## Types

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
```

## Testing

```bash
bun test
```

All functions have comprehensive test coverage with Red → Green → Refactor TDD methodology.
