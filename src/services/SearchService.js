/**
 * SearchService
 * 
 * Responsabilidade (Single Responsibility Principle):
 * - Coordenar operações de busca
 * - Aplicar filtros e ordenação nos resultados
 * - Gerenciar cache de buscas (opcional)
 * 
 * Dependency Inversion Principle:
 * - Depende da abstração Trie, não de implementação específica
 */
class SearchService {
    /**
     * @param {Trie} trie - Instância da estrutura Trie
     * @param {Object} config - Configurações do serviço
     */
    constructor(trie, config = {}) {
        this.trie = trie;
        this.config = {
            cacheEnabled: true,
            maxCacheSize: 100,
            defaultMaxResults: 10,
            defaultSortOrder: 'asc',
            ...config
        };
        this.searchCache = new Map();
        this.stats = {
            totalSearches: 0,
            cacheHits: 0,
            cacheMisses: 0
        };
    }

    /**
     * Realiza busca por prefixo
     * @param {string} prefix - Prefixo para busca
     * @param {Object} options - Opções de busca
     * @param {number} options.maxResults - Máximo de resultados (padrão: 10)
     * @param {string} options.sortOrder - Ordem de classificação ('asc'|'desc')
     * @param {boolean} options.caseSensitive - Busca case-sensitive
     * @param {Function} options.filterFn - Função de filtro customizada
     * @param {boolean} options.useCache - Usar cache (padrão: true)
     * @returns {string[]} Resultados da busca
     */
    search(prefix, options = {}) {
        // Validação de entrada
        if (!prefix || typeof prefix !== 'string') {
            return [];
        }

        // Normalizar prefixo
        const normalizedPrefix = options.caseSensitive ? prefix : prefix.toLowerCase();
        
        // Configurações com valores padrão
        const searchOptions = {
            maxResults: this.config.defaultMaxResults,
            sortOrder: this.config.defaultSortOrder,
            caseSensitive: false,
            useCache: this.config.cacheEnabled,
            ...options
        };

        // Gerar chave do cache
        const cacheKey = this._generateCacheKey(normalizedPrefix, searchOptions);
        
        // Verificar cache se habilitado
        if (searchOptions.useCache && this.searchCache.has(cacheKey)) {
            this.stats.cacheHits++;
            return [...this.searchCache.get(cacheKey)]; // Retorna cópia
        }

        this.stats.cacheMisses++;
        this.stats.totalSearches++;

        // Realizar busca na Trie
        let results = this.trie.search(normalizedPrefix);

        // Aplicar filtro customizado se fornecido
        if (searchOptions.filterFn && typeof searchOptions.filterFn === 'function') {
            results = results.filter(searchOptions.filterFn);
        }

        // Aplicar ordenação
        results = this._sortResults(results, searchOptions.sortOrder, searchOptions.caseSensitive);

        // Aplicar limite de resultados
        if (searchOptions.maxResults > 0) {
            results = results.slice(0, searchOptions.maxResults);
        }

        // Armazenar no cache se habilitado
        if (searchOptions.useCache) {
            this._addToCache(cacheKey, results);
        }

        return [...results]; // Retorna cópia para evitar mutação
    }

    /**
     * Limpa o cache de buscas
     */
    clearCache() {
        this.searchCache.clear();
        this.stats.cacheHits = 0;
        this.stats.cacheMisses = 0;
    }

    /**
     * Indexa dados no Trie
     * @param {string[]} data - Dados a serem indexados
     */
    indexData(data) {
        if (!Array.isArray(data)) {
            throw new Error('SearchService: indexData espera um array');
        }

        // Limpar Trie atual
        this._clearTrie();
        
        // Inserir novos dados
        data.forEach(item => {
            if (typeof item === 'string' && item.trim().length > 0) {
                this.trie.insert(item.trim());
            }
        });

        // Limpar cache após reindexação
        this.clearCache();
    }

    /**
     * Aplica filtros customizados aos resultados
     * @param {string[]} results - Resultados a filtrar
     * @param {Function} filterFn - Função de filtro
     * @returns {string[]}
     */
    applyFilter(results, filterFn) {
        if (!Array.isArray(results)) {
            return [];
        }

        if (typeof filterFn !== 'function') {
            throw new Error('SearchService: applyFilter espera uma função');
        }

        return results.filter(filterFn);
    }

