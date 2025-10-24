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
    // TODO: Implementar factory
    // 1. Obter elemento input
    // 2. Criar instâncias dos serviços
    // 3. Injetar dependências
    // 4. Retornar instância configurada
}

/**
 * Inicializa múltiplos autocompletes
 * @param {string} selector - Seletor CSS para inputs
 * @param {Object} options - Opções compartilhadas
 * @returns {AutocompleteInput[]}
 */
function initializeAll(selector, options = {}) {
    // TODO: Implementar inicialização múltipla
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



