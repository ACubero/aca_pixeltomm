document.addEventListener('DOMContentLoaded', function() {
  const valorInput = document.getElementById('valor');
  const unidadOrigenSelect = document.getElementById('unidad-origen');
  const unidadDestinoSelect = document.getElementById('unidad-destino');
  const convertirButton = document.getElementById('convertir');
  const resultadoValor = document.getElementById('resultado-valor');
  const ppiInput = document.getElementById('ppi');
 // const savePpiButton = document.getElementById('save-ppi'); // Ya no es necesario
  const ppiMessage = document.getElementById('ppi-message');
  const ppiInfo = document.getElementById("ppi-info");
  const categoriaSelect = document.getElementById('categoria');
  const copiarButton = document.getElementById('copiar');
  const reusarButton = document.getElementById('reusar');
  const ppiInputGroup = document.getElementById("ppi-input-group");

  // Unidades y sus factores de conversión (relativos a una unidad base)
  const unidades = {
      longitud: {
          px: { base: "mm", factor: (ppi) => 25.4 / ppi }, // Factor dinámico para px
          mm: { base: "mm", factor: 1 },
          cm: { base: "mm", factor: 10 },
          in: { base: "mm", factor: 25.4 },
          ft: { base: "mm", factor: 304.8 },
          yd: { base: "mm", factor: 914.4 },
          m: { base: "mm", factor: 1000 },
          km: { base: "mm", factor: 1000000 },
          mi: { base: "mm", factor: 1609344 }
      },
      peso: {
          mg: { base: "g", factor: 0.001 },
          g: { base: "g", factor: 1 },
          kg: { base: "g", factor: 1000 },
          oz: { base: "g", factor: 28.3495 },
          lb: { base: "g", factor: 453.592 },
          t: { base: "g", factor: 1000000 } // Tonelada métrica
      },
      volumen: {
          ml: { base: "l", factor: 0.001 },
          cl: { base: "l", factor: 0.01 },
          l: { base: "l", factor: 1 },
          "gal (US)": { base: "l", factor: 3.78541 },
          "qt (US)": { base: "l", factor: 0.946353 },
          "pt (US)": { base: "l", factor: 0.473176 },
          "fl oz (US)": { base: "l", factor: 0.0295735 },
          m3: {base: "l", factor: 1000}
      },
      temperatura: { // Temperatura es especial, no usa factores, sino funciones
          C: {
              toBase: (c) => c,  // Celsius a Celsius (identidad)
              fromBase: (c) => c
          },
          F: {
              toBase: (f) => (f - 32) * 5 / 9, // Fahrenheit a Celsius
              fromBase: (c) => (c * 9 / 5) + 32
          },
          K: {
              toBase: (k) => k - 273.15, // Kelvin a Celsius
              fromBase: (c) => c + 273.15
          }
      }
  };



  // Cargar PPI guardado
  chrome.storage.sync.get('ppi', function(data) {
      if (data.ppi) {
          ppiInput.value = data.ppi;
      }
      actualizarOpcionesUnidades(); // Llamamos a la función después de cargar el PPI
  });



  // Actualizar opciones de unidades al cambiar la categoría
  categoriaSelect.addEventListener('change', actualizarOpcionesUnidades);

  function actualizarOpcionesUnidades() {
      const categoria = categoriaSelect.value;
      const unidadesCategoria = unidades[categoria];

      // Limpiar opciones actuales
      unidadOrigenSelect.innerHTML = '';
      unidadDestinoSelect.innerHTML = '';

      // Agregar nuevas opciones
      for (const unidad in unidadesCategoria) {
          const optionOrigen = document.createElement('option');
          optionOrigen.value = unidad;
          optionOrigen.textContent = unidad;
          unidadOrigenSelect.appendChild(optionOrigen);

          const optionDestino = document.createElement('option');
          optionDestino.value = unidad;
          optionDestino.textContent = unidad;
          unidadDestinoSelect.appendChild(optionDestino);
      }

      // Actualizar PPI info si es longitud
      actualizarPPIInfo();

  }
  function actualizarPPIInfo(){
       if (categoriaSelect.value === 'longitud') {
              ppiInfo.textContent = `(Basado en ${parseFloat(ppiInput.value)} PPI)`;
              ppiInputGroup.classList.remove("hidden");

          } else {
              ppiInfo.textContent = '';
              ppiInputGroup.classList.add("hidden");
          }
  }
  // Evento para el botón "Convertir" (modificado para manejar si no hay resultado)
  convertirButton.addEventListener('click', function() {
      const valor = parseFloat(valorInput.value);
      const unidadOrigen = unidadOrigenSelect.value;
      const unidadDestino = unidadDestinoSelect.value;
      const categoria = categoriaSelect.value;
      const ppi = parseFloat(ppiInput.value);


      if (isNaN(valor)) {
          resultadoValor.textContent = 'Introduce un valor válido.';
          return;
      }
       // Guardar PPI (integrado en el botón Convertir)
      if (!isNaN(ppi) && ppi > 0) {
          chrome.storage.sync.set({ 'ppi': ppi }, function() {
              ppiMessage.textContent = 'PPI guardado.';
              setTimeout(() => ppiMessage.textContent = '', 2000);
               actualizarPPIInfo();
          });
      } else {
           ppiMessage.textContent = "Por favor, introduce un valor de PPI válido."
            setTimeout(() => ppiMessage.textContent = '', 2000);
           return; //Importante para que no continue si el ppi no es valido
      }

      let resultado = convertirUnidades(valor, unidadOrigen, unidadDestino, categoria, ppi);

      if(isNaN(resultado)){
          resultadoValor.textContent = 'Conversión no válida.';
           copiarButton.style.display = 'none'; // Ocultar
           reusarButton.style.display = 'none';
      } else{
          resultadoValor.textContent = `${resultado.toFixed(2)} ${unidadDestino}`;
           copiarButton.style.display = 'inline-block'; // Mostrar botones
           reusarButton.style.display = 'inline-block';
      }
    

  });

  //Ya no hay evento para Guardar PPI

  ppiInput.addEventListener("change", function(){
     actualizarPPIInfo();
  });


  function convertirUnidades(valor, origen, destino, categoria, ppi) {
      const unidadInfoOrigen = unidades[categoria][origen];
      const unidadInfoDestino = unidades[categoria][destino];

      if (!unidadInfoOrigen || !unidadInfoDestino) {
          return NaN; // Unidad no válida
      }

      // Caso especial: Temperatura (usa funciones)
      if (categoria === 'temperatura') {
          const valorEnBase = unidadInfoOrigen.toBase(valor);
          const resultado = unidadInfoDestino.fromBase(valorEnBase);
          return resultado;
      }

      // Conversiones para otras categorías (usan factores)

      // 1. Convertir a la unidad base
      let valorEnBase;
      if (origen === "px") {
          valorEnBase = valor * unidadInfoOrigen.factor(ppi); //Usamos la funcion que calcula el factor
      } else {
          valorEnBase = valor * unidadInfoOrigen.factor;
      }


      // 2. Convertir desde la unidad base a la unidad de destino
        let resultado;
      if(destino === "px"){
          resultado = valorEnBase / unidadInfoDestino.factor(ppi);

      } else{
          resultado = valorEnBase / unidadInfoDestino.factor;
      }

      return resultado;
  }

     // Copiar al portapapeles
  copiarButton.addEventListener('click', function() {
      const resultadoTexto = resultadoValor.textContent;
      if (resultadoTexto) { // Solo copiar si hay un resultado
          navigator.clipboard.writeText(resultadoTexto)
              .then(() => {
                  // Éxito al copiar (opcional: mostrar mensaje)
                  console.log('Resultado copiado al portapapeles!');
                  //Podriamos mostrar una pequeña notificacion
                  const notificacion = document.createElement("div");
                  notificacion.textContent = "Copiado!";
                  notificacion.classList.add("notificacion-copiado");
                  document.body.appendChild(notificacion);

                  setTimeout(()=>{
                      notificacion.remove();
                  },1500);
              })
              .catch(err => {
                  // Error al copiar
                  console.error('Error al copiar: ', err);
              });
      }
  });

  // Reusar resultado como valor inicial
  reusarButton.addEventListener('click', function() {
      const resultadoTexto = resultadoValor.textContent;
      if (resultadoTexto) { //Solo reusar si hay un resultado
          const resultadoNumerico = parseFloat(resultadoTexto); //Extraer el valor numerico
           if (!isNaN(resultadoNumerico)) {
              valorInput.value = resultadoNumerico;
           }
      }
  });
  //Ocultar botones al inicio
  copiarButton.style.display = 'none';
  reusarButton.style.display = 'none';

   actualizarOpcionesUnidades(); //Llamamos a la funcion al cargar la pagina
});