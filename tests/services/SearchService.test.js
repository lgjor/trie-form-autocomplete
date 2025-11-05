import { describe, it, expect, beforeEach } from 'vitest';
import Trie from '../../src/core/Trie.js';
import SearchService from '../../src/services/SearchService.js';

describe('SearchService', () => {
    let trie;
    let searchService;

    beforeEach(() => {
        trie = new Trie();
        searchService = new SearchService(trie);
    });

    describe('indexData', () => {
        it('deve indexar dados corretamente', () => {
            const data = ['apple', 'application', 'app'];
            searchService.indexData(data);
            
            const results = searchService.search('app');
            expect(results.length).toBeGreaterThan(0);
        });

        it('deve normalizar dados para lowercase', () => {
            searchService.indexData(['Apple', 'BANANA']);
            
            const results1 = searchService.search('app');
            const results2 = searchService.search('ban');
            
            expect(results1).toContain('Apple');
            expect(results2).toContain('BANANA');
        });

        it('deve lançar erro para valores não-array', () => {
            expect(() => searchService.indexData(null)).toThrow();
            expect(() => searchService.indexData('string')).toThrow();
        });
    });

    describe('search', () => {
        beforeEach(() => {
            searchService.indexData(['apple', 'app', 'application', 'banana']);
        });

        it('deve retornar resultados para prefixo existente', () => {
            const results = searchService.search('app');
            expect(results.length).toBeGreaterThan(0);
        });

        it('deve retornar array vazio para prefixo não encontrado', () => {
            const results = searchService.search('xyz');
            expect(results).toEqual([]);
        });

        it('deve limitar resultados por maxResults', () => {
            const results = searchService.search('a', { maxResults: 2 });
            expect(results.length).toBeLessThanOrEqual(2);
        });

        it('deve retornar array vazio para valores inválidos', () => {
            expect(searchService.search(null)).toEqual([]);
            expect(searchService.search('')).toEqual([]);
        });
    });

    describe('clearCache', () => {
        it('deve limpar o cache', () => {
            searchService.indexData(['apple']);
            searchService.search('app'); // Popula cache
            
            searchService.clearCache();
            const stats = searchService.getStats();
            
            expect(stats.cacheSize).toBe(0);
        });
    });
});

