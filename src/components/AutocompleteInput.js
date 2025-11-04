import { DEFAULT_CONFIG, CSS_CLASSES } from '../config/constants.js';
import SuggestionList from './SuggestionList.js';
import { createElement, addDebouncedListener, calculateDropdownPosition } from '../utils/DOMUtils.js';

/**
 * AutocompleteInput
 * 
 * Responsabilidade (Single Responsibility Principle):
 * - Gerenciar interação do usuário com o input
 * - Coordenar a comunicação entre UI e serviços
 * - Gerenciar eventos de teclado e foco
 * 
 * Open/Closed Principle:
 * - Aberto para extensão através de configurações e callbacks
 * - Fechado para modificação da lógica core
 */
class AutocompleteInput {
    /**
     * @param {HTMLInputElement} inputElement - Elemento input HTML
     * @param {SearchService} searchService - Serviço de busca
     * @param {Object} config - Configurações do autocomplete
     */
    constructor(inputElement, searchService, config = {}) {
        this.inputElement = inputElement;
        this.searchService = searchService;
        this.config = this._mergeConfig(config);
        this.suggestionList = null;
        this.isActive = false;
    }

    /**
     * Inicializa o componente e configura event listeners
     * Configurar event listeners
     * Criar instância de SuggestionList
     * Configurar debounce para busca
     */
    initialize() {
        // Obter ou criar container para a lista
        let container = this.inputElement.parentElement;
        
        // Se o parent já é um container, usar ele
        // Caso contrário, criar um novo container e mover o input para dentro
        if (!container || !container.classList.contains(CSS_CLASSES.container)) {
            container = createElement('div', [CSS_CLASSES.container]);
            // Inserir container antes do input
            this.inputElement.parentNode.insertBefore(container, this.inputElement);
            // Mover input para dentro do container
            container.appendChild(this.inputElement);
        }
        
        // Criar instância de SuggestionList
        this.suggestionList = new SuggestionList(container, this.config);
        
        // Inicializar lista (cria elemento <ul>)
        this.suggestionList.create();
        
        // Configurar largura do dropdown (o posicionamento é feito pelo CSS)
        const listElement = this.suggestionList.listElement;
        if (listElement) {
            listElement.style.width = `${this.inputElement.offsetWidth}px`;
        }
        
        // Adicionar listener de input com debounce
        this.removeInputListener = addDebouncedListener(
            this.inputElement,
            'input',
            (event) => this._handleInput(event),
            this.config.debounceDelay
        );
        
        // Adicionar listener de keydown para navegação
        this._keydownHandler = (event) => this._handleKeyDown(event);
        this.inputElement.addEventListener('keydown', this._keydownHandler);
        
        // Adicionar listener de blur (se configurado)
        if (this.config.closeOnBlur) {
            this._blurHandler = () => {
                setTimeout(() => this._hideSuggestions(), 200);
            };
            this.inputElement.addEventListener('blur', this._blurHandler);
        }
        
        // Marcar como ativo
        this.isActive = true;
    }

    /**
     * Manipula evento de input
     * @param {Event} event
     */
    _handleInput(event) {
        // Obter valor do input (remover espaços)
        const query = this.inputElement.value.trim();
        
        // Verificar se tem caracteres mínimos
        if (query.length >= this.config.minChars) {
            // Executar busca
            this._performSearch(query);
        } else {
            // Esconder lista se não tiver caracteres suficientes
            this._hideSuggestions();
        }
    }

    /**
     * Manipula eventos de teclado (navegação)
     * @param {KeyboardEvent} event
     */
    _handleKeyDown(event) {
        // Arrow Down: próximo item
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            
            // Verificar se lista existe e tem itens
            if (this.suggestionList && this.suggestionList.items.length > 0) {
                // Mostrar lista se estiver escondida
                if (this.suggestionList.listElement.classList.contains(CSS_CLASSES.hidden)) {
                    this.suggestionList.show();
                }
                
                // Selecionar próximo item
                this.suggestionList.selectNext();
            }
            return;
        }
        
