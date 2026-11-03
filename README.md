# desarrollo_web_agustin_pe-a
Trabajo de CC5002,pagina de ornitologia

La pagina se divide en 4 pestañas principales, a las cuales se puede navegar mediante la barra de navegacion en la parte superior de todas las paginas, siempre se muestran 3 paginas ya que no aparece la pagina en la que se esta actualmente

Inicio, que contiene el mensaje de bienvenida y los ultimos 2 registros subidos a la base de datos. Para obtener estos registro los busco ordenando los avistamientos por id, ya que el id es creciente los dos de mayor id son los recientes.

La pagina de avistamiento muesta la lista de todos los avistamientos en la base de datos, si se hace click a uno de los avistamientos se despliega en grande en su propia pagina con extension avistamiento/"id de avistamiento". Ademas en esta pagina esta la informacion de estadisticas, incluyendo graficos para la cantidad de avistamientos por dia, el total de avistamientos por tipo de ave y el total de voluntarios registrados por comuna. Los graficos se hicieron con la biblioteca de Highcharts, usando fetch para generar los graficos del lado del cliente. 
Tambien al momento de ver un avistamiento en detalle esta la opcion de agregar un comentario, donde te pide un nombre de usuario y el texto del comentario. El nombre debe tener entre 3 a 50 caracteres de largo, y el texto un minimo de 5 caracteres para ser aceptado. Y como los comentarios se ordenan por fecha aparecen de mas reciente a mas antiguo.

Luego esta la pagina de Registrar avistamiento, aqui se muestra el forms para que el usuario suba su info. El tipo de ave no sirve para nada pues no es informacion que guardemos en la base de datos, pero se quedo ahi por arrastre de como estaba definido la pagina antes. Si no se detecta que hay una session iniciada la pagina va a redireccionar a la de crear cuenta.

Finalmente esta la pagina de crear cuenta, al crear la cuenta se pide que el correo sea uno no inscrito en nuestra base de datos para diferenciar las cuentas, asi si en el futuro creamos una opcion de iniciar sesion se pedira solamente el correo (como no habia una opcion de contraseña en la base de datos se elimino), tampoco hay una opcion de cerrar sesion, asi que la una forma de hacerlo es eliminando las cookies que guardan la sesion actual.