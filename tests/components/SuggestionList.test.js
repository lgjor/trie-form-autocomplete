import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import SuggestionList from '../../src/components/SuggestionList.js';
import { CSS_CLASSES } from '../../src/config/constants.js';

describe('SuggestionList', () => {
    let container;
    let suggestionList;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        suggestionList = new SuggestionList(container);
    });

    afterEach(() => {
        if (container && container.parentNode) {
            document.body.removeChild(container);
        }
    });

    describe('create', () => {
        it('deve criar elemento de lista', () => {
            suggestionList.create();
            expect(suggestionList.listElement).toBeTruthy();
            expect(suggestionList.listElement.tagName).toBe('UL');
        });

        it('não deve criar lista duplicada', () => {
            suggestionList.create();
            const firstElement = suggestionList.listElement;
            suggestionList.create();
            expect(suggestionList.listElement).toBe(firstElement);
        });
    });

    describe('show e hide', () => {
        beforeEach(() => {
            suggestionList.create();
        });

        it('deve mostrar lista', () => {
            suggestionList.hide();
            suggestionList.show();
            expect(suggestionList.listElement.classList.contains(CSS_CLASSES.hidden)).toBe(false);
        });

        it('deve esconder lista', () => {
            suggestionList.show();
            suggestionList.hide();
            expect(suggestionList.listElement.classList.contains(CSS_CLASSES.hidden)).toBe(true);
        });
    });

    describe('render', () => {
        beforeEach(() => {
            suggestionList.create();
        });

        it('deve renderizar sugestões', () => {
            suggestionList.render(['apple', 'banana'], '');
            expect(suggestionList.items.length).toBe(2);
        });

        it('deve aplicar highlight quando query fornecido', () => {
            suggestionList.render(['apple'], 'app');
            const item = suggestionList.items[0];
            expect(item.innerHTML).toContain('autocomplete-highlight');
        });

        it('deve limpar sugestões anteriores', () => {
            suggestionList.render(['apple'], '');
            suggestionList.render(['banana'], '');
            expect(suggestionList.items.length).toBe(1);
        });
    });

    describe('selectItem', () => {
        beforeEach(() => {
            suggestionList.create();
            suggestionList.render(['apple', 'banana', 'orange'], '');
        });

        it('deve selecionar item por índice', () => {
            suggestionList.selectItem(1);
            expect(suggestionList.selectedIndex).toBe(1);
        });

        it('deve adicionar classe de seleção', () => {
            suggestionList.selectItem(0);
            const item = suggestionList.items[0];
            expect(item.classList.contains(CSS_CLASSES.itemSelected)).toBe(true);
        });
    });

    describe('selectNext e selectPrevious', () => {
        beforeEach(() => {
            suggestionList.create();
            suggestionList.render(['apple', 'banana', 'orange'], '');
        });

        it('deve selecionar próximo item', () => {
            suggestionList.selectItem(0);
            suggestionList.selectNext();
            expect(suggestionList.selectedIndex).toBe(1);
        });

        it('deve fazer wrap circular ao selecionar próximo', () => {
            suggestionList.selectItem(2);
            suggestionList.selectNext();
            expect(suggestionList.selectedIndex).toBe(0);
        });

        it('deve selecionar item anterior', () => {
            suggestionList.selectItem(1);
            suggestionList.selectPrevious();
            expect(suggestionList.selectedIndex).toBe(0);
        });

        it('deve fazer wrap circular ao selecionar anterior', () => {
            suggestionList.selectItem(0);
            suggestionList.selectPrevious();
            expect(suggestionList.selectedIndex).toBe(2);
        });
    });

    describe('getSelectedItem', () => {
        beforeEach(() => {
            suggestionList.create();
            suggestionList.render(['apple', 'banana'], '');
        });

        it('deve retornar item selecionado', () => {
            suggestionList.selectItem(0);
            expect(suggestionList.getSelectedItem()).toBe('apple');
        });

        it('deve retornar null se nenhum item selecionado', () => {
            expect(suggestionList.getSelectedItem()).toBeNull();
        });
    });

    describe('clear', () => {
        beforeEach(() => {
            suggestionList.create();
            suggestionList.render(['apple', 'banana'], '');
        });

        it('deve limpar itens', () => {
            suggestionList.clear();
            expect(suggestionList.items.length).toBe(0);
            expect(suggestionList.selectedIndex).toBe(-1);
        });
    });

    describe('destroy', () => {
        beforeEach(() => {
            suggestionList.create();
        });

        it('deve remover elemento do DOM', () => {
            suggestionList.destroy();
            expect(suggestionList.listElement).toBeNull();
            expect(container.querySelector('ul')).toBeNull();
        });
    });
});

