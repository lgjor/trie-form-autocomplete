import { describe, it, expect, beforeEach, vi } from 'vitest';
import DataService from '../../src/services/DataService.js';

describe('DataService', () => {
    let dataService;

    beforeEach(() => {
        dataService = new DataService();
    });

    describe('loadFromArray', () => {
        it('deve carregar array de strings', () => {
            const data = ['apple', 'banana', 'orange'];
            dataService.loadFromArray(data);
            
            expect(dataService.getData()).toEqual(['apple', 'banana', 'orange']);
            expect(dataService.getCount()).toBe(3);
        });

        it('deve filtrar strings vazias', () => {
            const data = ['apple', '', '   ', 'banana'];
            dataService.loadFromArray(data);
            
            expect(dataService.getData()).toEqual(['apple', 'banana']);
        });

        it('deve remover espaços em branco', () => {
            const data = ['  apple  ', '  banana  '];
            dataService.loadFromArray(data);
            
            expect(dataService.getData()).toEqual(['apple', 'banana']);
        });

        it('deve lançar erro para valores não-array', () => {
            expect(() => dataService.loadFromArray(null)).toThrow();
            expect(() => dataService.loadFromArray('string')).toThrow();
        });

        it('deve retornar this para method chaining', () => {
            const result = dataService.loadFromArray(['test']);
            expect(result).toBe(dataService);
        });
    });

    describe('getData', () => {
        it('deve retornar array vazio inicialmente', () => {
            expect(dataService.getData()).toEqual([]);
        });

        it('deve retornar dados carregados', () => {
            dataService.loadFromArray(['apple', 'banana']);
            expect(dataService.getData()).toEqual(['apple', 'banana']);
        });
    });

    describe('getCount', () => {
        it('deve retornar 0 inicialmente', () => {
            expect(dataService.getCount()).toBe(0);
        });

        it('deve retornar contagem correta', () => {
            dataService.loadFromArray(['apple', 'banana', 'orange']);
            expect(dataService.getCount()).toBe(3);
        });
    });

    describe('hasData', () => {
        it('deve retornar false quando não há dados', () => {
            expect(dataService.hasData()).toBe(false);
        });

        it('deve retornar true quando há dados', () => {
            dataService.loadFromArray(['apple']);
            expect(dataService.hasData()).toBe(true);
        });
    });

    describe('clear', () => {
        it('deve limpar todos os dados', () => {
            dataService.loadFromArray(['apple', 'banana']);
            dataService.clear();
            
            expect(dataService.getData()).toEqual([]);
            expect(dataService.getCount()).toBe(0);
        });
    });
});

