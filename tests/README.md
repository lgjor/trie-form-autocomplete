# 🧪 Testes Unitários

Este diretório contém os testes unitários do projeto usando **Vitest**.

## 📋 Estrutura de Testes

```
tests/
├── core/
│   └── Trie.test.js          # Testes da estrutura Trie
├── utils/
│   ├── Validator.test.js     # Testes de validação
│   └── DOMUtils.test.js      # Testes de manipulação DOM
├── services/
│   ├── DataService.test.js   # Testes do serviço de dados
│   └── SearchService.test.js # Testes do serviço de busca
└── components/
    ├── SuggestionList.test.js    # Testes da lista de sugestões
    └── AutocompleteInput.test.js # Testes do componente principal
```

## 🚀 Como Executar

### Instalar dependências
```bash
npm install
```

### Executar todos os testes
```bash
npm test
```

### Executar testes em modo watch
```bash
npm test
# Vitest fica observando mudanças e reexecuta testes automaticamente
```

### Executar com interface gráfica
```bash
npm run test:ui
```

### Executar uma vez (sem watch)
```bash
npm run test:run
```

### Gerar relatório de cobertura
```bash
npm run test:coverage
```

## 📊 Cobertura de Testes

Os testes cobrem:
- ✅ **Core**: Trie (insert, search, contains, remove)
- ✅ **Utils**: Validator, DOMUtils
- ✅ **Services**: DataService, SearchService
- ✅ **Components**: SuggestionList, AutocompleteInput

## 🎯 Estrutura de um Teste

```javascript
import { describe, it, expect, beforeEach } from 'vitest';
import Component from '../../src/component.js';

describe('Component', () => {
    let component;

    beforeEach(() => {
        component = new Component();
    });

    it('deve fazer algo', () => {
        expect(component.method()).toBe(expected);
    });
});
```

## 📝 Convenções

- **describe**: Agrupa testes relacionados
- **it**: Define um teste individual
- **expect**: Asserções sobre valores esperados
- **beforeEach/afterEach**: Setup e cleanup

