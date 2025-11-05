import { describe, it, expect } from 'vitest';
import { 
    isValidString, 
    isValidArray, 
    sanitizeString, 
    normalizeString, 
    validateConfig 
} from '../../src/utils/Validator.js';

describe('Validator', () => {
    describe('isValidString', () => {
        it('deve retornar true para string não vazia', () => {
            expect(isValidString('test')).toBe(true);
            expect(isValidString('hello world')).toBe(true);
        });

        it('deve retornar false para string vazia', () => {
            expect(isValidString('')).toBe(false);
            expect(isValidString('   ')).toBe(false);
        });

        it('deve retornar false para valores não-string', () => {
            expect(isValidString(null)).toBe(false);
            expect(isValidString(undefined)).toBe(false);
            expect(isValidString(123)).toBe(false);
            expect(isValidString([])).toBe(false);
            expect(isValidString({})).toBe(false);
        });
    });

    describe('isValidArray', () => {
        it('deve retornar true para array não vazio', () => {
            expect(isValidArray([1, 2, 3])).toBe(true);
            expect(isValidArray(['a', 'b'])).toBe(true);
        });

        it('deve retornar false para array vazio', () => {
            expect(isValidArray([])).toBe(false);
        });

        it('deve retornar false para valores não-array', () => {
            expect(isValidArray(null)).toBe(false);
            expect(isValidArray(undefined)).toBe(false);
            expect(isValidArray('string')).toBe(false);
            expect(isValidArray({})).toBe(false);
        });
    });

    describe('sanitizeString', () => {
        it('deve remover caracteres especiais', () => {
            expect(sanitizeString('hello!@#world')).toBe('helloworld');
            expect(sanitizeString('test$%^&*()')).toBe('test');
        });

        it('deve manter letras e números', () => {
            expect(sanitizeString('hello123')).toBe('hello123');
            expect(sanitizeString('test-word')).toBe('test-word');
        });

        it('deve manter acentos', () => {
            expect(sanitizeString('café')).toBe('café');
            expect(sanitizeString('ação')).toBe('ação');
        });

        it('deve lançar erro para valores não-string', () => {
            expect(() => sanitizeString(null)).toThrow();
            expect(() => sanitizeString(123)).toThrow();
        });
    });

    describe('normalizeString', () => {
        it('deve converter para lowercase', () => {
            expect(normalizeString('HELLO')).toBe('hello');
            expect(normalizeString('World')).toBe('world');
        });

        it('deve remover acentos', () => {
            expect(normalizeString('café')).toBe('cafe');
            expect(normalizeString('ação')).toBe('acao');
            expect(normalizeString('São Paulo')).toBe('sao paulo');
        });

        it('deve lançar erro para valores não-string', () => {
            expect(() => normalizeString(null)).toThrow();
            expect(() => normalizeString(123)).toThrow();
        });
    });

    describe('validateConfig', () => {
        it('deve retornar true para configuração válida', () => {
            expect(validateConfig({})).toBe(true);
            expect(validateConfig({ minChars: 2 })).toBe(true);
            expect(validateConfig({ maxResults: 10 })).toBe(true);
            expect(validateConfig({ highlightMatch: true })).toBe(true);
        });

        it('deve retornar false para valores não-objeto', () => {
            expect(validateConfig(null)).toBe(false);
            expect(validateConfig([])).toBe(false);
            expect(validateConfig('string')).toBe(false);
            expect(validateConfig(123)).toBe(false);
        });

        it('deve validar minChars corretamente', () => {
            expect(validateConfig({ minChars: 1 })).toBe(true);
            expect(validateConfig({ minChars: 0 })).toBe(false);
            expect(validateConfig({ minChars: -1 })).toBe(false);
            expect(validateConfig({ minChars: 1.5 })).toBe(false);
        });

        it('deve validar maxResults corretamente', () => {
            expect(validateConfig({ maxResults: 10 })).toBe(true);
            expect(validateConfig({ maxResults: 0 })).toBe(false);
            expect(validateConfig({ maxResults: -1 })).toBe(false);
        });

        it('deve validar debounceDelay corretamente', () => {
            expect(validateConfig({ debounceDelay: 0 })).toBe(true);
            expect(validateConfig({ debounceDelay: 300 })).toBe(true);
            expect(validateConfig({ debounceDelay: -1 })).toBe(false);
        });

        it('deve validar propriedades booleanas', () => {
            expect(validateConfig({ highlightMatch: true })).toBe(true);
            expect(validateConfig({ highlightMatch: false })).toBe(true);
            expect(validateConfig({ highlightMatch: 'true' })).toBe(false);
        });
    });
});

