/**
 * Constantes do Projeto
 * 
 * Centraliza valores constantes usados em todo o projeto
 */

// Configurações padrão do Autocomplete
export const DEFAULT_CONFIG = {
    minChars: 2,              // Mínimo de caracteres para iniciar busca
    maxResults: 10,           // Máximo de resultados a exibir
    debounceDelay: 300,       // Delay em ms para debounce
    highlightMatch: true,     // Destacar texto correspondente
    caseSensitive: false,     // Busca case-sensitive
    autoFocus: true,          // Auto-focar primeiro resultado
    closeOnBlur: true,        // Fechar ao perder foco
    closeOnSelect: true,      // Fechar ao selecionar item
};

// Classes CSS
export const CSS_CLASSES = {
    container: 'autocomplete-container',
    input: 'autocomplete-input',
    list: 'autocomplete-list',
    item: 'autocomplete-item',
    itemSelected: 'autocomplete-item--selected',
    itemHighlight: 'autocomplete-highlight',
    hidden: 'autocomplete-hidden',
    loading: 'autocomplete-loading',
};

// Códigos de teclas
export const KEY_CODES = {
    ENTER: 13,
    ESCAPE: 27,
    ARROW_UP: 38,
    ARROW_DOWN: 40,
    TAB: 9,
};

// Mensagens
export const MESSAGES = {
    NO_RESULTS: 'Nenhum resultado encontrado',
    LOADING: 'Carregando...',
    ERROR: 'Erro ao carregar dados',
    MIN_CHARS: (min) => `Digite ao menos ${min} caracteres`,
};

// Configurações de performance
export const PERFORMANCE = {
    CACHE_SIZE: 100,          // Tamanho máximo do cache
    RENDER_BATCH_SIZE: 50,    // Quantidade de itens a renderizar por vez
};

export default {
    DEFAULT_CONFIG,
    CSS_CLASSES,
    KEY_CODES,
    MESSAGES,
    PERFORMANCE,
};

