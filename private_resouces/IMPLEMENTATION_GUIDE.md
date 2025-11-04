# 🚀 Guia de Implementação

Este guia fornece orientações sobre como começar a implementar os algoritmos e funcionalidades do projeto, seguindo a arquitetura já estabelecida.

## 📋 Ordem Sugerida de Implementação

### Fase 1: Core - Estrutura de Dados Trie

**Arquivo**: `src/core/Trie.js`

**Por onde começar**:
1. Definir a estrutura do nó da Trie
2. Implementar o construtor e inicialização
3. Implementar método `insert()`
4. Implementar método `contains()`
5. Implementar método `searchByPrefix()`
6. Implementar método `remove()` (opcional, mais complexo)

**Exemplo de estrutura de nó**:
```javascript
class TrieNode {
    constructor() {
        this.children = {}; // ou Map()
        this.isEndOfWord = false;
        this.value = null; // opcional: para armazenar dados associados
    }
}
```

**Dicas**:
- Comece com inserção e busca simples
- Teste cada método isoladamente antes de prosseguir
- Considere normalização (toLowerCase) para case-insensitive
- Pense em como percorrer a árvore para buscar todas as palavras com um prefixo

### Fase 2: Services - Gerenciamento de Dados

**Arquivo**: `src/services/DataService.js`

**Por onde começar**:
[x] 1. Implementar `loadFromArray()` (mais simples)
[x] 2. Implementar `getData()`
[x] 3. Implementar `addData()`
[x] 4. Implementar `loadFromAPI()` (usar fetch)
[x] 5. Implementar `loadFromFile()` (se necessário)

**Exemplo básico**:
```javascript
loadFromArray(dataArray) {
    if (!Array.isArray(dataArray)) {
        throw new Error('Data must be an array');
    }
    this.data = [...dataArray];
    return this.data;
}
```

### Fase 3: Services - Serviço de Busca

**Arquivo**: `src/services/SearchService.js`

**Por onde começar**:
[x] 1. Implementar `indexData()` - popular a Trie
[x] 2. Implementar `search()` básico
[x] 3. Adicionar opções (limite de resultados)
[x] 4. Implementar cache (opcional)
[x] 5. Implementar filtros customizados

**Exemplo de indexação**:
```javascript
indexData(data) {
    data.forEach(item => {
        this.trie.insert(item);
    });
}
```

### Fase 4: Utils - Funções Auxiliares

**Arquivos**: `src/utils/DOMUtils.js` e `src/utils/Validator.js`

**DOMUtils - Prioridade**:
[x] 1. `createElement()` - criar elementos HTML
[x] 2. `removeAllChildren()` - limpar elementos
[x] 3. `highlightMatch()` - destacar texto
[x] 4. `addDebouncedListener()` - debounce

    ```java
            // Exemplo de uso
            // Adicionar listener com debounce
            const removeListener = addDebouncedListener(
            inputElement,
            'input',
            (event) => {
                console.log('Busca:', event.target.value);
            },
            300
        );
    // Mais tarde, remover o listener
    removeListener();
    ```
    
[x] 5. `calculateDropdownPosition()` - posicionamento

    ```java
    // Exemplo de uso calculateDropdownPosition()
    // Calcular posição do dropdown
    const position = calculateDropdownPosition(inputElement);

    // Aplicar posição ao dropdown
    dropdownElement.style.position = 'absolute';
    dropdownElement.style.top = `${position.top}px`;
    dropdownElement.style.left = `${position.left}px`;
    dropdownElement.style.width = `${position.width}px`;
    ```

**Validator - Prioridade**:
[x] 1. `isValidString()`
[x] 2. `isValidArray()`
[x] 3. `normalizeString()` - importante para busca
[x] 4. `validateConfig()`

### Fase 5: Components - Lista de Sugestões

**Arquivo**: `src/components/SuggestionList.js`

**Por onde começar**:
[x] 1. Implementar `create()` - criar elemento UL

```java
    // Exemplo de uso
    suggestionList.render(['Apple', 'Application', 'App'], 'app');
    // Cria 3 itens <li> com highlight em "app"
```

[x] 2. Implementar `render()` - renderizar itens
[x] 3. Implementar `show()` e `hide()`
[x] 4. Implementar navegação (`selectNext()`, `selectPrevious()`)
[x] 5. Implementar `getSelectedItem()`
6. Adicionar event listeners para clique

**Estrutura HTML sugerida**:
```html
<ul class="autocomplete-list">
    <li class="autocomplete-item">Sugestão 1</li>
    <li class="autocomplete-item autocomplete-item--selected">Sugestão 2</li>
    <li class="autocomplete-item">Sugestão 3</li>
</ul>
```

### Fase 6: Components - Input Principal

**Arquivo**: `src/components/AutocompleteInput.js`

**Por onde começar**:
1. Implementar `_mergeConfig()` - mesclar configurações
2. Implementar `initialize()` - setup inicial
3. Implementar `_handleInput()` - evento de digitação
4. Implementar `_performSearch()` - executar busca
5. Implementar `_showSuggestions()`
6. Implementar `_handleKeyDown()` - navegação por teclado
7. Implementar `_selectSuggestion()`
8. Implementar `destroy()` - cleanup

**Eventos de teclado importantes**:
- **Arrow Down**: próximo item
- **Arrow Up**: item anterior
- **Enter**: selecionar item atual
- **Escape**: fechar lista

### Fase 7: Main - Integração

**Arquivo**: `src/main.js`

**Por onde começar**:
1. Implementar função `createAutocomplete()`
2. Conectar todos os componentes
3. Fazer injeção de dependências
4. Implementar `initializeAll()` (múltiplos inputs)
5. Testar integração completa

