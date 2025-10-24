# 📊 Guia do DataService

O `DataService` é responsável por gerenciar o carregamento de dados de diferentes fontes, seguindo o princípio de **Single Responsibility** e **Dependency Inversion**.

## 🎯 Funcionalidades Principais

### ✅ **Carregamento de Dados**
- **Array estático**: `loadFromArray()`
- **Arquivo JSON local**: `loadFromFile()`
- **API externa**: `loadFromAPI()`

### ✅ **Manipulação de Dados**
- **Adicionar dados**: `addData()`
- **Remover duplicatas**: `removeDuplicates()`
- **Ordenar**: `sort()`
- **Filtrar**: `filter()`
- **Limpar**: `clear()`

### ✅ **Informações**
- **Obter dados**: `getData()`
- **Metadados**: `getMetadata()`
- **Contagem**: `getCount()`
- **Verificar se tem dados**: `hasData()`

## 📁 Estrutura de Arquivos JSON Suportados

### **1. Array Simples**
```json
[
  "Item 1",
  "Item 2",
  "Item 3"
]
```

### **2. Objeto com Array**
```json
{
  "data": [
    "Item 1",
    "Item 2",
    "Item 3"
  ]
}
```

### **3. Estrutura Complexa (Categorias)**
```json
{
  "categories": {
    "fruits": {
      "name": "Frutas",
      "data": ["Maçã", "Banana", "Laranja"]
    },
    "countries": {
      "name": "Países",
      "data": ["Brasil", "Argentina", "Chile"]
    }
  }
}
```

## 🚀 Exemplos de Uso

### **Exemplo 1: Array Estático**
```javascript
import DataService from './src/services/DataService.js';

const dataService = new DataService();

// Carregar array
dataService.loadFromArray(['Maçã', 'Banana', 'Laranja']);

// Obter dados
const fruits = dataService.getData();
console.log(fruits); // ['Maçã', 'Banana', 'Laranja']
```

### **Exemplo 2: Arquivo JSON Local**
```javascript
// Carregar arquivo
await dataService.loadFromFile('./data/countries.json');

// Verificar se carregou
if (dataService.hasData()) {
    const countries = dataService.getData();
    console.log(`Carregados ${dataService.getCount()} países`);
}
```

### **Exemplo 3: API Externa**
```javascript
try {
    await dataService.loadFromAPI('https://api.exemplo.com/dados');
    const data = dataService.getData();
} catch (error) {
    console.error('Erro ao carregar da API:', error.message);
}
```

### **Exemplo 4: Method Chaining**
```javascript
// Encadeamento de métodos
await dataService
    .loadFromFile('./data/fruits.json')
    .removeDuplicates()
    .sort(false)  // case-insensitive
    .filter(item => item.length > 3);

console.log(dataService.getData());
```

### **Exemplo 5: Metadados**
```javascript
await dataService.loadFromFile('./data/countries.json');
const metadata = dataService.getMetadata();

console.log(metadata);
// {
//   source: "file:./data/countries.json",
//   loadedAt: "2024-01-15T10:30:00.000Z",
//   count: 195
// }
```

## 🔧 Configuração no Projeto

### **Estrutura de Pastas**
```
trie-form-autocomplete/
├── data/                     # 📊 Dados JSON
│   ├── countries.json       # Lista de países
│   ├── cities.json          # Lista de cidades
│   ├── fruits.json          # Lista de frutas
│   └── sample-data.json     # Dados complexos
├── src/
│   └── services/
│       └── DataService.js   # Implementação
└── examples/
    └── data-service-example.html  # Demo interativa
```

### **Arquivos JSON Criados**

#### **countries.json** (195 países)
```json
[
  "Brasil", "Argentina", "Chile", "Uruguai", "Paraguai", 
  "Bolívia", "Peru", "Equador", "Colômbia", "Venezuela",
  ...
]
```

#### **cities.json** (100+ cidades brasileiras)
```json
[
  "São Paulo", "Rio de Janeiro", "Brasília", "Salvador", 
  "Fortaleza", "Belo Horizonte", "Manaus", "Curitiba",
  ...
]
```

#### **fruits.json** (100+ frutas)
```json
[
  "Maçã", "Banana", "Laranja", "Uva", "Morango", 
  "Abacaxi", "Manga", "Pêra", "Pêssego", "Kiwi",
  ...
]
```

#### **sample-data.json** (Estrutura complexa)
```json
{
  "description": "Dados de exemplo para demonstração",
  "categories": {
    "countries": {
      "name": "Países",
      "data": ["Brasil", "Argentina", "Chile"]
    },
    "fruits": {
      "name": "Frutas", 
      "data": ["Maçã", "Banana", "Laranja"]
    }
  }
}
```

## 🎮 Demo Interativa

Acesse `examples/data-service-example.html` para uma demonstração interativa que inclui:

- ✅ Carregamento de arrays
- ✅ Carregamento de arquivos JSON
- ✅ Carregamento de APIs (com tratamento de CORS)
- ✅ Operações de manipulação
- ✅ Visualização de metadados
- ✅ Tratamento de erros

## 🔍 Tratamento de Erros

O DataService inclui tratamento robusto de erros:

```javascript
try {
    await dataService.loadFromFile('./data/inexistente.json');
} catch (error) {
    console.error(error.message);
    // "DataService: Erro ao carregar arquivo - HTTP 404: Not Found"
}
```

### **Tipos de Erro**
- **Validação**: Dados inválidos fornecidos
- **Rede**: Falha ao carregar arquivo/API
- **Formato**: JSON malformado ou estrutura não suportada
- **HTTP**: Status de erro (404, 500, etc.)

## ⚡ Performance

### **Otimizações Implementadas**
- ✅ **Filtragem automática**: Remove strings vazias
- ✅ **Normalização**: Trim automático de espaços
- ✅ **Imutabilidade**: `getData()` retorna cópia
- ✅ **Method chaining**: Operações eficientes
- ✅ **Validação**: Verificação de tipos

### **Limitações**
- ⚠️ **CORS**: APIs externas podem ser bloqueadas
- ⚠️ **Tamanho**: Arquivos muito grandes podem ser lentos
- ⚠️ **Rede**: Depende de conectividade para APIs

## 🔗 Integração com Outros Componentes

### **Com SearchService**
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
```

### **Com AutocompleteInput**
```javascript
// No main.js
const dataService = new DataService();
await dataService.loadFromFile('./data/countries.json');

const autocomplete = new AutocompleteInput(
    inputElement,
    searchService,
    {
        data: dataService.getData(),
        minChars: 2,
        maxResults: 10
    }
);
```

## 📝 Próximos Passos

1. **Teste o DataService**: Use o exemplo interativo
2. **Carregue seus dados**: Adicione seus próprios arquivos JSON
3. **Integre com Trie**: Conecte com SearchService
4. **Implemente autocomplete**: Use no AutocompleteInput

## 🎯 Benefícios da Implementação

### ✅ **Princípios SOLID**
- **SRP**: Uma responsabilidade (gerenciar dados)
- **OCP**: Extensível para novas fontes
- **DIP**: Abstração para outros componentes

### ✅ **Robustez**
- Tratamento de erros completo
- Validação de entrada
- Suporte a múltiplos formatos

### ✅ **Flexibilidade**
- Múltiplas fontes de dados
- Method chaining
- Operações de manipulação

### ✅ **Manutenibilidade**
- Código bem documentado
- Testes fáceis de implementar
- API consistente

---

**🎮 Teste agora**: Abra `examples/data-service-example.html` no navegador!

