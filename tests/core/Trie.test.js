import { describe, it, expect, beforeEach } from 'vitest';
import Trie from '../../src/core/Trie.js';

describe('Trie', () => {
    let trie;

    beforeEach(() => {
        trie = new Trie();
    });

    describe('insert', () => {
        it('deve inserir palavra corretamente', () => {
            trie.insert('apple');
            expect(trie.contains('apple')).toBe(true);
        });

        it('deve inserir múltiplas palavras', () => {
            trie.insert('apple');
            trie.insert('app');
            trie.insert('application');
            
            expect(trie.contains('apple')).toBe(true);
            expect(trie.contains('app')).toBe(true);
            expect(trie.contains('application')).toBe(true);
        });

        it('não deve inserir valores inválidos', () => {
            trie.insert(null);
            trie.insert(undefined);
            trie.insert('');
            trie.insert(123);
            
            expect(trie.contains('')).toBe(false);
        });
    });

    describe('contains', () => {
        it('deve retornar true para palavra existente', () => {
            trie.insert('test');
            expect(trie.contains('test')).toBe(true);
        });

        it('deve retornar false para palavra não existente', () => {
            trie.insert('test');
            expect(trie.contains('testing')).toBe(false);
            expect(trie.contains('tes')).toBe(false);
        });

        it('deve retornar false para prefixo de palavra existente', () => {
            trie.insert('application');
            expect(trie.contains('app')).toBe(false);
        });
    });

    describe('search', () => {
        it('deve retornar palavras com prefixo correto', () => {
            trie.insert('apple');
            trie.insert('app');
            trie.insert('application');
            trie.insert('apply');
            
            const results = trie.search('app');
            expect(results).toContain('app');
            expect(results).toContain('apple');
            expect(results).toContain('application');
            expect(results).toContain('apply');
        });

        it('deve retornar array vazio para prefixo não encontrado', () => {
            trie.insert('apple');
            expect(trie.search('xyz')).toEqual([]);
        });

        it('deve retornar array vazio para valores inválidos', () => {
            expect(trie.search(null)).toEqual([]);
            expect(trie.search(undefined)).toEqual([]);
            expect(trie.search('')).toEqual([]);
        });

        it('deve buscar prefixos case-sensitive', () => {
            trie.insert('Apple');
            trie.insert('apple');
            
            expect(trie.search('App')).toContain('Apple');
            expect(trie.search('app')).toContain('apple');
        });
    });

    describe('remove', () => {
        it('deve remover palavra existente', () => {
            trie.insert('apple');
            expect(trie.contains('apple')).toBe(true);
            
            trie.remove('apple');
            expect(trie.contains('apple')).toBe(false);
        });

        it('não deve remover outras palavras ao remover uma', () => {
            trie.insert('apple');
            trie.insert('app');
            
            trie.remove('apple');
            expect(trie.contains('app')).toBe(true);
        });

        it('deve retornar false para palavra não existente', () => {
            expect(trie.remove('nonexistent')).toBe(false);
        });
    });
});

