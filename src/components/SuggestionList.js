import { createElement, highlightMatch } from '../utils/DOMUtils.js';
import { CSS_CLASSES } from '../config/constants.js';

/**
 * SuggestionList
 * 
 * Responsabilidade (Single Responsibility Principle):
 * - Renderizar e gerenciar a lista de sugestões
 * - Gerenciar seleção e destaque de itens
 * - Controlar posicionamento e visibilidade da lista
 * 
 * Interface Segregation Principle:
 * - Interface simples e específica para exibição de sugestões
 */
class SuggestionList {
    /**
     * @param {HTMLElement} containerElement - Elemento container para a lista
     * @param {Object} config - Configurações de estilo e comportamento
     */
    constructor(containerElement, config = {}) {
        this.container = containerElement;
        this.config = config;
        this.listElement = null;
        this.items = [];
        this.selectedIndex = -1;
    }

    /**
     * Cria o elemento da lista no DOM
     */
    create() {
        // Se já existe, não criar novamente
        if (this.listElement) {
            return;
        }
        
        // Criar elemento <ul>
        this.listElement = createElement('ul', [CSS_CLASSES.list]);
        
        // Adicionar ao container
        this.container.appendChild(this.listElement);
        
        // Inicialmente oculto (pode usar hide() ou adicionar classe)
        this.hide();
    }

    /**
     * Renderiza as sugestões
     * @param {string[]} suggestions - Array de sugestões
     * @param {string} query - Texto da busca (para highlight)
     */
    render(suggestions, query) {
        // Verificar se listElement existe, criar se necessário
        if (!this.listElement) {
            this.create();
        }
        
        // Validar sugestões
        if (!Array.isArray(suggestions)) {
            return;
        }
        
        // Limpar itens anteriores
        this.items = [];
        this.selectedIndex = -1;
        
        // Limpar conteúdo do elemento
        this.listElement.innerHTML = '';
        
        // Criar elementos para cada sugestão
        suggestions.forEach((suggestion, index) => {
            // Criar elemento <li>
            const liElement = createElement('li', [CSS_CLASSES.item]);
            
            // Aplicar highlight se query fornecida
            const highlightedText = query && query.trim()
                ? highlightMatch(suggestion, query)
                : suggestion;
            
            // Definir conteúdo
            liElement.innerHTML = highlightedText;
            
            // Adicionar ao DOM
            this.listElement.appendChild(liElement);
            
            // Armazenar referência
            this.items.push(liElement);
        });
    }

    /**
     * Mostra a lista
     */
    show() {
        // Verifica se o elemento existe
        if (!this.listElement) {
            return;
        }
        
        // Remover classe CSS para mostrar
        this.listElement.classList.remove(CSS_CLASSES.hidden);
    }

    /**
     * Esconde a lista
     */
    hide() {
        // Verifica se o elemento existe
        if (!this.listElement) {
            return;
        }
        
        // Adicionar classe CSS para ocultar
        this.listElement.classList.add(CSS_CLASSES.hidden);
    }

    /**
     * Seleciona item por índice
     * @param {number} index
     */
    selectItem(index) {
        // Otimização: se já está selecionado, não fazer nada
        if (this.selectedIndex === index) {
            return; // Já está selecionado
        }
        
        // Validar índice
        if (typeof index !== 'number') {
            return;
        }
        
        // Verificar limites (permite -1 para desselecionar)
        if (index < -1 || index >= this.items.length) {
            return;
        }
        
        // Remover seleção do item anterior (se existir)
        if (this.selectedIndex >= 0 && this.items[this.selectedIndex]) {
            this.items[this.selectedIndex].classList.remove(CSS_CLASSES.itemSelected);
        }
        
        // Adicionar seleção ao novo item (se índice válido)
        if (index >= 0 && this.items[index]) {
            this.items[index].classList.add(CSS_CLASSES.itemSelected);
            // Opcional: scroll para o item
            this.items[index].scrollIntoView({ block: 'nearest' });
        }
        
        // Atualizar índice selecionado
        this.selectedIndex = index;
    }

    /**
     * Move seleção para cima
     */
    selectPrevious() {
        // Se não há itens, não fazer nada
        if (this.items.length === 0) {
            return;
        }
        
        // Se nenhum item está selecionado, selecionar o último
        if (this.selectedIndex === -1) {
            this.selectItem(this.items.length - 1);
            return;
        }
        
        // Calcular índice anterior (comportamento circular)
        // Usa (index - 1 + length) % length para evitar números negativos
        const previousIndex = (this.selectedIndex - 1 + this.items.length) % this.items.length;
        
        // Selecionar item anterior
        this.selectItem(previousIndex);
    }

    /**
     * Move seleção para baixo
     */
    selectNext() {
        // Se não há itens, não fazer nada
        if (this.items.length === 0) {
            return;
        }
        
        // Se nenhum item está selecionado, selecionar o primeiro
        if (this.selectedIndex === -1) {
            this.selectItem(0);
            return;
        }
        
        // Calcular próximo índice (comportamento circular)
        const nextIndex = (this.selectedIndex + 1) % this.items.length;
        
        // Selecionar próximo item
        this.selectItem(nextIndex);
    }

    /**
     * Retorna o item atualmente selecionado
     * @returns {string|null}
     */
    getSelectedItem() {
        // Se nenhum item está selecionado, retornar null
        if (this.selectedIndex === -1 || this.selectedIndex >= this.items.length) {
            return null;
        }
        
        // Obter o elemento selecionado
        const selectedElement = this.items[this.selectedIndex];
        
        // Se o elemento não existe, retornar null
        if (!selectedElement) {
            return null;
        }
        
        // Retornar o texto do item (sem HTML do highlight)
        return selectedElement.textContent || selectedElement.innerText || null;
    }

    /**
     * Limpa a lista
     */
    clear() {
        // Limpar array de itens
        this.items = [];
        
        // Resetar índice selecionado
        this.selectedIndex = -1;
        
        // Limpar conteúdo do elemento (se existir)
        if (this.listElement) {
            this.listElement.innerHTML = '';
        }
    }

    /**
     * Adiciona event listeners nos itens
     * @param {Function} onSelectCallback - Callback quando item é selecionado
     */
    _attachEventListeners(onSelectCallback) {
        // Verificar se callback é uma função
        if (typeof onSelectCallback !== 'function') {
            return;
        }
        
        // Adicionar listener de clique em cada item
        this.items.forEach((item, index) => {
            item.addEventListener('click', () => {
                // Selecionar visualmente o item clicado
                this.selectItem(index);
                
                // Obter o texto do item selecionado
                const selectedText = this.getSelectedItem();
                
                // Chamar callback com o texto selecionado
                if (selectedText) {
                    onSelectCallback(selectedText);
                }
            });
        });
    }

    /**
     * Remove o elemento da lista do DOM
     */
    destroy() {
        // Limpar array de itens
        this.items = [];
        
        // Resetar índice selecionado
        this.selectedIndex = -1;
        
        // Remover elemento do DOM (se existir)
        if (this.listElement && this.listElement.parentNode) {
            this.listElement.parentNode.removeChild(this.listElement);
        }
        
        // Limpar referência
        this.listElement = null;
    }
}

export default SuggestionList;