**Exemplo de composição**:
```javascript
function createAutocomplete(inputSelector, options = {}) {
    // 1. Obter elemento
    const inputElement = typeof inputSelector === 'string'
        ? document.querySelector(inputSelector)
        : inputSelector;
    
    // 2. Criar instâncias
    const trie = new Trie();
    const dataService = new DataService();
    const searchService = new SearchService(trie);
    
    // 3. Carregar dados
    if (options.data) {
        dataService.loadFromArray(options.data);
        searchService.indexData(dataService.getData());
    }
    
    // 4. Criar e inicializar componente
    const autocomplete = new AutocompleteInput(
        inputElement,
        searchService,
        options
    );
    autocomplete.initialize();
    
    return autocomplete;
}
```

## 🧪 Estratégia de Testes

### Testar à Medida que Implementa

**Fase 1 - Trie**:
```javascript
// Teste manual no console do navegador
const trie = new Trie();
trie.insert('apple');
trie.insert('app');
trie.insert('application');
console.log(trie.searchByPrefix('app')); // ['app', 'apple', 'application']
```

**Fase 2-3 - Services**:
```javascript
const dataService = new DataService();
dataService.loadFromArray(['test1', 'test2']);
console.log(dataService.getData()); // ['test1', 'test2']

const searchService = new SearchService(trie);
searchService.indexData(['apple', 'app']);
console.log(searchService.search('ap')); // ['app', 'apple']
```

**Fase 4-7 - Integração**:
- Abra `public/index.html` no navegador
- Use o console para debug
- Teste interações reais

## 💡 Dicas Importantes

### 1. Normalização de Strings
Para busca case-insensitive e sem acentos:
```javascript
function normalizeString(str) {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}
```

### 2. Debounce Simples
```javascript
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}
```

### 3. Highlight de Texto
```javascript
function highlightMatch(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="autocomplete-highlight">$1</span>');
}
```

### 4. Posicionamento do Dropdown
```javascript
function calculateDropdownPosition(inputElement) {
    const rect = inputElement.getBoundingClientRect();
    return {
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
    };
}
```

## 🐛 Problemas Comuns e Soluções

### Problema 1: Módulos ES6 não funcionam
**Solução**: Use um servidor HTTP local
```bash
npm run dev
# ou
python -m http.server 8080
```

### Problema 2: CORS ao carregar dados
**Solução**: Use servidor local ou configure headers CORS

### Problema 3: Lista não fecha ao clicar fora
**Solução**: Adicione listener de `blur` com pequeno delay:
```javascript
input.addEventListener('blur', () => {
    setTimeout(() => this._hideSuggestions(), 200);
});
```

### Problema 4: Trie consome muita memória
**Solução**: 
- Limite número de palavras
- Implemente compressão de nós
- Use Map() ao invés de objeto para children

## 📈 Otimizações Futuras

### Performance
1. **Lazy Loading**: Carregar dados sob demanda
2. **Virtual Scrolling**: Renderizar apenas itens visíveis
3. **Web Workers**: Processar busca em background thread
4. **Memoização**: Cache de resultados de busca

### Funcionalidades
1. **Busca Fuzzy**: Tolerar erros de digitação
2. **Pesos/Ranking**: Ordenar por relevância
3. **Categorias**: Agrupar sugestões
4. **Imagens**: Suporte a ícones/imagens nos resultados
5. **Teclado**: Suporte completo a acessibilidade (ARIA)

### Estrutura de Dados Alternativas
1. **Ternary Search Tree**: Menos memória que Trie
2. **Suffix Tree**: Para busca em qualquer posição
3. **Inverted Index**: Para busca em múltiplos campos

## 📚 Recursos Úteis

### Algoritmos
- [Trie Data Structure - Wikipedia](https://en.wikipedia.org/wiki/Trie)
- [Trie Implementation Guide](https://www.geeksforgeeks.org/trie-insert-and-search/)

### JavaScript
- [MDN - Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [MDN - Classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)

### Patterns
- [JavaScript Design Patterns](https://www.patterns.dev/)
- [SOLID Principles in JavaScript](https://khalilstemmler.com/articles/solid-principles/solid-javascript/)

## ✅ Checklist de Implementação

### Core
- [ ] Estrutura do TrieNode
- [ ] Método insert()
- [ ] Método contains()
- [ ] Método searchByPrefix()
- [ ] Método remove()

### Services
- [ ] DataService.loadFromArray()
- [ ] DataService.loadFromAPI()
- [ ] SearchService.indexData()
- [ ] SearchService.search()
- [ ] Cache de buscas

### Utils
- [ ] createElement()
- [ ] highlightMatch()
- [ ] Debounce
- [ ] Validators

### Components
- [ ] SuggestionList.render()
- [ ] SuggestionList navegação
- [ ] AutocompleteInput eventos
- [ ] AutocompleteInput teclado

### Integration
- [ ] Factory createAutocomplete()
- [ ] Injeção de dependências
- [ ] Teste completo end-to-end

### Polish
- [ ] Tratamento de erros
- [ ] Acessibilidade (ARIA)
- [ ] Documentação JSDoc
- [ ] Exemplos funcionais

## 🎯 Começar Agora

**Passo 1**: Abra `src/core/Trie.js` e implemente a estrutura básica

**Passo 2**: Teste a Trie isoladamente no console

**Passo 3**: Avance para os services

**Passo 4**: Implemente os componentes UI

**Passo 5**: Integre tudo no `main.js`

**Passo 6**: Teste no `public/index.html`

Boa sorte com a implementação! 🚀

