/**
 * DataService
 * 
 * Responsabilidade (Single Responsibility Principle):
 * - Gerenciar carregamento de dados de diferentes fontes
 * - Abstrair a origem dos dados (API, arquivo local, array estático)
 * 
 * Dependency Inversion Principle:
 * - Outros componentes dependem desta abstração, não da implementação específica
 */
class DataService {
    constructor() {
        this.data = [];
        this.metadata = {
            source: null,
            loadedAt: null,
            count: 0
        };
    }

    /**
     * Carrega dados de um array
     * @param {string[]} dataArray - Array de strings
     * @returns {DataService} - Retorna this para method chaining
     */
    loadFromArray(dataArray) {
        if (!Array.isArray(dataArray)) {
            throw new Error('DataService: loadFromArray espera um array');
        }

        // Filtra apenas strings não vazias
        this.data = dataArray
            .filter(item => typeof item === 'string' && item.trim().length > 0)
            .map(item => item.trim());

        this.metadata = {
            source: 'array',
            loadedAt: new Date(),
            count: this.data.length
        };

        return this;
    }

    /**
     * Carrega dados de uma URL (API)
     * @param {string} url - URL da API
     * @returns {Promise<DataService>}
     */
    async loadFromAPI(url) {
        if (!url || typeof url !== 'string') {
            throw new Error('DataService: URL inválida fornecida');
        }

        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const jsonData = await response.json();
            
            // Se a resposta é um array direto
            if (Array.isArray(jsonData)) {
                this.data = jsonData
                    .filter(item => typeof item === 'string' && item.trim().length > 0)
                    .map(item => item.trim());
            }
            // Se a resposta tem estrutura { data: [...] }
            else if (jsonData.data && Array.isArray(jsonData.data)) {
                this.data = jsonData.data
                    .filter(item => typeof item === 'string' && item.trim().length > 0)
                    .map(item => item.trim());
            }
            // Se a resposta tem estrutura { items: [...] }
            else if (jsonData.items && Array.isArray(jsonData.items)) {
                this.data = jsonData.items
                    .filter(item => typeof item === 'string' && item.trim().length > 0)
                    .map(item => item.trim());
            }
            else {
                throw new Error('DataService: Formato de resposta da API não suportado');
            }

            this.metadata = {
                source: `api:${url}`,
                loadedAt: new Date(),
                count: this.data.length
            };

            return this;
        } catch (error) {
            throw new Error(`DataService: Erro ao carregar da API - ${error.message}`);
        }
    }

    /**
     * Carrega dados de um arquivo JSON local
     * @param {string} filePath - Caminho do arquivo
     * @returns {Promise<DataService>}
     */
    async loadFromFile(filePath) {
        if (!filePath || typeof filePath !== 'string') {
            throw new Error('DataService: Caminho do arquivo inválido');
        }

        try {
            const response = await fetch(filePath);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const jsonData = await response.json();
            
            // Se o arquivo é um array direto
            if (Array.isArray(jsonData)) {
                this.data = jsonData
                    .filter(item => typeof item === 'string' && item.trim().length > 0)
                    .map(item => item.trim());
            }
            // Se o arquivo tem estrutura { data: [...] }
            else if (jsonData.data && Array.isArray(jsonData.data)) {
                this.data = jsonData.data
                    .filter(item => typeof item === 'string' && item.trim().length > 0)
                    .map(item => item.trim());
            }
            // Se o arquivo tem estrutura complexa com categorias
            else if (jsonData.categories) {
                // Carrega todas as categorias em um array único
                this.data = [];
                Object.values(jsonData.categories).forEach(category => {
                    if (category.data && Array.isArray(category.data)) {
                        this.data.push(...category.data
                            .filter(item => typeof item === 'string' && item.trim().length > 0)
                            .map(item => item.trim()));
                    }
                });
            }
            else {
                throw new Error('DataService: Formato do arquivo JSON não suportado');
            }

            this.metadata = {
                source: `file:${filePath}`,
                loadedAt: new Date(),
                count: this.data.length
            };

            return this;
        } catch (error) {
            throw new Error(`DataService: Erro ao carregar arquivo - ${error.message}`);
        }
    }

    /**
     * Retorna todos os dados carregados
     * @returns {string[]}
     */
    getData() {
        return [...this.data]; // Retorna cópia para evitar mutação externa
    }

    /**
     * Adiciona novos dados aos existentes
     * @param {string[]} newData - Novos dados a adicionar
     * @returns {DataService} - Retorna this para method chaining
     */
    addData(newData) {
        if (!Array.isArray(newData)) {
            throw new Error('DataService: addData espera um array');
        }

        const validNewData = newData
            .filter(item => typeof item === 'string' && item.trim().length > 0)
            .map(item => item.trim());

        this.data.push(...validNewData);
        this.metadata.count = this.data.length;
        this.metadata.loadedAt = new Date();

        return this;
    }

    /**
     * Remove dados duplicados
     * @returns {DataService} - Retorna this para method chaining
     */
    removeDuplicates() {
        this.data = [...new Set(this.data)];
        this.metadata.count = this.data.length;
        return this;
    }

    /**
     * Ordena os dados alfabeticamente
     * @param {boolean} caseSensitive - Se deve considerar maiúsculas/minúsculas
     * @returns {DataService} - Retorna this para method chaining
     */
    sort(caseSensitive = false) {
        this.data.sort((a, b) => {
            const aCompare = caseSensitive ? a : a.toLowerCase();
            const bCompare = caseSensitive ? b : b.toLowerCase();
            return aCompare.localeCompare(bCompare, 'pt-BR');
        });
        return this;
    }

    /**
     * Filtra dados por critério
     * @param {Function} filterFn - Função de filtro
     * @returns {DataService} - Retorna this para method chaining
     */
    filter(filterFn) {
        if (typeof filterFn !== 'function') {
            throw new Error('DataService: filter espera uma função');
        }
        
        this.data = this.data.filter(filterFn);
        this.metadata.count = this.data.length;
        return this;
    }

    /**
     * Retorna metadados sobre os dados carregados
     * @returns {Object}
     */
    getMetadata() {
        return { ...this.metadata };
    }

    /**
     * Limpa todos os dados
     * @returns {DataService} - Retorna this para method chaining
     */
    clear() {
        this.data = [];
        this.metadata = {
            source: null,
            loadedAt: null,
            count: 0
        };
        return this;
    }

    /**
     * Verifica se há dados carregados
     * @returns {boolean}
     */
    hasData() {
        return this.data.length > 0;
    }

    /**
     * Retorna o número de itens carregados
     * @returns {number}
     */
    getCount() {
        return this.data.length;
    }
}

export default DataService;

