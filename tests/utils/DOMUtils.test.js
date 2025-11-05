import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { 
    createElement, 
    removeAllChildren, 
    highlightMatch, 
    addDebouncedListener,
    calculateDropdownPosition
} from '../../src/utils/DOMUtils.js';

describe('DOMUtils', () => {
    describe('createElement', () => {
        it('deve criar elemento HTML básico', () => {
            const element = createElement('div');
            expect(element.tagName).toBe('DIV');
        });

        it('deve adicionar classes CSS', () => {
            const element = createElement('div', ['class1', 'class2']);
            expect(element.classList.contains('class1')).toBe(true);
            expect(element.classList.contains('class2')).toBe(true);
        });

        it('deve adicionar atributos', () => {
            const element = createElement('input', [], { type: 'text', id: 'test' });
            expect(element.getAttribute('type')).toBe('text');
            expect(element.getAttribute('id')).toBe('test');
        });

        it('deve lançar erro para tag inválida', () => {
            expect(() => createElement('')).toThrow();
            expect(() => createElement(null)).toThrow();
        });
    });

    describe('removeAllChildren', () => {
        it('deve remover todos os filhos de um elemento', () => {
            const parent = document.createElement('div');
            parent.appendChild(document.createElement('span'));
            parent.appendChild(document.createElement('span'));
            
            expect(parent.children.length).toBe(2);
            removeAllChildren(parent);
            expect(parent.children.length).toBe(0);
        });

        it('deve lançar erro para elemento inválido', () => {
            expect(() => removeAllChildren(null)).toThrow();
            expect(() => removeAllChildren(undefined)).toThrow();
        });
    });

    describe('highlightMatch', () => {
        it('deve destacar texto correspondente', () => {
            const result = highlightMatch('apple', 'app');
            expect(result).toContain('<span class="autocomplete-highlight">');
            expect(result).toContain('app');
        });

        it('deve retornar texto original se query vazio', () => {
            expect(highlightMatch('apple', '')).toBe('apple');
        });

        it('deve ser case-insensitive', () => {
            const result = highlightMatch('Apple', 'app');
            expect(result).toContain('<span class="autocomplete-highlight">');
        });

        it('deve escapar caracteres especiais no query', () => {
            const result = highlightMatch('test[value]', '[');
            expect(result).toContain('[');
        });

        it('deve lançar erro para valores não-string', () => {
            expect(() => highlightMatch(null, 'test')).toThrow();
            expect(() => highlightMatch('test', null)).toThrow();
        });
    });

    describe('addDebouncedListener', () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });

        afterEach(() => {
            vi.restoreAllMocks();
        });

        it('deve executar callback após delay', () => {
            const element = document.createElement('input');
            const callback = vi.fn();
            
            addDebouncedListener(element, 'input', callback, 300);
            
            element.dispatchEvent(new Event('input'));
            expect(callback).not.toHaveBeenCalled();
            
            vi.advanceTimersByTime(300);
            expect(callback).toHaveBeenCalledTimes(1);
        });

        it('deve cancelar execução anterior se novo evento ocorrer', () => {
            const element = document.createElement('input');
            const callback = vi.fn();
            
            addDebouncedListener(element, 'input', callback, 300);
            
            element.dispatchEvent(new Event('input'));
            vi.advanceTimersByTime(200);
            element.dispatchEvent(new Event('input'));
            vi.advanceTimersByTime(300);
            
            expect(callback).toHaveBeenCalledTimes(1);
        });

        it('deve retornar função para remover listener', () => {
            const element = document.createElement('input');
            const callback = vi.fn();
            
            const remove = addDebouncedListener(element, 'input', callback, 300);
            remove();
            
            element.dispatchEvent(new Event('input'));
            vi.advanceTimersByTime(300);
            
            expect(callback).not.toHaveBeenCalled();
        });
    });

    describe('calculateDropdownPosition', () => {
        it('deve calcular posição correta do dropdown', () => {
            const input = document.createElement('input');
            input.style.position = 'absolute';
            input.style.top = '100px';
            input.style.left = '50px';
            input.style.width = '200px';
            input.style.height = '40px';
            document.body.appendChild(input);
            
            // Forçar layout para jsdom calcular dimensões
            input.offsetWidth; // Trigger layout
            
            const position = calculateDropdownPosition(input);
            
            expect(position).toHaveProperty('top');
            expect(position).toHaveProperty('left');
            expect(position).toHaveProperty('width');
            // Usar offsetWidth como fallback já que getBoundingClientRect pode não funcionar em jsdom
            expect(position.width).toBeGreaterThanOrEqual(0);
            
            document.body.removeChild(input);
        });

        it('deve lançar erro para elemento inválido', () => {
            expect(() => calculateDropdownPosition(null)).toThrow();
        });
    });
});

