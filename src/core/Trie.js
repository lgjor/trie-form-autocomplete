/**
 * Trie (Árvore de Prefixos)
 * 
 * Responsabilidade (Single Responsibility Principle):
 * - Implementar a estrutura de dados Trie
 * - Gerenciar inserção, busca e remoção de palavras
 * - Fornecer métodos para busca por prefixo
 * 
 * Esta classe é focada APENAS na lógica da estrutura de dados.
 */
class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    /**
     * Insere uma palavra na Trie
     * @param {string} word - Palavra a ser inserida
     */
    insert(word) {
        if (!word || typeof word !== 'string') {
            return;
        }

        let current = this.root;
        
        // Percorre cada caractere da palavra
        for (let char of word) {
            // Se o nó não tem o caractere como filho, cria um novo nó
            if (!current.children[char]) {
                current.children[char] = new TrieNode();
            }
            // Move para o próximo nó
            current = current.children[char];
        }
        
        // Marca o último nó como fim de palavra
        current.isEndOfWord = true;
    }

    /**
     * Busca palavras que começam com o prefixo dado
     * @param {string} prefix - Prefixo para busca
     * @returns {string[]} Array de palavras encontradas
     */
    search(prefix) {
        if (!prefix || typeof prefix !== 'string') {
            return [];
        }

        let current = this.root;
        
        // Percorre o prefixo para encontrar o nó inicial
        for (let char of prefix) {
            if (!current.children[char]) {
                // Prefixo não encontrado
                return [];
            }
            current = current.children[char];
        }
        
        // A partir do nó do prefixo, coleta todas as palavras
        return this._collectWords(current, prefix);
    }

    /**
     * Verifica se uma palavra existe na Trie
     * @param {string} word - Palavra a verificar
     * @returns {boolean}
     */
    contains(word) {
        if (!word || typeof word !== 'string') {
            return false;
        }

        let current = this.root;
        
        // Percorre cada caractere da palavra
        for (let char of word) {
            if (!current.children[char]) {
                // Caractere não encontrado
                return false;
            }
            current = current.children[char];
        }
        
        // Verifica se chegou ao fim de uma palavra
        return current.isEndOfWord;
    }

    /**
     * Remove uma palavra da Trie
     * @param {string} word - Palavra a ser removida
     * @returns {boolean} True se removeu, false caso contrário
     */
    remove(word) {
        if (!word || typeof word !== 'string') {
            return false;
        }

        return this._removeHelper(this.root, word, 0);
    }

    /**
     * Método auxiliar para coleta de palavras a partir de um nó
     * @param {TrieNode} node - Nó inicial
     * @param {string} prefix - Prefixo atual
     * @returns {string[]} Array de palavras encontradas
     */
    _collectWords(node, prefix) {
        const words = [];
        
        // Se este nó marca o fim de uma palavra, adiciona ao resultado
        if (node.isEndOfWord) {
            words.push(prefix);
        }
        
        // Recursivamente coleta palavras de todos os filhos
        for (let char in node.children) {
            const childWords = this._collectWords(node.children[char], prefix + char);
            words.push(...childWords);
        }
        
        return words;
    }

    /**
     * Método auxiliar para remoção recursiva
     * @param {TrieNode} node - Nó atual
     * @param {string} word - Palavra a remover
     * @param {number} index - Índice atual na palavra
     * @returns {boolean} True se removeu
     */
    _removeHelper(node, word, index) {
        if (index === word.length) {
            // Chegou ao fim da palavra
            if (!node.isEndOfWord) {
                return false; // Palavra não existe
            }
            node.isEndOfWord = false;
            // Retorna true se o nó não tem filhos (pode ser removido)
            return Object.keys(node.children).length === 0;
        }
        
        const char = word[index];
        const child = node.children[char];
        
        if (!child) {
            return false; // Palavra não existe
        }
        
        // Recursivamente remove do filho
        const shouldDeleteChild = this._removeHelper(child, word, index + 1);
        
        if (shouldDeleteChild) {
            delete node.children[char];
            // Retorna true se o nó atual não tem filhos e não é fim de palavra
            return Object.keys(node.children).length === 0 && !node.isEndOfWord;
        }
        
        return false;
    }
}

/**
 * Classe para representar um nó da Trie
 */
class TrieNode {
    constructor() {
        this.children = {}; // Objeto para armazenar os filhos
        this.isEndOfWord = false; // Marca se este nó é fim de uma palavra
    }
}

export default Trie;