        // Arrow Up: item anterior
        if (event.key === 'ArrowUp') {
            event.preventDefault();
            
            if (this.suggestionList && this.suggestionList.items.length > 0) {
                // Mostrar lista se estiver escondida
                if (this.suggestionList.listElement.classList.contains(CSS_CLASSES.hidden)) {
                    this.suggestionList.show();
                }
                
                // Selecionar item anterior
                this.suggestionList.selectPrevious();
            }
            return;
        }
        
        // Enter: selecionar item atual
        if (event.key === 'Enter') {
            event.preventDefault();
            
            if (this.suggestionList) {
                const selectedText = this.suggestionList.getSelectedItem();
                if (selectedText) {
                    this._selectSuggestion(selectedText);
                }
            }
            return;
        }
        
        // Escape: fechar lista
        if (event.key === 'Escape') {
            event.preventDefault();
            this._hideSuggestions();
            return;
        }
    }

    /**
     * Realiza busca e exibe sugestões
     * @param {string} query - Texto digitado
     */
    _performSearch(query) {
        // Preparar opções de busca baseadas na configuração
        const options = {
            maxResults: this.config.maxResults,
            caseSensitive: this.config.caseSensitive
        };
        
        // Executar busca no SearchService
        const results = this.searchService.search(query, options);
        
        // Exibir resultados
        this._showSuggestions(results);
    }

    /**
     * Mostra as sugestões
     * @param {string[]} suggestions
     */
    _showSuggestions(suggestions) {
        // Verificar se suggestionList existe
        if (!this.suggestionList) {
            return;
        }
        
        // Obter query atual para highlight
        const query = this.inputElement.value.trim();
        
        // Renderizar sugestões
        this.suggestionList.render(suggestions, query);
        
        // Adicionar event listeners nos itens
        this.suggestionList._attachEventListeners((selectedText) => {
            this._selectSuggestion(selectedText);
        });
        
        // Atualizar largura do dropdown (o posicionamento é feito pelo CSS)
        const listElement = this.suggestionList.listElement;
        if (listElement) {
            listElement.style.width = `${this.inputElement.offsetWidth}px`;
        }
        
        // Mostrar lista
        this.suggestionList.show();
        
        // Auto-focar primeiro item (se configurado)
        if (this.config.autoFocus && suggestions.length > 0) {
            this.suggestionList.selectItem(0);
        }
    }

    /**
     * Esconde as sugestões
     */
    _hideSuggestions() {
        // Verificar se suggestionList existe
        if (!this.suggestionList) {
            return;
        }
        
        // Esconder lista
        this.suggestionList.hide();
    }

    /**
     * Seleciona uma sugestão
     * @param {string} suggestion
     */
    _selectSuggestion(suggestion) {
        // Validar sugestão
        if (!suggestion || typeof suggestion !== 'string') {
            return;
        }
        
        // Atualizar valor do input
        this.inputElement.value = suggestion;
        
        // Esconder lista (se configurado)
        if (this.config.closeOnSelect) {
            this._hideSuggestions();
        }
        
        // Disparar evento customizado (opcional)
        this.inputElement.dispatchEvent(new CustomEvent('autocomplete:select', {
            detail: { value: suggestion },
            bubbles: true
        }));
    }

    /**
     * Mescla configurações padrão com fornecidas
     * @param {Object} userConfig
     * @returns {Object}
     */
    _mergeConfig(userConfig = {}) {
        // Mesclar configurações padrão com as fornecidas
        // As configurações do usuário sobrescrevem as padrão
        return { ...DEFAULT_CONFIG, ...userConfig };
    }

    /**
     * Remove event listeners e limpa recursos
     */
    destroy() {
        // Remover listener de input (debounce)
        if (this.removeInputListener) {
            this.removeInputListener();
            this.removeInputListener = null;
        }
        
        // Remover listener de keydown
        if (this._keydownHandler) {
            this.inputElement.removeEventListener('keydown', this._keydownHandler);
            this._keydownHandler = null;
        }
        
        // Remover listener de blur (se existe)
        if (this._blurHandler) {
            this.inputElement.removeEventListener('blur', this._blurHandler);
            this._blurHandler = null;
        }
        
        // Destruir SuggestionList
        if (this.suggestionList) {
            this.suggestionList.destroy();
            this.suggestionList = null;
        }
        
        // Marcar como inativo
        this.isActive = false;
    }
}

export default AutocompleteInput;

