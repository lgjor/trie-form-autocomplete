/**
 * Validator
 * 
 * Responsabilidade (Single Responsibility Principle):
 * - Validar entrada de dados
 * - Sanitizar strings
 * - Verificar tipos e formatos
 */

/**
 * Valida se o input é uma string não vazia
 * @param {*} input
 * @returns {boolean}
 */
export function isValidString(input) {
    // Verifica se é string válida não vazia (após remover espaços)
    return typeof input === 'string' && input.trim().length > 0;
}

/**
 * Valida se o input é um array não vazio
 * @param {*} input
 * @returns {boolean}
 */
export function isValidArray(input) {
    // Verifica se é array válido não vazio
    return Array.isArray(input) && input.length > 0;
}

/**
 * Sanitiza string removendo caracteres especiais
 * @param {string} str
 * @returns {string}
 */
export function sanitizeString(str) {
    // Validar se é string
    if (typeof str !== 'string') {
        throw new Error('Str must be a string');
    }
    
    // Remover apenas símbolos/characteres especiais, mantendo letras acentuadas
    return str.replace(/[!@#$%^&*()\[\]{}|;:'"<>,./?\\]/g, '');
}

/**
 * Normaliza string (remove acentos, lowercase)
 * @param {string} str
 * @returns {string}
 */
export function normalizeString(str) {
    // TODO: Implementar normalização
    if (typeof str !== 'string') {
        throw new Error('Str must be a string');
    }
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Valida configuração do autocomplete
 * @param {Object} config
 * @returns {boolean}
 */
 // Opcional: Validar limites máximos em maxResults <= 1000, debounceDelay <= 10000
export function validateConfig(config) {
    // Validar se é objeto
    if (typeof config !== 'object' || config === null || Array.isArray(config)) {
        return false;
    }
    
    // Validar minChars (se presente)
    if ('minChars' in config) {
        if (typeof config.minChars !== 'number' || 
            !Number.isInteger(config.minChars) || 
            config.minChars < 1) {
            return false;
        }
    }
    
    // Validar maxResults (se presente)
    if ('maxResults' in config) {
        if (typeof config.maxResults !== 'number' || 
            !Number.isInteger(config.maxResults) || 
            config.maxResults < 1) {
            return false;
        }
    }
    
    // Validar debounceDelay (se presente)
    if ('debounceDelay' in config) {
        if (typeof config.debounceDelay !== 'number' || 
            config.debounceDelay < 0) {
            return false;
        }
    }
    
    // Validar propriedades booleanas (se presentes)
    const booleanProps = ['highlightMatch', 'caseSensitive', 'autoFocus', 
                          'closeOnBlur', 'closeOnSelect'];
    
    for (const prop of booleanProps) {
        if (prop in config && typeof config[prop] !== 'boolean') {
            return false;
        }
    }
    
    return true;
}

/**
 * Valida URL
 * @param {string} url
 * @returns {boolean}
 */
export function isValidURL(url) {
    // TODO: Implementar validação de URL
}