    /**
     * Busca com múltiplos prefixos (OR)
     * @param {string[]} prefixes - Array de prefixos
     * @param {Object} options - Opções de busca
     * @returns {string[]} Resultados únicos
     */
    searchMultiple(prefixes, options = {}) {
        if (!Array.isArray(prefixes) || prefixes.length === 0) {
            return [];
        }

        const allResults = new Set();
        
        prefixes.forEach(prefix => {
            const results = this.search(prefix, options);
            results.forEach(result => allResults.add(result));
        });

        return Array.from(allResults);
    }

    /**
     * Busca fuzzy (tolerante a erros)
     * @param {string} query - Consulta com possíveis erros
     * @param {Object} options - Opções de busca
     * @param {number} options.maxDistance - Distância máxima de Levenshtein
     * @returns {string[]} Resultados com similaridade
     */
    searchFuzzy(query, options = {}) {
        const fuzzyOptions = {
            maxDistance: 2,
            ...options
        };

        // Primeiro tenta busca exata
        let results = this.search(query, { ...fuzzyOptions, useCache: false });
        
        if (results.length === 0) {
            // Se não encontrou, busca todas as palavras e filtra por similaridade
            const allWords = this._getAllWords();
            results = allWords.filter(word => 
                this._levenshteinDistance(query, word) <= fuzzyOptions.maxDistance
            );
        }

        return results.slice(0, fuzzyOptions.maxResults || this.config.defaultMaxResults);
    }

    /**
     * Retorna estatísticas do serviço
     * @returns {Object} Estatísticas
     */
    getStats() {
        return {
            ...this.stats,
            cacheSize: this.searchCache.size,
            cacheHitRate: this.stats.totalSearches > 0 
                ? (this.stats.cacheHits / this.stats.totalSearches * 100).toFixed(2) + '%'
                : '0%'
        };
    }

    /**
     * Gera chave única para o cache
     * @param {string} prefix - Prefixo da busca
     * @param {Object} options - Opções da busca
     * @returns {string} Chave do cache
     */
    _generateCacheKey(prefix, options) {
        return `${prefix}|${options.maxResults}|${options.sortOrder}|${options.caseSensitive}|${options.filterFn ? 'filtered' : 'normal'}`;
    }

    /**
     * Adiciona resultado ao cache
     * @param {string} key - Chave do cache
     * @param {string[]} results - Resultados
     */
    _addToCache(key, results) {
        // Limitar tamanho do cache
        if (this.searchCache.size >= this.config.maxCacheSize) {
            // Remove o primeiro item (FIFO)
            const firstKey = this.searchCache.keys().next().value;
            this.searchCache.delete(firstKey);
        }

        this.searchCache.set(key, [...results]);
    }

    /**
     * Ordena resultados
     * @param {string[]} results - Resultados a ordenar
     * @param {string} sortOrder - Ordem ('asc'|'desc')
     * @param {boolean} caseSensitive - Case-sensitive
     * @returns {string[]} Resultados ordenados
     */
    _sortResults(results, sortOrder, caseSensitive) {
        return results.sort((a, b) => {
            const aCompare = caseSensitive ? a : a.toLowerCase();
            const bCompare = caseSensitive ? b : b.toLowerCase();
            
            const comparison = aCompare.localeCompare(bCompare, 'pt-BR');
            return sortOrder === 'desc' ? -comparison : comparison;
        });
    }

    /**
     * Limpa a Trie (método auxiliar)
     */
    _clearTrie() {
        // Como não temos método clear na Trie, recriamos a instância
        // Em uma implementação real, seria melhor adicionar um método clear na Trie
        this.trie = new (this.trie.constructor)();
    }

    /**
     * Obtém todas as palavras da Trie
     * @returns {string[]} Todas as palavras
     */
    _getAllWords() {
        // Implementação alternativa que não depende de métodos privados
        const allWords = [];
        
        // Função recursiva para coletar palavras
        const collectFromNode = (node, currentWord = '') => {
            // Se este nó marca o fim de uma palavra, adiciona ao resultado
            if (node.isEndOfWord) {
                allWords.push(currentWord);
            }
            
            // Recursivamente coleta palavras de todos os filhos
            for (let char in node.children) {
                collectFromNode(node.children[char], currentWord + char);
            }
        };
        
        // Começa da raiz
        collectFromNode(this.trie.root);
        
        return allWords;
    }

    /**
     * Calcula distância de Levenshtein entre duas strings
     * @param {string} str1 - Primeira string
     * @param {string} str2 - Segunda string
     * @returns {number} Distância
     */
    _levenshteinDistance(str1, str2) {
        const matrix = [];
        
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        
        return matrix[str2.length][str1.length];
    }
}

export default SearchService;

