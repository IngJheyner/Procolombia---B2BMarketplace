## Analisis de escenarios de atributos de calidad

### Razonamiento
_Análisis, conclusión o razonamiento que lleva al arquitecto a incluir determinados atributos de calidad y escenarios, dejar de lado otros, o asignarles determinado peso o prioridad_
### Descripción de escenarios
_Esta sección se compone de la lista de escenarios detallados, producto del QAW, organizados según el atributo de calidad correspondiente. Típicamente los escenarios deben contemplar los siguientes atributos:_

- Disponibilidad: Fallas del sistema y sus consecuencias
- Mantenibilidad: Costo del cambio del sistema
- Desempeño: Tiempos de respuesta
- Seguridad: Protección ante accesos no autorizados
- Usabilidad: Cuán fácil es para el usuario completar una tarea y la clase de soporte que el sistema le brinda

_El autor podrá adicionar atributos de calidad o prescindir de ellos si lo considera pertinente._

### Escenarios

| **Identificador** | _ESC\_XX_ |
|:--- | --- |
| **Atributo(s) de calidad relevante(s)** |  |
| **Objetivo(s) de Negocio correspondiente(s)** |  |
| **Fuente** |  |
| **Estímulo** |  |
| **Artefacto** |  |
| **Ambiente** |  |
| **Respuesta** |  |
| **Medida de la respuesta** |  |


### Tácticas de resolución de arquitectura

| Escenarios analizados | _Identificador del escenario_ |
| --- | --- |
| **Directrices arquitectónicas** | Aprendizaje rápido de la aplicación. |
| **Estilos, tácticas y raciocinio** |  Debido al tipo de perfil de usuario que usara la aplicación, es de gran importancia la usabilidad que brinde la aplicación. Y que el sistema brinde la suficiente ayuda al usuario para que entienda rápidamente como es la funcionalidad de manera intuitiva. Para lograr esto se hará uso de la táctica en Tiempo de Ejecución (Runtime Tactics), llamada Mantener un Modelo del Usuario (Maintain a model of the user), esta táctica se basa en el conocimiento del usuario sobre el sistema y el comportamiento del usuario teniendo en cuenta la tarea ejecutada. Esta táctica facilitara conocer la respuesta del usuario con respecto a la aplicación y a si mismo su satisfacción. |
| **Riesgos** | Poca experiencia del diseñador en la construcción de una aplicación usable. |
| **Ventajas y desventajas** | (+) Se basa en la satisfacción del usuario.(-) Se pueden descuidar otros aspectos de la aplicación, en pro de brindar la mejor experiencia de usuario. |

