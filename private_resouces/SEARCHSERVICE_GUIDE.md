# 🔍 Guia do SearchService

O `SearchService` é responsável por coordenar operações de busca, aplicando filtros, ordenação e cache. Ele atua como uma camada de abstração entre a Trie e os componentes de interface.

## 🎯 Funcionalidades Principais

### ✅ **Busca Inteligente**
- **Busca por prefixo**: `search(prefix, options)`
- **Busca múltipla**: `searchMultiple(prefixes, options)`
- **Busca fuzzy**: `searchFuzzy(query, options)` - tolerante a erros
- **Cache automático**: Melhora performance em buscas repetidas

### ✅ **Filtros e Ordenação**
- **Filtros customizados**: Funções de filtro personalizadas
- **Ordenação**: Ascendente/descendente, case-sensitive/insensitive
- **Limite de resultados**: Controle do número de sugestões

### ✅ **Performance e Estatísticas**
- **Cache LRU**: Cache com limite de tamanho
- **Estatísticas**: Métricas de performance e uso
- **Otimizações**: Busca eficiente com Trie

## 🚀 Exemplos de Uso

### **Exemplo 1: Busca Básica**
```javascript
import Trie from './src/core/Trie.js';
import SearchService from './src/services/SearchService.js';

const trie = new Trie();
const searchService = new SearchService(trie);

// Indexar dados
searchService.indexData(['apple', 'app', 'application', 'apply']);

// Busca simples
const results = searchService.search('app');
console.log(results); // ['app', 'apple', 'application', 'apply']
```

### **Exemplo 2: Busca com Opções**
```javascript
// Busca com configurações avançadas
const results = searchService.search('app', {
    maxResults: 5,           // Máximo 5 resultados
    sortOrder: 'desc',       // Ordem descendente
    caseSensitive: false,    // Case-insensitive
    useCache: true          // Usar cache
});

console.log(results); // ['apply', 'application', 'apple', 'app']
```

### **Exemplo 3: Busca com Filtros**
```javascript
// Busca com filtro customizado
const results = searchService.search('a', {
    filterFn: (word) => word.length >= 4  // Apenas palavras com 4+ caracteres
});

console.log(results); // ['apple', 'application', 'apply']
```

### **Exemplo 4: Busca Fuzzy**
```javascript
// Busca tolerante a erros
const results = searchService.searchFuzzy('aplle', {
    maxDistance: 2,  // Tolerar até 2 erros
    maxResults: 5
});

console.log(results); // ['apple', 'apply'] - encontra mesmo com erro de digitação
```

### **Exemplo 5: Busca Múltipla**
```javascript
// Busca com múltiplos prefixos
const results = searchService.searchMultiple(['app', 'book'], {
    maxResults: 10
});

console.log(results); // ['app', 'apple', 'book', 'books', ...]
```

## ⚙️ Configurações

### **Configuração do Construtor**
```javascript
const searchService = new SearchService(trie, {
    cacheEnabled: true,        // Habilitar cache
    maxCacheSize: 100,         // Tamanho máximo do cache
    defaultMaxResults: 10,     // Resultados padrão
    defaultSortOrder: 'asc'    // Ordem padrão
});
```

### **Opções de Busca**
```javascript
const options = {
    maxResults: 10,                    // Número máximo de resultados
    sortOrder: 'asc' | 'desc',         // Ordem de classificação
    caseSensitive: true | false,       // Case-sensitive
    filterFn: (word) => boolean,       // Função de filtro
    useCache: true | false             // Usar cache
};
```

## 📊 Cache e Performance

### **Como Funciona o Cache**
```javascript
// Primeira busca - cache miss
const start1 = performance.now();
searchService.search('app');
const end1 = performance.now();

// Segunda busca - cache hit (muito mais rápida)
const start2 = performance.now();
searchService.search('app');
const end2 = performance.now();

console.log(`1ª busca: ${end1 - start1}ms`);
console.log(`2ª busca: ${end2 - start2}ms`);
```

### **Estatísticas**
```javascript
const stats = searchService.getStats();
console.log(stats);
// {
//   totalSearches: 15,
//   cacheHits: 8,
//   cacheMisses: 7,
//   cacheSize: 8,
//   cacheHitRate: '53.33%'
// }
```

### **Gerenciamento do Cache**
```javascript
// Limpar cache
searchService.clearCache();

// Verificar tamanho
const stats = searchService.getStats();
console.log(`Cache size: ${stats.cacheSize}`);
```

## 🔧 Métodos Disponíveis

### **Métodos Principais**

#### `search(prefix, options)`
- **Propósito**: Busca por prefixo com opções
- **Retorno**: `string[]`
- **Cache**: Sim (se habilitado)

#### `searchMultiple(prefixes, options)`
- **Propósito**: Busca com múltiplos prefixos (OR)
- **Retorno**: `string[]` (resultados únicos)
- **Cache**: Sim (para cada prefixo)

#### `searchFuzzy(query, options)`
- **Propósito**: Busca tolerante a erros
- **Retorno**: `string[]`
- **Algoritmo**: Distância de Levenshtein

#### `indexData(data)`
- **Propósito**: Indexar dados na Trie
- **Retorno**: `void`
- **Efeito**: Limpa cache automaticamente

### **Métodos Auxiliares**

#### `applyFilter(results, filterFn)`
- **Propósito**: Aplicar filtro a resultados existentes
- **Retorno**: `string[]`

#### `clearCache()`
- **Propósito**: Limpar cache de buscas
- **Retorno**: `void`

