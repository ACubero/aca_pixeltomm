# Pixel Converter Extension

Una extensión para navegadores basados en Chromium que permite convertir entre píxeles, milímetros y centímetros de manera fácil y rápida.

## Características

- Conversión bidireccional entre píxeles, milímetros y centímetros
- Interfaz moderna y fácil de usar
- Soporte para múltiples idiomas (Español, Inglés)
- Personalización de DPI para cálculos precisos
- Guarda automáticamente la configuración de DPI preferida

## Instalación

### Desde la Chrome Web Store (recomendado)
1. Visita la página de la extensión en la Chrome Web Store
2. Haz clic en "Añadir a Chrome"

### Instalación manual (modo desarrollador)
1. Descarga el código fuente o clona este repositorio
2. Abre Chrome y navega a `chrome://extensions/`
3. Activa el "Modo desarrollador" usando el interruptor en la esquina superior derecha
4. Haz clic en "Cargar descomprimida" y selecciona la carpeta raíz del proyecto
5. La extensión se instalará y aparecerá un icono en la barra de herramientas de Chrome

## Uso

1. Haz clic en el icono de la extensión en la barra de herramientas
2. Selecciona la unidad de origen (de)
3. Selecciona la unidad de destino (a)
4. Ingresa el valor a convertir
5. Ajusta el DPI si es necesario (para conversiones con píxeles)
6. Haz clic en "Convertir" o presiona Enter

## Estructura del Proyecto

```
pixel-converter-extension/
├── assets/               # Recursos estáticos
│   ├── icons/            # Iconos de la extensión
│   └── images/           # Imágenes utilizadas en la UI
├── src/                  # Código fuente
│   ├── js/               # Scripts JavaScript
│   └── css/              # Hojas de estilo CSS
├── popup/                # Interfaz principal
├── _locales/             # Archivos de internacionalización
├── manifest.json         # Configuración de la extensión
└── README.md             # Documentación
```

## Desarrollo

### Requisitos previos
- Un navegador basado en Chromium (Chrome, Edge, Opera, etc.)
- Conocimientos básicos de HTML, CSS y JavaScript

### Modificaciones y mejoras
1. Haz un fork del repositorio
2. Realiza tus cambios
3. Prueba la extensión localmente usando el modo desarrollador
4. Envía un pull request con tus mejoras

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - consulta el archivo LICENSE para más detalles.