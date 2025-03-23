/**
 * Módulo UI
 * Gestiona la interfaz de usuario y las interacciones
 */
class UI {
    /**
     * Inicializa la interfaz de usuario
     */
    constructor() {
        // Selección de elementos del DOM
        this.fromSelect = document.getElementById('from');
        this.toSelect = document.getElementById('to');
        this.inputValue = document.getElementById('inputValue');
        this.dpiInput = document.getElementById('dpi');
        this.convertBtn = document.getElementById('convertBtn');
        this.resultDiv = document.getElementById('result');
        this.resultValue = document.getElementById('resultValue');
        this.swapBtn = document.getElementById('swapUnits');
        
        // Inicializar eventos
        this.setupEventListeners();
    }
    
    /**
     * Configura los event listeners para los elementos de la UI
     */
    setupEventListeners() {
        // Botón de conversión
        this.convertBtn.addEventListener('click', () => this.performConversion());
        
        // Botón de intercambio de unidades
        this.swapBtn.addEventListener('click', () => this.swapUnits());
        
        // Conversión al presionar Enter en el campo de valor
        this.inputValue.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performConversion();
            }
        });
    }
    
    /**
     * Realiza la conversión de unidades
     */
    performConversion() {
        const value = parseFloat(this.inputValue.value);
        const fromUnit = this.fromSelect.value;
        const toUnit = this.toSelect.value;
        const dpi = parseFloat(this.dpiInput.value) || 96;
        
        // Validar entrada
        if (isNaN(value)) {
            this.showError('Por favor, ingrese un valor numérico válido.');
            return;
        }
        
        try {
            // Realizar conversión
            const result = UnitConverter.convert(value, fromUnit, toUnit, dpi);
            
            // Mostrar resultado
            this.showResult(result, toUnit);
        } catch (error) {
            this.showError(error.message);
        }
    }
    
    /**
     * Muestra el resultado de la conversión
     * @param {number} value - Valor convertido
     * @param {string} unit - Unidad del resultado
     */
    showResult(value, unit) {
        const formattedValue = value.toFixed(4);
        const unitSymbol = UnitConverter.getUnitSymbol(unit);
        
        this.resultValue.textContent = `${formattedValue} ${unitSymbol}`;
        this.resultDiv.style.display = 'block';
    }
    
    /**
     * Muestra un mensaje de error
     * @param {string} message - Mensaje de error
     */
    showError(message) {
        alert(message);
    }
    
    /**
     * Intercambia las unidades de origen y destino
     */
    swapUnits() {
        const fromValue = this.fromSelect.value;
        const toValue = this.toSelect.value;
        
        this.fromSelect.value = toValue;
        this.toSelect.value = fromValue;
    }
}

// Exportamos la clase para su uso en otros archivos
window.UI = UI;