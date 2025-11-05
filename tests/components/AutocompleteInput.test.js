import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import AutocompleteInput from '../../src/components/AutocompleteInput.js';
import SearchService from '../../src/services/SearchService.js';
import Trie from '../../src/core/Trie.js';

describe('AutocompleteInput', () => {
    let inputElement;
    let searchService;
    let autocomplete;

    beforeEach(() => {
        // Criar container wrapper para o input
        const wrapper = document.createElement('div');
        inputElement = document.createElement('input');
        inputElement.type = 'text';
        wrapper.appendChild(inputElement);
        document.body.appendChild(wrapper);
        
        const trie = new Trie();
        searchService = new SearchService(trie);
        searchService.indexData(['apple', 'application', 'app', 'banana']);
        
        autocomplete = new AutocompleteInput(inputElement, searchService);
    });

    afterEach(() => {
        if (autocomplete) {
            autocomplete.destroy();
        }
        // Limpar tudo do DOM
        if (inputElement) {
            const container = inputElement.closest('.autocomplete-container') || inputElement.parentElement;
            if (container && container.parentNode) {
                container.parentNode.removeChild(container);
            } else if (inputElement.parentNode && inputElement.parentNode !== document.body) {
                inputElement.parentNode.removeChild(inputElement);
            }
        }
        // Limpar qualquer elemento restante
        document.body.innerHTML = '';
    });

    describe('constructor', () => {
        it('deve criar instância corretamente', () => {
            expect(autocomplete.inputElement).toBe(inputElement);
            expect(autocomplete.searchService).toBe(searchService);
            expect(autocomplete.isActive).toBe(false);
        });

        it('deve mesclar configurações padrão', () => {
            const customConfig = { minChars: 3 };
            const customAutocomplete = new AutocompleteInput(inputElement, searchService, customConfig);
            
            expect(customAutocomplete.config.minChars).toBe(3);
            expect(customAutocomplete.config.maxResults).toBeDefined();
        });
    });

    describe('initialize', () => {
        it('deve inicializar componente', () => {
            autocomplete.initialize();
            expect(autocomplete.isActive).toBe(true);
            expect(autocomplete.suggestionList).toBeTruthy();
        });

        it('deve criar container se não existir', () => {
            autocomplete.initialize();
            const container = inputElement.parentElement;
            expect(container.classList.contains('autocomplete-container')).toBe(true);
        });
    });

    describe('_handleInput', () => {
        beforeEach(() => {
            autocomplete.initialize();
        });

        it('deve executar busca quando tem caracteres mínimos', () => {
            const performSearchSpy = vi.spyOn(autocomplete, '_performSearch');
            inputElement.value = 'app';
            autocomplete._handleInput({ target: inputElement });
            
            expect(performSearchSpy).toHaveBeenCalledWith('app');
        });

        it('deve esconder lista quando não tem caracteres mínimos', () => {
            const hideSpy = vi.spyOn(autocomplete, '_hideSuggestions');
            inputElement.value = 'a';
            autocomplete._handleInput({ target: inputElement });
            
            expect(hideSpy).toHaveBeenCalled();
        });
    });

    describe('_performSearch', () => {
        beforeEach(() => {
            autocomplete.initialize();
        });

        it('deve buscar e exibir resultados', () => {
            const showSpy = vi.spyOn(autocomplete, '_showSuggestions');
            autocomplete._performSearch('app');
            
            expect(showSpy).toHaveBeenCalled();
        });
    });

    describe('_selectSuggestion', () => {
        beforeEach(() => {
            autocomplete.initialize();
        });

        it('deve atualizar valor do input', () => {
            autocomplete._selectSuggestion('apple');
            expect(inputElement.value).toBe('apple');
        });

        it('deve esconder lista se closeOnSelect configurado', () => {
            autocomplete.config.closeOnSelect = true;
            const hideSpy = vi.spyOn(autocomplete, '_hideSuggestions');
            autocomplete._selectSuggestion('apple');
            
            expect(hideSpy).toHaveBeenCalled();
        });
    });

    describe('destroy', () => {
        beforeEach(() => {
            autocomplete.initialize();
        });

        it('deve limpar recursos', () => {
            autocomplete.destroy();
            expect(autocomplete.isActive).toBe(false);
            expect(autocomplete.suggestionList).toBeNull();
        });
    });
});

