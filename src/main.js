/**
 * Main Entry Point
 * 
 * Responsabilidade:
 * - Inicializar a aplicação
 * - Fazer a composição dos objetos (Dependency Injection manual)
 * - Expor API pública
 * 
 * Este é o ponto de entrada que conecta todos os componentes
 * seguindo o Dependency Inversion Principle
 */

import Trie from './core/Trie.js';
import DataService from './services/DataService.js';
import SearchService from './services/SearchService.js';
import AutocompleteInput from './components/AutocompleteInput.js';
import { DEFAULT_CONFIG } from './config/constants.js';

/**
 * Factory function para criar instância de autocomplete
 * 
 * @param {string|HTMLInputElement} inputSelector - Seletor CSS ou elemento input
 * @param {Object} options - Opções de configuração
 * @returns {AutocompleteInput}
 */
function createAutocomplete(inputSelector, options = {}) {
    // 1. Obter elemento input
    const inputElement = typeof inputSelector === 'string'
        ? document.querySelector(inputSelector)
        : inputSelector;
    
    // 2. Validar elemento
    if (!inputElement) {
        throw new Error('Elemento input não encontrado');
    }
    
    if (!(inputElement instanceof HTMLInputElement)) {
        throw new Error('Elemento fornecido não é um input');
    }
    
    // 3. Criar instâncias dos serviços
    const trie = new Trie();
    const dataService = new DataService();
    const searchService = new SearchService(trie);
    
    // 4. Carregar dados (se fornecidos)
    if (options.data) {
        dataService.loadFromArray(options.data);
        searchService.indexData(dataService.getData());
    }
    
    // 5. Criar instância de AutocompleteInput
    const autocomplete = new AutocompleteInput(
        inputElement,
        searchService,
        options
    );
    
    // 6. Inicializar componente
    autocomplete.initialize();
    
    // 7. Retornar instância configurada
    return autocomplete;
}

/**
 * Inicializa múltiplos autocompletes
 * @param {string} selector - Seletor CSS para inputs
 * @param {Object} options - Opções compartilhadas
 * @returns {AutocompleteInput[]}
 */
function initializeAll(selector, options = {}) {
    // 1. Buscar todos os elementos que correspondem ao seletor
    const elements = document.querySelectorAll(selector);
    
    // 2. Converter NodeList para Array
    const elementsArray = Array.from(elements);
    
    // 3. Validar se encontrou elementos
    if (elementsArray.length === 0) {
        console.warn(`Nenhum elemento encontrado com o seletor: ${selector}`);
        return [];
    }
    
    // 4. Criar autocomplete para cada elemento
    const autocompletes = elementsArray.map(element => {
        return createAutocomplete(element, options);
    });
    
    // 5. Retornar array de instâncias
    return autocompletes;
}

/**
 * API pública do módulo
 */
const TrieAutocomplete = {
    create: createAutocomplete,
    initializeAll: initializeAll,
    version: '1.0.0',
};

// Exporta para uso como módulo ES6
export default TrieAutocomplete;

// Expõe globalmente para uso sem bundler
if (typeof window !== 'undefined') {
    window.TrieAutocomplete = TrieAutocomplete;
}



