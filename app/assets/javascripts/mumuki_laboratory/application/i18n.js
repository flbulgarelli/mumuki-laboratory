(() => {
  mumuki.LOCALES = {
    es: {
      unmeet_expectations: 'Objetivos que no se cumplieron',
      errored: '¡Ups! Tu solución no se puede ejecutar',
      failed: 'Tu solución no pasó las pruebas',
      passed_with_warnings: 'Tu solución funcionó, pero hay cosas que mejorar',
      passed: '¡Muy bien! Tu solución pasó todas las pruebas',
      keep_learning: '¡Seguí aprendiendo!',
      retry_exercise: 'Reintentar',

      // offline-specific
      next_exercise: 'Siguiente Ejercicio'
    },

    en: {
      unmeet_expectations: "Goals that weren't met",
      keep_learning: "Keep learning!",
      retry_exercise: "Retry"
    },

    pt: {
      unmeet_expectations: "Objetivos que não foram atendidos",
      retry_exercise: "Tentar novamente"
    }
  }

  mumuki.translate = function (key) {
    return mumuki.LOCALES[mumuki.locale][key];
  }
})();
