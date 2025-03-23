/**
 * Módulo de conversión de unidades
 * Maneja los cálculos entre píxeles, milímetros y centímetros
 */
class UnitConverter {
    /**
     * Convierte un valor entre diferentes unidades
     * @param {number} value - Valor a convertir
     * @param {string} fromUnit - Unidad de origen ('px', 'mm', 'cm')
     * @param {string} toUnit - Unidad de destino ('px', 'mm', 'cm')
     * @param {number} dpi - Puntos por pulgada (para conversiones desde/hacia píxeles)
     * @returns {number} - Valor convertido
     */
    static convert(value, fromUnit, toUnit, dpi = 96) {
        // Si las unidades son iguales, devolvemos el mismo valor
        if (fromUnit === toUnit) {
            return value;
        }
        
        // Convertir a mm como unidad intermedia
        let valueInMm;
        
        // Conversión a milímetros (unidad intermedia)
        switch (fromUnit) {
            case 'px':
                valueInMm = (value * 25.4) / dpi; // 1 pulgada = 25.4 mm
                break;
            case 'cm':
                valueInMm = value * 10; // 1 cm = 10 mm
                break;
            case 'mm':
                valueInMm = value;
                break;
            default:
                throw new Error(`Unidad de origen no soportada: ${fromUnit}`);
        }
        
        // Conversión desde milímetros a unidad de destino
        switch (toUnit) {
            case 'px':
                return (valueInMm * dpi) / 25.4;
            case 'cm':
                return valueInMm / 10;
            case 'mm':
                return valueInMm;
            default:
                throw new Error(`Unidad de destino no soportada: ${toUnit}`);
        }
    }
    
    /**
     * Obtiene el símbolo de la unidad
     * @param {string} unit - Código de la unidad ('px', 'mm', 'cm')
     * @returns {string} - Símbolo formateado de la unidad
     */
    static getUnitSymbol(unit) {
        const symbols = {
            'px': 'px',
            'mm': 'mm',
            'cm': 'cm'
        };
        
        return symbols[unit] || unit;
    }
}

// Exportamos la clase para su uso en otros archivos
window.UnitConverter = UnitConverter;