import { describe, expect, it } from 'vitest'
import { ConfigSchema, DEFAULT_CONFIG, FormatterConfigSchema } from '../src/schema'

describe('FormatterConfig Schema', () => {
  describe('basic validation', () => {
    it('should allow formatter to be false to disable all formatters', () => {
      const config = ConfigSchema.parse({
        formatter: false,
      })

      expect(config.formatter).toBe(false)
    })

    it('should allow formatter to be an empty object', () => {
      const config = ConfigSchema.parse({
        formatter: {},
      })

      expect(config.formatter).toEqual({})
    })

    it('should default to empty object when not specified', () => {
      const config = ConfigSchema.parse({})

      expect(config.formatter).toEqual({})
    })
  })

  describe('formatter entry configuration', () => {
    it('should accept a formatter with command only', () => {
      const config = ConfigSchema.parse({
        formatter: {
          prettier: {
            command: ['prettier', '--write'],
          },
        },
      })

      expect(config.formatter).not.toBe(false)
      if (config.formatter !== false) {
        expect(config.formatter.prettier).toEqual({
          command: ['prettier', '--write'],
        })
      }
    })

    it('should accept a formatter with all options', () => {
      const config = ConfigSchema.parse({
        formatter: {
          prettier: {
            disabled: false,
            command: ['prettier', '--write'],
            extensions: ['.ts', '.tsx', '.js', '.jsx'],
            environment: {
              NODE_ENV: 'production',
            },
          },
        },
      })

      expect(config.formatter).not.toBe(false)
      if (config.formatter !== false) {
        expect(config.formatter.prettier).toEqual({
          disabled: false,
          command: ['prettier', '--write'],
          extensions: ['.ts', '.tsx', '.js', '.jsx'],
          environment: {
            NODE_ENV: 'production',
          },
        })
      }
    })

    it('should accept multiple formatters', () => {
      const config = ConfigSchema.parse({
        formatter: {
          prettier: {
            command: ['prettier', '--write'],
            extensions: ['.ts', '.tsx'],
          },
          eslint: {
            command: ['eslint', '--fix'],
            extensions: ['.ts', '.tsx', '.js'],
          },
          biome: {
            command: ['biome', 'format', '--write'],
            disabled: true,
          },
        },
      })

      expect(config.formatter).not.toBe(false)
      if (config.formatter !== false) {
        expect(Object.keys(config.formatter)).toHaveLength(3)
        expect(config.formatter.prettier).toBeDefined()
        expect(config.formatter.eslint).toBeDefined()
        expect(config.formatter.biome?.disabled).toBe(true)
      }
    })

    it('should accept formatter with disabled flag', () => {
      const config = ConfigSchema.parse({
        formatter: {
          prettier: {
            disabled: true,
            command: ['prettier', '--write'],
          },
        },
      })

      expect(config.formatter).not.toBe(false)
      if (config.formatter !== false) {
        expect(config.formatter.prettier?.disabled).toBe(true)
      }
    })
  })

  describe('FormatterConfigSchema direct usage', () => {
    it('should parse false correctly', () => {
      const result = FormatterConfigSchema.parse(false)
      expect(result).toBe(false)
    })

    it('should parse empty object correctly', () => {
      const result = FormatterConfigSchema.parse({})
      expect(result).toEqual({})
    })

    it('should parse formatter entries correctly', () => {
      const result = FormatterConfigSchema.parse({
        prettier: {
          command: ['prettier', '--write'],
        },
      })

      expect(result).not.toBe(false)
      if (result !== false) {
        expect(result.prettier?.command).toEqual(['prettier', '--write'])
      }
    })
  })

  describe('validation errors', () => {
    it('should reject invalid command type', () => {
      expect(() =>
        ConfigSchema.parse({
          formatter: {
            prettier: {
              command: 'prettier --write', // should be array, not string
            },
          },
        })
      ).toThrow()
    })

    it('should reject invalid extensions type', () => {
      expect(() =>
        ConfigSchema.parse({
          formatter: {
            prettier: {
              command: ['prettier'],
              extensions: '.ts', // should be array, not string
            },
          },
        })
      ).toThrow()
    })

    it('should reject invalid environment type', () => {
      expect(() =>
        ConfigSchema.parse({
          formatter: {
            prettier: {
              command: ['prettier'],
              environment: 'NODE_ENV=production', // should be object
            },
          },
        })
      ).toThrow()
    })
  })

  describe('DEFAULT_CONFIG', () => {
    it('should have formatter set to empty object', () => {
      expect(DEFAULT_CONFIG.formatter).toEqual({})
    })
  })
})