#### `getStats()`
- **Propósito**: Obter estatísticas do serviço
- **Retorno**: `Object`

## 🎮 Demo Interativa

Acesse `examples/search-service-example.html` para uma demonstração completa que inclui:

- ✅ **Busca básica** com diferentes configurações
- ✅ **Busca com filtros** customizados
- ✅ **Busca fuzzy** tolerante a erros
- ✅ **Busca múltipla** com vários prefixos
- ✅ **Teste de cache** e estatísticas
- ✅ **Interface visual** com controles

## 🔍 Algoritmos Implementados

### **1. Busca por Prefixo**
```javascript
// Complexidade: O(p + n) onde p = tamanho do prefixo, n = número de resultados
search(prefix) {
    // 1. Navegar até o nó do prefixo na Trie
    // 2. Coletar todas as palavras a partir desse nó
    // 3. Aplicar filtros e ordenação
    // 4. Retornar resultados limitados
}
```

### **2. Busca Fuzzy (Levenshtein)**
```javascript
// Complexidade: O(m * n) onde m,n = tamanhos das strings
_levenshteinDistance(str1, str2) {
    // Algoritmo de programação dinâmica
    // Calcula distância mínima entre duas strings
    // Usado para busca tolerante a erros
}
```

### **3. Cache LRU**
```javascript
// Complexidade: O(1) para inserção e busca
_addToCache(key, results) {
    // 1. Verificar limite de tamanho
    // 2. Remover item mais antigo se necessário (FIFO)
    // 3. Adicionar novo item
}
```

## 📈 Otimizações de Performance

### **Cache Inteligente**
- ✅ **Chave única**: Baseada em prefixo + opções
- ✅ **Limite de tamanho**: Evita uso excessivo de memória
- ✅ **FIFO**: Remove itens mais antigos primeiro
- ✅ **Estatísticas**: Monitora eficiência

### **Busca Eficiente**
- ✅ **Trie otimizada**: O(p + n) para busca por prefixo
- ✅ **Filtros aplicados**: Reduz resultados desnecessários
- ✅ **Ordenação local**: Usa `localeCompare` para português
- ✅ **Limite de resultados**: Evita processamento excessivo

### **Busca Fuzzy Otimizada**
- ✅ **Busca exata primeiro**: Tenta busca normal antes do fuzzy
- ✅ **Distância limitada**: Evita cálculos desnecessários
- ✅ **Algoritmo DP**: Levenshtein otimizado

## 🔗 Integração com Outros Componentes

### **Com DataService**
```javascript
import DataService from './src/services/DataService.js';
import SearchService from './src/services/SearchService.js';
import Trie from './src/core/Trie.js';

// Carregar dados
const dataService = new DataService();
await dataService.loadFromFile('./data/countries.json');

// Indexar na Trie
const trie = new Trie();
const searchService = new SearchService(trie);
searchService.indexData(dataService.getData());

// Buscar
const results = searchService.search('bra');
```

### **Com AutocompleteInput**
```javascript
// No main.js
const searchService = new SearchService(trie);
const autocomplete = new AutocompleteInput(
    inputElement,
    searchService,
    {
        minChars: 2,
        maxResults: 10
    }
);
```

## 🐛 Tratamento de Erros

### **Validação de Entrada**
```javascript
// Prefixo inválido
searchService.search('');        // Retorna []
searchService.search(null);      // Retorna []

// Opções inválidas
searchService.search('test', {
    maxResults: -1               // Usa valor padrão
});
```

### **Filtros Inválidos**
```javascript
try {
    searchService.applyFilter(results, 'not a function');
} catch (error) {
    console.error(error.message); // "SearchService: applyFilter espera uma função"
}
```

## 📝 Casos de Uso Práticos

### **1. Autocomplete de Países**
```javascript
// Carregar países
await dataService.loadFromFile('./data/countries.json');
searchService.indexData(dataService.getData());

// Buscar país
const countries = searchService.search('bra', {
    maxResults: 5,
    sortOrder: 'asc'
});
// Resultado: ['Brasil', 'Brasília']
```

### **2. Busca com Correção Ortográfica**
```javascript
// Usuário digita com erro
const results = searchService.searchFuzzy('sao paulo', {
    maxDistance: 2
});
// Encontra: ['São Paulo'] mesmo com erro de acentuação
```

### **3. Filtro por Categoria**
```javascript
// Buscar apenas cidades grandes
const cities = searchService.search('sao', {
    filterFn: (city) => city.length > 8
});
// Resultado: ['São Paulo', 'São Bernardo do Campo']
```

## 🎯 Próximos Passos

1. **Teste o SearchService**: Use `examples/search-service-example.html`
2. **Integre com DataService**: Carregue dados reais
3. **Implemente AutocompleteInput**: Interface de usuário
4. **Adicione mais filtros**: Por categoria, popularidade, etc.

## ✅ Benefícios da Implementação

### **Princípios SOLID**
- **SRP**: Responsabilidade única (coordenação de busca)
- **OCP**: Extensível via filtros e opções
- **DIP**: Depende da abstração Trie

### **Performance**
- Cache inteligente com estatísticas
- Busca otimizada com Trie
- Filtros aplicados eficientemente

### **Flexibilidade**
- Múltiplos tipos de busca
- Configurações personalizáveis
- Filtros customizados

### **Manutenibilidade**
- Código bem documentado
- Tratamento de erros robusto
- API consistente e intuitiva

---

**🎮 Teste agora**: Abra `examples/search-service-example.html` no navegador!
