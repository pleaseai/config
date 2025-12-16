import { describe, expect, it } from 'vitest'
import { ConfigSchema, DEFAULT_CONFIG, LspConfigSchema } from '../src/schema'

describe('LspConfig Schema', () => {
  describe('basic validation', () => {
    it('should allow lsp to be false to disable all language servers', () => {
      const config = ConfigSchema.parse({
        lsp: false,
      })

      expect(config.lsp).toBe(false)
    })

    it('should allow lsp to be an empty object', () => {
      const config = ConfigSchema.parse({
        lsp: {},
      })

      expect(config.lsp).toEqual({})
    })

    it('should default to empty object when not specified', () => {
      const config = ConfigSchema.parse({})

      expect(config.lsp).toEqual({})
    })
  })

  describe('lsp entry configuration', () => {
    it('should accept a language server with command only', () => {
      const config = ConfigSchema.parse({
        lsp: {
          typescript: {
            command: ['typescript-language-server', '--stdio'],
          },
        },
      })

      expect(config.lsp).not.toBe(false)
      if (config.lsp !== false) {
        expect(config.lsp.typescript).toEqual({
          command: ['typescript-language-server', '--stdio'],
        })
      }
    })

    it('should accept a language server with all options', () => {
      const config = ConfigSchema.parse({
        lsp: {
          typescript: {
            disabled: false,
            command: ['typescript-language-server', '--stdio'],
            extensions: ['ts', 'tsx', 'js', 'jsx'],
            env: {
              NODE_ENV: 'production',
            },
            initialization: {
              preferences: {
                includeCompletionsForModuleExports: true,
              },
            },
          },
        },
      })

      expect(config.lsp).not.toBe(false)
      if (config.lsp !== false) {
        expect(config.lsp.typescript).toEqual({
          disabled: false,
          command: ['typescript-language-server', '--stdio'],
          extensions: ['ts', 'tsx', 'js', 'jsx'],
          env: {
            NODE_ENV: 'production',
          },
          initialization: {
            preferences: {
              includeCompletionsForModuleExports: true,
            },
          },
        })
      }
    })

    it('should accept multiple language servers', () => {
      const config = ConfigSchema.parse({
        lsp: {
          typescript: {
            command: ['typescript-language-server', '--stdio'],
            extensions: ['ts', 'tsx'],
          },
          python: {
            command: ['pylsp'],
            extensions: ['py'],
          },
          rust: {
            command: ['rust-analyzer'],
            disabled: true,
          },
        },
      })

      expect(config.lsp).not.toBe(false)
      if (config.lsp !== false) {
        expect(Object.keys(config.lsp)).toHaveLength(3)
        expect(config.lsp.typescript).toBeDefined()
        expect(config.lsp.python).toBeDefined()
        expect(config.lsp.rust?.disabled).toBe(true)
      }
    })

    it('should accept language server with disabled flag only', () => {
      const config = ConfigSchema.parse({
        lsp: {
          typescript: {
            disabled: true,
          },
        },
      })

      expect(config.lsp).not.toBe(false)
      if (config.lsp !== false) {
        expect(config.lsp.typescript?.disabled).toBe(true)
      }
    })

    it('should accept language server with env variables', () => {
      const config = ConfigSchema.parse({
        lsp: {
          typescript: {
            command: ['typescript-language-server', '--stdio'],
            env: {
              NODE_OPTIONS: '--max-old-space-size=4096',
              DEBUG: 'true',
            },
          },
        },
      })

      expect(config.lsp).not.toBe(false)
      if (config.lsp !== false) {
        expect(config.lsp.typescript?.env).toEqual({
          NODE_OPTIONS: '--max-old-space-size=4096',
          DEBUG: 'true',
        })
      }
    })

    it('should accept language server with initialization params', () => {
      const config = ConfigSchema.parse({
        lsp: {
          typescript: {
            command: ['typescript-language-server', '--stdio'],
            initialization: {
              hostInfo: 'please-ai',
              preferences: {
                includeInlayParameterNameHints: 'all',
              },
            },
          },
        },
      })

      expect(config.lsp).not.toBe(false)
      if (config.lsp !== false) {
        expect(config.lsp.typescript?.initialization).toEqual({
          hostInfo: 'please-ai',
          preferences: {
            includeInlayParameterNameHints: 'all',
          },
        })
      }
    })
  })

  describe('LspConfigSchema direct usage', () => {
    it('should parse false correctly', () => {
      const result = LspConfigSchema.parse(false)
      expect(result).toBe(false)
    })

    it('should parse empty object correctly', () => {
      const result = LspConfigSchema.parse({})
      expect(result).toEqual({})
    })

    it('should parse lsp entries correctly', () => {
      const result = LspConfigSchema.parse({
        typescript: {
          command: ['typescript-language-server', '--stdio'],
        },
      })

      expect(result).not.toBe(false)
      if (result !== false) {
        expect(result.typescript?.command).toEqual(['typescript-language-server', '--stdio'])
      }
    })
  })

  describe('validation errors', () => {
    it('should reject invalid command type', () => {
      expect(() =>
        ConfigSchema.parse({
          lsp: {
            typescript: {
              command: 'typescript-language-server --stdio', // should be array, not string
            },
          },
        })
      ).toThrow()
    })

    it('should reject invalid extensions type', () => {
      expect(() =>
        ConfigSchema.parse({
          lsp: {
            typescript: {
              command: ['typescript-language-server'],
              extensions: 'ts', // should be array, not string
            },
          },
        })
      ).toThrow()
    })

    it('should reject invalid env type', () => {
      expect(() =>
        ConfigSchema.parse({
          lsp: {
            typescript: {
              command: ['typescript-language-server'],
              env: 'NODE_ENV=production', // should be object
            },
          },
        })
      ).toThrow()
    })
  })

  describe('DEFAULT_CONFIG', () => {
    it('should have lsp set to empty object', () => {
      expect(DEFAULT_CONFIG.lsp).toEqual({})
    })
  })
})
