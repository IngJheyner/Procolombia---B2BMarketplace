# MatchMaking Procolombia
### v1.1.x

## Arquitectura

Versionamiento, tegnologia y servicios para el control de cambios del proyecto.

- **Drupal realese:** 9.4.x
- **Server web HTTP:** Apache
- **Gestor de BD:** MariaDB
- **PHP:** 8.1.x
- **Server Cache**: Redis
- **Node:** >= 10.x
- **Npm:** >= 6.x
- **Repositorios GIT:** Azure Repors
- **Ambientes:** Local, Dev's y QA.

## Manual de aceptacion de buenas practicas de desarrollo.
El siguiente texto es llevar documentado a nivel de configuracion el desarrollo del sitio web **Matchmaking de Procolombia.**

> Idealmente, todo el código que se incluye en Drupal Core y los módulos, temas y distribuciones aportados será seguro, internacionalizado, mantenible y eficiente. Para facilitar esto, la comunidad de Drupal ha desarrollado un conjunto de pautas y estándares para que los sigan los desarrolladores. La mayoría de estos estándares se pueden encontrar en [Mejores prácticas](https://api.drupal.org/api/drupal/core%21core.api.php/group/best_practices/9.0.x)

Partiendo de la anterior documentacion de [Drupal](https://www.drupal.org/), los estandares de codificacion se aplican al codigo dentro de modulos  contrib y custom basados en el esatandar PEAR.
Para ello se utilizara la aceptacion del modulo [Coder](https://www.drupal.org/project/coder) llevando asi las mejores practicas segun los [estandares de codificacion](https://www.drupal.org/docs/develop/standards), el modulo comparte la instalacion phpcbf de PHP_CodeSniffer configurando en su IDE la extension del mismo para su correcto funcionamiento.

Se aconseja analizar la codificacion utilizada en los archivos incluidos en la distribucion de Drupal y en cualquier otro modulo compartido por la comunidad, ten siempre en cuenta que los modulos compartidos por la comunidad no pasan por un control estricto de calidad previo a su publicacion, por lo que podrian contener errores de codificacion.

Las siguiente pautas estaran dentro el criterio de aceptacion y ya vendran configuradas dentro la instalacion de Coder y phpcbf para Drupal, leer [criterios de aceptacion buenas practicas con Drupal](https://asesoftware.sharepoint.com/:b:/r/sites/proyectos/FIDUCOLDEX_S.A/CO_1020_PROCOLOMBIA_2022/Sistema/3.Construccion/Estandares%20de%20codificacion-v.1.0.pdf?csf=1&web=1):

1.  Codificacion de archivos (UTF-8 sin BOM).
2.  Identacion y lineas en blanco.
3.  Etiquetas de apertura y cierre de PHP.
4.  Operadores
5.  Concatenacion de cadenas.
6.  Uso de comillas.
7.  Uso de punto y coma ;) en codigo PHP.
8.  Estructuras de control.
9.  Funciones.
10. Clases.
11. Arrays.
12. Constantes.
13. Variables globales.
14. Forzado de tipos (Casting).
15. Determinacion de tipos en funciones (type hinting).
16. Encadenamiento (chaining).
17. Nombres de modulos
    Anteponer un prefijo con el nombre del proyecto.
18. Nombre de archivos
    Siempre en minuscula.
19. Idioma ingles como basae para todo el sistema.
    Modulos, nombres de funciones, variables etc.
20. Fragmentos de codigo y comentarios de documentacion.

Para llevar un control, manejo de buenas practicas y las pautas ya enumeradas de la 1 - 16 en codificacion con drupal  [Usar la guía de estilo de Drupal con PhpCS y Visual Code](https://oscarnovas.com/blog/usar-la-guia-de-estilo-de-drupal-con-phpcs-y-visual-code).



## Identacion (En desarrollo)

Para los nombres de entidades de contenido(Nodos, Taxonomias, Bloques etc) y entidades de configuracion se aconseja el nombramiento de etiqueta en espaniol y nombre de maquina(Machine name) en ingles idioma estandar del sistema.

Para los nombre de campos a demas del prefijo field predeterminado se debe tomar como abreviatura o nombre completo de la entidad creada el nombre de maquina, la etiqueta puede ir en espaniol.

Ejemplo:
Entidad Tip. Contenido - Productos machine_name: product
Campos:
- Etiqueta XXXX
machine_name: field_product_xxxx
machine_name: field_xxxx_product
machine_name: field_pr_xxxx
El nombre de entidad puede ir como prefijo o sufijo al nombre del campo

Entidades de configuracion que tenga campos dependientes del mismo se aconseja llevar de la misma forma y con el estandar de identacion definido.

Toda ves que haya lugar para la indentifiacion, visualizacion y orden que se llevara acabo en la integracion de cada uno de los ambientes a nivel de archivos y base de datos con la herramienta de lineas de comandos y secuencia DRUSH.

## Subtema (En desarrollo)

Se utilizara el tema principal Boostrap Barrio con el subtema de customizacion Boostrap Sass ya instalado en el proyecto, con la idea de iniciar un proyecto nuevo en base a plantillas, archivos css y js para un correcto funcionamiento. Visitar la documentacion [Boostrap Sass](https://www.drupal.org/project/bootstrap_sass) se utiliza el cojunto de herramientas automatizado [Gulp](https://gulpjs.com/).

El subtema se llama **marchmaking_pro** la cual esta configurado para un correcto funcionamiento con el framework boostrap, se aconseja utilizar por completo el framework para temas de custom o personalizacion del sitio con sus funcionalidades y nombres de clase predefinidos, se tomara esto dentro del criterio de funcionalidad.
Los plugins o librerias que se necesitane para el desarrollo podran ser instaladas dentro del subtema en la carpeta source(src) como plantilllas de los templates de drupal, si son modulos custom pueden ir en el mismo con la configuracion o plantillas personalizadas.

Las plantillas iran en la carpeta templates con la jerarquia de nombramiento respecto a los folder que viene predeterminado, para mayor informacion consultar dentro la carpeta core en el apartado de temas ya sea classy o basic como es el nombramiento jerarquico del mismo.

### La documentacion se ira actualizando a medida del avance del proyecto, se dejara abierto cualquier aporte de buena practica o correcion de archivo README a criterio de cada uno de los miembros del equipo DRUPAL.




