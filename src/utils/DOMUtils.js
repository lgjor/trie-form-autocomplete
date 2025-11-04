/**
 * DOMUtils
 * 
 * Responsabilidade (Single Responsibility Principle):
 * - Fornecer funções auxiliares para manipulação do DOM
 * - Abstrair operações comuns do DOM
 * 
 * Funções utilitárias puras e reutilizáveis
 */

/**
 * Cria um elemento com classes e atributos
 * @param {string} tag - Tag HTML
 * @param {string[]} classes - Classes CSS
 * @param {Object} attributes - Atributos HTML
 * @returns {HTMLElement}
 */
export function createElement(tag, classes = [], attributes = {}) {
    
    if (typeof tag !== 'string' || tag.trim() === '') {
        throw new Error('Tag must be a non-empty string');
    }
    
    // Cria o elemento apenas se a tag for válida
    const element = document.createElement(tag);
    
    // 3. Normalizar classes para garantir que seja um array
    if (!Array.isArray(classes)) {
        classes = [];
    }
    
    // Adicionar classes
    if (classes.length > 0) {
        classes.forEach(className => {
            element.classList.add(className);
        });
    }
    
    // Adicionar atributos
    if (attributes != null && Object.keys(attributes).length > 0) {
        Object.keys(attributes).forEach(attribute => {
            element.setAttribute(attribute, attributes[attribute]);
        });
    }
    
    // Retornar elemento criado
    return element;
}

/**
 * Calcula posição ideal para dropdown
 * @param {HTMLElement} inputElement - Elemento de referência
 * @returns {Object} Objeto com top, left, width
 */
export function calculateDropdownPosition(inputElement) {
    // Validar se é HTMLElement válido
    if (!(inputElement instanceof HTMLElement)) {
        throw new Error('InputElement must be an HTMLElement');
    }

    // Obter dimensões e posição do elemento
    const rect = inputElement.getBoundingClientRect();
    const top = rect.bottom + window.scrollY;
    const left = rect.left + window.scrollX;
    const width = rect.width;

    // Retornar objeto com posição e largura
    return { top, left, width };
}

/**
 * Aplica highlight em texto correspondente
 * @param {string} text - Texto completo
 * @param {string} query - Texto a destacar
 * @returns {string} HTML com highlight
 */
export function highlightMatch(text, query) {
    // Validar se são strings (permitir vazias)
    if (typeof text !== 'string') {
        throw new Error('Text must be a string');
    }
    
    if (typeof query !== 'string') {
        throw new Error('Query must be a string');
    }
    // Se query vazia, retorna text sem highlight
    if (query.length === 0 || query.trim() === '') {
        return text;
    }
    // Se text vazio, retorna string vazia
    if (text.length === 0) {
        return '';
    }
    // Adiciona escape\ antes de caracteres especiais
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const regex = new RegExp(`(${escapedQuery})`, 'gi'); //gi = global e case-insensitive
    return text.replace(regex, '<span class="autocomplete-highlight">$1</span>');
}

/**
 * Verifica se elemento está visível no viewport
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export function isElementInViewport(element) {
    // TODO: Implementar verificação
}

/**
 * Adiciona listener com debounce
 * @param {HTMLElement} element
 * @param {string} eventType
 * @param {Function} callback
 * @param {number} delay
 * @returns {Function} Função para remover listener
 */
export function addDebouncedListener(element, eventType, callback, delay) {
    // Valida element
    if (!(element instanceof HTMLElement)) {
        throw new Error('Element must be an HTMLElement');
    }
    
    // Valida eventType
    if (typeof eventType !== 'string' || eventType.trim() === '') {
        throw new Error('EventType must be a non-empty string');
    }
    
    // Valida callback
    if (typeof callback !== 'function') {
        throw new Error('Callback must be a function');
    }
    
    // Valida delay
    if (typeof delay !== 'number' || delay < 0) {
        throw new Error('Delay must be a non-negative number');
    }
    
    // Variável do timeout ID
    let timeoutId;
    
    // Cria função debounced
    const debouncedCallback = function(...args) {
        // Limpa timeout anterior
        clearTimeout(timeoutId);
        
        // Cria novo timeout
        timeoutId = setTimeout(() => {
            callback.apply(this, args);
        }, delay);
    };
    
    // Adiciona listener ao elemento
    element.addEventListener(eventType, debouncedCallback);
    
    // Retorna função para remover listener
    return function removeListener() {
        // Limpa timeout pendente
        clearTimeout(timeoutId);
        
        // Remove listener do elemento
        element.removeEventListener(eventType, debouncedCallback);
    };
}

/**
 * Remove todos os filhos de um elemento
 * @param {HTMLElement} element
 */
export function removeAllChildren(element) {
    // Verificar se é null ou undefined
    if (element == null) {
        throw new Error('Element must be provided and cannot be null or undefined');
    }
    
    // Verificar se é HTMLElement válido
    if (!(element instanceof HTMLElement)) {
        throw new Error('Element must be an HTMLElement');
    }
    
    // Remover filhos
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

