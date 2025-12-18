import type { Locale } from './types';

type Dictionary = Record<string, string>;

const es: Dictionary = {
  // Ads
  'ads.label': 'Publicidad',

  // Brand
  'brand.subtitle': '¿Quién miente?',
  'pill.local': 'Juego local',

  // Home
  'home.title': '¡Bienvenido!',
  'home.subtitle': 'Descubre quién es el impostor sin revelar la palabra secreta.',
  'home.localGame': 'Jugar aquí',
  'home.localGame.desc': 'Pasad el móvil/tablet entre jugadores',
  'home.onlineGame': 'Jugar online',
  'home.onlineGame.desc': 'Cada jugador en su dispositivo',
  'home.comingSoon': 'Próximamente',

  // Setup
  'setup.title': 'Jugar aquí',
  'setup.subtitle': 'Configura tu partida',
  'setup.basic': 'Configuración básica',
  'setup.numPlayers': 'Jugadores',
  'setup.numImpostors': 'Impostores',
  'setup.clueDesc': 'El impostor recibe una pista similar a la palabra',
  'setup.player': 'Jugador',
  'setup.players': 'Jugadores',
  'setup.addPlayer': 'Añadir jugador',
  'setup.playerName': 'Nombre',
  'setup.playerIcon': 'Icono',
  'setup.selectIcon': 'Elige un icono',
  'setup.mode': 'Modo de juego',
  'setup.topic': 'Tema personalizado',
  'setup.topic.placeholder': 'Ej: Películas de terror',
  'setup.clue': 'Pista',
  'setup.start': 'EMPEZAR PARTIDA',
  'setup.back': 'ATRÁS',
  'setup.next': 'SIGUIENTE',
  'setup.minPlayers': 'Mínimo 3 jugadores',
  'setup.maxImpostors': 'Máximo {max} impostores',

  // Modes
  'mode.list': 'Listas',
  'mode.ai': 'IA personalizada',
  'mode.list.helper': 'Palabra secreta de listas predefinidas',
  'mode.ai.helper': 'La IA genera la palabra según tu tema',

  // Categories / Themes
  'cat.general': 'General',
  'cat.animals': 'Animales',
  'cat.food': 'Comida',
  'cat.movies': 'Películas',
  'cat.sports': 'Deportes',
  'cat.places': 'Lugares',
  'cat.professions': 'Profesiones',
  'cat.technology': 'Tecnología',
  'cat.music': 'Música',
  'cat.history': 'Historia',
  'cat.school': 'Escuela',
  'cat.family': 'Familia',
  'cat.actions': 'Acciones',
  'cat.nature': 'Naturaleza',
  'cat.fantasy': 'Fantasía',
  'cat.science': 'Ciencia',
  'cat.art': 'Arte',
  'cat.space': 'Espacio',
  'cat.games': 'Videojuegos',
  'cat.vehicles': 'Vehículos',
  'cat.clothes': 'Ropa',
  'cat.objects': 'Objetos',
  'cat.body': 'Cuerpo',

  // Theme selector
  'theme.title': 'Temas',
  'theme.subtitle': 'Selecciona uno o varios temas. Las palabras saldrán de los temas seleccionados.',
  'theme.random': 'Aleatorio',
  'theme.randomDesc': 'Mezcla todos los temas disponibles',
  'theme.selectedOne': 'Tema seleccionado',
  'theme.selectedMany': 'Temas seleccionados',
  'theme.or': 'O',
  'theme.custom': 'Tema personalizado',
  'theme.custom.desc': 'Crea un tema personalizado con IA',
  'theme.custom.placeholder': 'Ej: Superhéroes, Videojuegos...',
  'theme.custom.send': 'Crear',
  'ai.adNotice': 'Se mostrará un breve anuncio',
  'ads.interstitial.generating': 'Generando...',
  'ads.interstitial.wait': 'Por favor espera mientras creamos tu palabra personalizada',

  // Turn reveal
  'turn.title': 'Turno de {player}',
  'turn.passDevice': 'Pásale el móvil a {player}',
  'turn.tapToReveal': 'Toca para ver tu rol',
  'turn.yourRole': 'Tu rol',
  'turn.youAreCivil': '¡Eres CIVIL!',
  'turn.youAreImpostor': '¡Eres IMPOSTOR!',
  'turn.memorized': 'Memorizado',
  'turn.secretWord': 'La palabra secreta es:',
  'turn.noWord': 'No conoces la palabra secreta. ¡Disimula!',
  'turn.clue': 'Pista:',
  'turn.understood': 'Entendido',
  'turn.next': 'Siguiente jugador',
  'turn.startVote': 'Ir a votación',

  // Vote
  'vote.title': '¿Quién es el impostor?',
  'vote.subtitle': 'Cada jugador vota en secreto',
  'vote.turn': 'Vota {player}',
  'vote.passDevice': 'Pasa el dispositivo a {player}',
  'vote.tapToVote': 'Toca para votar',
  'vote.selectImpostor': 'Selecciona al impostor',
  'vote.confirm': 'Confirmar voto',
  'vote.next': 'Siguiente votante',
  'vote.seeResults': 'Ver resultados',

  // Discussion
  'discussion.title': '¡Hora de discutir!',
  'discussion.subtitle': 'Todos los jugadores dan pistas sobre la palabra secreta. El impostor debe disimular sin conocerla.',
  'discussion.hint': 'Cuando terminen de debatir, pulsa para ver el resumen de la partida.',
  'discussion.reveal': 'Revelar',

  // Results
  'results.title': 'Resultados',
  'results.summary': 'Resumen',
  'results.civils': 'Civiles',
  'results.civilsWin': '¡Los civiles ganan!',
  'results.impostorWins': '¡El impostor gana!',
  'results.theImpostor': 'Impostores',
  'results.theWord': 'La palabra secreta',
  'results.theClue': 'La pista',
  'results.votes': 'Votación',
  'results.playAgain': 'Jugar otra vez',
  'results.backHome': 'Volver al inicio',

  // Ads
  'ads.sidebar': 'Publicidad',
  'ads.sticky': 'Publicidad',
  'ads.interstitial.title': 'Publicidad',
  'ads.interstitial.body': 'Tu tema personalizado se generará al continuar',
  'ads.interstitial.btn': 'Generar',
  'ads.footer': 'Publicidad',

  // Online
  'online.title': 'Jugar online',
  'online.subtitle': 'Únete a una sala o crea una nueva',
  'online.yourInfo': 'Tu información',
  'online.yourName': 'Tu nombre',
  'online.namePlaceholder': 'Escribe tu nombre',
  'online.joinRoom': 'Unirse',
  'online.createRoom': 'Crear',
  'online.roomName': 'Nombre de la sala',
  'online.roomNamePlaceholder': 'Ej: Amigos',
  'online.roomNameRequired': 'Pon un nombre a la sala',
  'online.unnamedRoom': 'Sala sin nombre',
  'online.roomCode': 'Código de sala',
  'online.join': 'Unirse',
  'online.publicRooms': 'Salas Públicas',
  'online.noRooms': 'No hay salas públicas disponibles',
  'online.players': 'jugadores',
  'online.full': 'Llena',
  'online.makePublic': 'Sala pública',
  'online.publicDesc': 'Aparece en la lista para que otros se unan',
  'online.refresh': 'Actualizar',
  'online.createOne': 'Crea una sala nueva en la pestaña "Crear"',
  'online.available': 'Disponible',
  'online.creating': 'Creando sala...',
  'online.loadingRooms': 'Cargando salas...',
  'online.autoRefresh': 'Actualización automática cada 8s',
  'online.filter.available': 'Disponibles',
  'online.filter.all': 'Todas',
  'online.room.full': 'Llena',
  'online.room.spots': 'lugares',
  'theme.selectedHint': 'Las palabras saldrán de estos temas',
  'lobby.roomCode': 'Código de sala',
  'lobby.waitingPlayers': 'Esperando jugadores',

  // Footer
  'footer.privacy': 'Privacidad',
  'footer.terms': 'Términos',
  'footer.cookies': 'Cookies',
  'footer.legal': 'Aviso Legal',
  'footer.credits': '© 2025 · És Impostor · MaxSM',

  // Consent
  'consent.text': 'Utilizamos cookies y tecnologías similares para mostrar anuncios personalizados y analizar el tráfico del sitio. Al hacer clic en "Consentir", aceptas nuestro uso de cookies.',
  'consent.deny': 'No consentir',
  'consent.accept': 'Consentir',
  'consent.manage': 'Gestionar opciones',
  'consent.manage.title': 'Gestionar preferencias de cookies',
  'consent.manage.desc': 'Puedes elegir qué tipos de cookies aceptar. Las cookies esenciales son necesarias para el funcionamiento del sitio.',
  'consent.pref.ad_storage': 'Almacenamiento de anuncios',
  'consent.pref.ad_storage.desc': 'Permite mostrar anuncios personalizados',
  'consent.pref.ad_user_data': 'Datos de usuario para anuncios',
  'consent.pref.ad_user_data.desc': 'Compartir datos con anunciantes',
  'consent.pref.ad_personalization': 'Personalización de anuncios',
  'consent.pref.ad_personalization.desc': 'Anuncios basados en tus intereses',
  'consent.pref.analytics_storage': 'Almacenamiento de análisis',
  'consent.pref.analytics_storage.desc': 'Analizar el uso del sitio',
  'consent.denyAll': 'Rechazar todo',
  'consent.save': 'Guardar preferencias',

  // Legal Pages
  'legal.privacy.title': 'Política de Privacidad',
  'legal.privacy.content': `
    <h2>1. Responsable del Tratamiento</h2>
    <p>El responsable del tratamiento de sus datos personales es MaxSM, desarrollador independiente de la aplicación web És Impostor.</p>
    
    <h2>2. Información que Recopilamos</h2>
    <p>En És Impostor recopilamos únicamente la información estrictamente necesaria para el funcionamiento del servicio:</p>
    <ul>
      <li><strong>Datos de juego:</strong> Nombres de jugadores introducidos por los usuarios, configuraciones de partida (número de jugadores, impostores, temas seleccionados). Estos datos se procesan localmente en su dispositivo y no se almacenan en nuestros servidores.</li>
      <li><strong>Datos técnicos:</strong> Dirección IP (anonimizada), tipo de navegador, sistema operativo, resolución de pantalla. Estos datos se recopilan automáticamente por motivos técnicos y de seguridad.</li>
      <li><strong>Cookies y tecnologías similares:</strong> Utilizamos cookies para publicidad (Google AdSense) y análisis de uso. Puede gestionar sus preferencias en cualquier momento.</li>
      <li><strong>Datos de sesión online:</strong> Si utiliza el modo online, se almacenan temporalmente en nuestros servidores (Cloudflare Durable Objects) los datos de la sala de juego (código de sala, jugadores conectados, estado del juego). Estos datos se eliminan automáticamente cuando la sala se cierra.</li>
    </ul>
    
    <h2>3. Finalidad del Tratamiento</h2>
    <p>Utilizamos sus datos personales para las siguientes finalidades:</p>
    <ul>
      <li><strong>Prestación del servicio:</strong> Permitirle jugar, crear salas online, generar palabras personalizadas mediante IA.</li>
      <li><strong>Mejora del servicio:</strong> Analizar el uso para mejorar la experiencia de usuario y corregir errores.</li>
      <li><strong>Publicidad:</strong> Mostrar anuncios personalizados mediante Google AdSense (solo con su consentimiento explícito).</li>
      <li><strong>Cumplimiento legal:</strong> Cumplir con obligaciones legales aplicables, especialmente en materia de protección de datos.</li>
    </ul>
    
    <h2>4. Base Jurídica</h2>
    <p>El tratamiento de sus datos se basa en:</p>
    <ul>
      <li><strong>Consentimiento:</strong> Para cookies de publicidad y análisis (puede retirarlo en cualquier momento).</li>
      <li><strong>Ejecución de contrato:</strong> Para proporcionar el servicio de juego que solicita.</li>
      <li><strong>Interés legítimo:</strong> Para mejorar el servicio y garantizar su seguridad técnica.</li>
    </ul>
    
    <h2>5. Conservación de Datos</h2>
    <p>Los datos se conservan durante el tiempo estrictamente necesario:</p>
    <ul>
      <li><strong>Datos de juego local:</strong> No se almacenan en nuestros servidores, solo en su dispositivo.</li>
      <li><strong>Datos de salas online:</strong> Se eliminan automáticamente cuando la sala se cierra o tras 24 horas de inactividad.</li>
      <li><strong>Cookies:</strong> Según la política de cada proveedor (Google AdSense: hasta 2 años).</li>
      <li><strong>Logs técnicos:</strong> Se conservan durante 30 días para fines de seguridad.</li>
    </ul>
    
    <h2>6. Compartir Datos con Terceros</h2>
    <p>Compartimos datos únicamente con los siguientes proveedores de servicios:</p>
    <ul>
      <li><strong>Google AdSense:</strong> Para mostrar publicidad personalizada. Google puede utilizar cookies y tecnologías similares según su propia política de privacidad.</li>
      <li><strong>Google Gemini AI:</strong> Para generar palabras personalizadas. Las consultas se envían a Google, que puede procesarlas según su política de privacidad.</li>
      <li><strong>Cloudflare:</strong> Para hosting, CDN y servicios de red. Cloudflare procesa datos técnicos según su política de privacidad.</li>
    </ul>
    <p>No vendemos ni alquilamos sus datos personales a terceros con fines comerciales.</p>
    
    <h2>7. Transferencias Internacionales</h2>
    <p>Algunos de nuestros proveedores (Google, Cloudflare) pueden procesar datos fuera del Espacio Económico Europeo. Estas transferencias se realizan con garantías adecuadas según el Reglamento General de Protección de Datos (RGPD).</p>
    
    <h2>8. Sus Derechos</h2>
    <p>Usted tiene derecho a:</p>
    <ul>
      <li><strong>Acceso:</strong> Obtener información sobre qué datos personales tratamos.</li>
      <li><strong>Rectificación:</strong> Corregir datos inexactos o incompletos.</li>
      <li><strong>Supresión:</strong> Solicitar la eliminación de sus datos cuando ya no sean necesarios.</li>
      <li><strong>Oposición:</strong> Oponerse al tratamiento de sus datos para ciertas finalidades.</li>
      <li><strong>Limitación:</strong> Solicitar la limitación del tratamiento en determinadas circunstancias.</li>
      <li><strong>Portabilidad:</strong> Recibir sus datos en formato estructurado.</li>
      <li><strong>Retirar consentimiento:</strong> En cualquier momento, sin afectar al tratamiento anterior.</li>
    </ul>
    <p>Para ejercer estos derechos, puede contactarnos a través de los medios indicados en la sección de contacto.</p>
    
    <h2>9. Seguridad</h2>
    <p>Implementamos medidas técnicas y organizativas apropiadas para proteger sus datos personales contra acceso no autorizado, pérdida, destrucción o alteración. Sin embargo, ningún sistema es completamente seguro y no podemos garantizar la seguridad absoluta.</p>
    
    <h2>10. Menores de Edad</h2>
    <p>Nuestro servicio está dirigido a usuarios mayores de 13 años. Si es menor de edad, debe obtener el consentimiento de sus padres o tutores antes de utilizar el servicio. No recopilamos intencionalmente datos de menores sin el consentimiento parental adecuado.</p>
    
    <h2>11. Modificaciones de esta Política</h2>
    <p>Nos reservamos el derecho de modificar esta política de privacidad. Las modificaciones se publicarán en esta página con la fecha de última actualización. Le recomendamos revisar periódicamente esta política.</p>
    
    <h2>12. Contacto y Reclamaciones</h2>
    <p>Para cualquier consulta, ejercicio de derechos o reclamación relacionada con el tratamiento de sus datos personales, puede contactarnos a través de los medios disponibles en el sitio web.</p>
    <p>También tiene derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD) si considera que el tratamiento de sus datos no se ajusta a la normativa vigente.</p>
    
    <p><strong>Agencia Española de Protección de Datos</strong><br>
    C/ Jorge Juan, 6 - 28001 Madrid<br>
    Teléfono: 912 663 517<br>
    Web: <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">www.aepd.es</a></p>
    
    <p><em>Última actualización: ${(() => { const d = new Date(); const m = d.toLocaleDateString('es-ES', { month: 'long' }); return m.charAt(0).toUpperCase() + m.slice(1) + ' de ' + d.getFullYear(); })()}</em></p>
  `,

  'legal.terms.title': 'Términos y Condiciones de Uso',
  'legal.terms.content': `
    <h2>1. Aceptación de los Términos</h2>
    <p>Al acceder, navegar o utilizar el sitio web És Impostor (en adelante, "el Sitio" o "el Servicio"), propiedad de MaxSM, usted acepta quedar vinculado por estos Términos y Condiciones de Uso (en adelante, "los Términos"). Si no está de acuerdo con alguno de estos términos, le rogamos que no utilice el Servicio.</p>
    
    <h2>2. Descripción del Servicio</h2>
    <p>És Impostor es un juego web de deducción social que permite a los usuarios jugar localmente (pasando el dispositivo entre jugadores) u online (cada jugador en su propio dispositivo). El juego incluye funcionalidades como:</p>
    <ul>
      <li>Generación de palabras secretas a partir de categorías predefinidas</li>
      <li>Generación de palabras personalizadas mediante inteligencia artificial (Google Gemini)</li>
      <li>Creación de salas online multijugador</li>
      <li>Publicidad mediante Google AdSense</li>
    </ul>
    
    <h2>3. Uso Aceptable</h2>
    <p>Usted se compromete a utilizar el Servicio de manera responsable y de acuerdo con la ley. Específicamente, se compromete a:</p>
    <ul>
      <li>No utilizar el Servicio para fines ilegales, fraudulentos o que infrinjan derechos de terceros</li>
      <li>No intentar acceder a sistemas, datos o áreas no autorizadas del Servicio</li>
      <li>No interferir, interrumpir o dañar el funcionamiento del Servicio o los servidores que lo alojan</li>
      <li>No utilizar bots, scripts automatizados o cualquier medio para manipular el Servicio</li>
      <li>No transmitir virus, malware o código malicioso</li>
      <li>Respetar a otros usuarios y no realizar acoso, amenazas o comportamientos inapropiados</li>
      <li>No utilizar nombres de usuario ofensivos, discriminatorios o que infrinjan derechos de terceros</li>
      <li>No intentar eludir o deshabilitar medidas de seguridad del Servicio</li>
    </ul>
    
    <h2>4. Contenido Generado por Inteligencia Artificial</h2>
    <p>El Servicio utiliza Google Gemini AI para generar palabras personalizadas cuando los usuarios solicitan temas personalizados. Usted reconoce y acepta que:</p>
    <ul>
      <li>No garantizamos la precisión, idoneidad, corrección política o adecuación del contenido generado por IA</li>
      <li>El contenido generado puede no ser siempre apropiado para todos los públicos</li>
      <li>Usted es responsable del uso que haga del contenido generado</li>
      <li>No nos hacemos responsables de cualquier consecuencia derivada del uso de contenido generado por IA</li>
      <li>Si encuentra contenido inapropiado, puede reportarlo, pero no garantizamos su eliminación inmediata</li>
    </ul>
    
    <h2>5. Modo Online y Salas Multijugador</h2>
    <p>Al utilizar el modo online, usted acepta que:</p>
    <ul>
      <li>Los datos de la sala (jugadores, estado del juego) se almacenan temporalmente en nuestros servidores</li>
      <li>No garantizamos la disponibilidad continua del servicio online</li>
      <li>Podemos cerrar salas inactivas o que violen estos términos</li>
      <li>Usted es responsable de mantener la confidencialidad de los códigos de sala</li>
      <li>No nos hacemos responsables de las acciones de otros usuarios en las salas</li>
    </ul>
    
    <h2>6. Publicidad</h2>
    <p>El Servicio muestra publicidad mediante Google AdSense. Usted acepta que:</p>
    <ul>
      <li>La publicidad es una parte integral del modelo de negocio del Servicio</li>
      <li>Google puede utilizar cookies y tecnologías de seguimiento según su propia política de privacidad</li>
      <li>Puede gestionar sus preferencias de publicidad mediante el banner de consentimiento</li>
      <li>No nos hacemos responsables del contenido de los anuncios mostrados por Google</li>
    </ul>
    
    <h2>7. Propiedad Intelectual</h2>
    <p>Todo el contenido del Sitio, incluyendo pero no limitado a diseño, código fuente, textos, gráficos, logotipos, iconos, imágenes, compilaciones de datos y software, es propiedad de MaxSM o de sus licenciantes y está protegido por leyes de propiedad intelectual españolas e internacionales.</p>
    <p>Se le concede una licencia limitada, no exclusiva, no transferible y revocable para acceder y utilizar el Servicio únicamente para fines personales y no comerciales. Esta licencia no incluye:</p>
    <ul>
      <li>El derecho a reproducir, distribuir, modificar o crear obras derivadas</li>
      <li>El derecho a utilizar el contenido con fines comerciales</li>
      <li>El derecho a realizar ingeniería inversa o descompilar el código</li>
    </ul>
    
    <h2>8. Limitación de Responsabilidad</h2>
    <p>EL SERVICIO SE PROPORCIONA "TAL CUAL" Y "SEGÚN DISPONIBILIDAD", SIN GARANTÍAS DE NINGÚN TIPO, EXPRESAS O IMPLÍCITAS, INCLUYENDO PERO NO LIMITADO A GARANTÍAS DE COMERCIABILIDAD, IDONEIDAD PARA UN PROPÓSITO PARTICULAR O NO INFRACCIÓN.</p>
    <p>No garantizamos que:</p>
    <ul>
      <li>El Servicio esté disponible de forma ininterrumpida o libre de errores</li>
      <li>Los defectos se corrijan</li>
      <li>El Servicio esté libre de virus u otros componentes dañinos</li>
      <li>Los resultados obtenidos del uso del Servicio sean precisos o fiables</li>
    </ul>
    <p>En ningún caso seremos responsables de daños directos, indirectos, incidentales, especiales, consecuentes o punitivos, incluyendo pero no limitado a pérdida de beneficios, datos, uso, buena voluntad u otras pérdidas intangibles, resultantes de:</p>
    <ul>
      <li>El uso o la imposibilidad de usar el Servicio</li>
      <li>El acceso no autorizado o la alteración de sus transmisiones o datos</li>
      <li>Declaraciones o conductas de terceros en el Servicio</li>
      <li>Cualquier otro asunto relacionado con el Servicio</li>
    </ul>
    
    <h2>9. Indemnización</h2>
    <p>Usted acepta indemnizar, defender y mantener indemne a MaxSM, sus afiliados, licenciantes y proveedores de servicios, así como a sus respectivos directores, funcionarios, empleados, contratistas, agentes, licenciantes y proveedores, de y contra todas las reclamaciones, responsabilidades, daños, pérdidas, costos, gastos y honorarios (incluyendo honorarios razonables de abogados) que surjan de o estén relacionados con:</p>
    <ul>
      <li>Su uso del Servicio</li>
      <li>Su violación de estos Términos</li>
      <li>Su violación de cualquier derecho de terceros</li>
      <li>Cualquier contenido que envíe, publique o transmita a través del Servicio</li>
    </ul>
    
    <h2>10. Modificaciones del Servicio y de los Términos</h2>
    <p>Nos reservamos el derecho de:</p>
    <ul>
      <li>Modificar, suspender o discontinuar el Servicio (o cualquier parte del mismo) en cualquier momento, con o sin previo aviso</li>
      <li>Modificar estos Términos en cualquier momento</li>
      <li>Establecer límites de uso o restricciones de acceso al Servicio</li>
    </ul>
    <p>Las modificaciones de los Términos entrarán en vigor inmediatamente después de su publicación en el Sitio. Su uso continuado del Servicio después de dichas modificaciones constituye su aceptación de los Términos modificados.</p>
    
    <h2>11. Terminación</h2>
    <p>Podemos terminar o suspender su acceso al Servicio inmediatamente, sin previo aviso o responsabilidad, por cualquier motivo, incluyendo pero no limitado a si usted incumple estos Términos.</p>
    <p>Tras la terminación, su derecho a utilizar el Servicio cesará inmediatamente. Todas las disposiciones de estos Términos que por su naturaleza deban sobrevivir a la terminación sobrevivirán, incluyendo las disposiciones sobre propiedad intelectual, limitación de responsabilidad e indemnización.</p>
    
    <h2>12. Ley Aplicable y Jurisdicción</h2>
    <p>Estos Términos se rigen e interpretan de acuerdo con las leyes de España, sin tener en cuenta sus disposiciones sobre conflictos de leyes.</p>
    <p>Cualquier disputa que surja de o esté relacionada con estos Términos o el Servicio será sometida a la jurisdicción exclusiva de los tribunales de España.</p>
    
    <h2>13. Disposiciones Generales</h2>
    <p>Si alguna disposición de estos Términos se considera inválida o inaplicable, las disposiciones restantes permanecerán en pleno vigor y efecto. Estos Términos constituyen el acuerdo completo entre usted y MaxSM respecto al uso del Servicio.</p>
    
    <h2>14. Contacto</h2>
    <p>Para cualquier pregunta sobre estos Términos, puede contactarnos a través de los medios disponibles en el sitio web.</p>
    
    <p><em>Última actualización: ${(() => { const d = new Date(); const m = d.toLocaleDateString('es-ES', { month: 'long' }); return m.charAt(0).toUpperCase() + m.slice(1) + ' de ' + d.getFullYear(); })()}</em></p>
  `,

  'legal.cookies.title': 'Política de Cookies',
  'legal.cookies.content': `
    <h2>1. ¿Qué son las Cookies?</h2>
    <p>Las cookies son pequeños archivos de texto que se almacenan en su dispositivo (ordenador, tablet, smartphone) cuando visita nuestro sitio web. Las cookies permiten que el sitio web recuerde sus acciones y preferencias durante un período de tiempo, por lo que no tiene que volver a configurarlas cada vez que regrese al sitio o navegue de una página a otra.</p>
    
    <h2>2. Tipos de Cookies que Utilizamos</h2>
    
    <h3>2.1. Según su Finalidad</h3>
    
    <h4>Cookies Técnicas o Esenciales</h4>
    <p>Son necesarias para el funcionamiento básico del sitio web y no se pueden desactivar. Incluyen:</p>
    <ul>
      <li>Cookies de sesión para mantener su sesión activa mientras navega</li>
      <li>Cookies de seguridad para prevenir fraudes y proteger el sitio</li>
      <li>Cookies de preferencias de idioma y tema (claro/oscuro)</li>
    </ul>
    <p><strong>Base legal:</strong> Ejecución de contrato (prestación del servicio solicitado).</p>
    
    <h4>Cookies de Análisis</h4>
    <p>Nos ayudan a entender cómo los usuarios interactúan con el sitio web recopilando información de forma anónima sobre:</p>
    <ul>
      <li>Páginas visitadas y tiempo de permanencia</li>
      <li>Errores técnicos encontrados</li>
      <li>Patrones de uso del servicio</li>
    </ul>
    <p>Esta información nos permite mejorar el servicio y la experiencia del usuario.</p>
    <p><strong>Base legal:</strong> Consentimiento del usuario (puede retirarse en cualquier momento).</p>
    
    <h4>Cookies de Publicidad</h4>
    <p>Utilizadas por Google AdSense para:</p>
    <ul>
      <li>Mostrar anuncios personalizados basados en sus intereses</li>
      <li>Limitar el número de veces que ve un anuncio</li>
      <li>Medir la efectividad de las campañas publicitarias</li>
      <li>Recordar sus preferencias de publicidad</li>
    </ul>
    <p><strong>Base legal:</strong> Consentimiento del usuario (puede retirarse en cualquier momento).</p>
    
    <h3>2.2. Según su Duración</h3>
    <ul>
      <li><strong>Cookies de sesión:</strong> Se eliminan automáticamente cuando cierra el navegador</li>
      <li><strong>Cookies persistentes:</strong> Permanecen en su dispositivo durante un período determinado (hasta 2 años para cookies de Google AdSense)</li>
    </ul>
    
    <h3>2.3. Según su Origen</h3>
    <ul>
      <li><strong>Cookies propias:</strong> Establecidas directamente por nuestro sitio web</li>
      <li><strong>Cookies de terceros:</strong> Establecidas por dominios externos (Google AdSense, Google Analytics)</li>
    </ul>
    
    <h2>3. Cookies Específicas que Utilizamos</h2>
    
    <h3>Cookies Propias</h3>
    <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
      <tr style="background: var(--color-bg-element);">
        <th style="padding: 8px; text-align: left; border: 1px solid var(--color-border);">Nombre</th>
        <th style="padding: 8px; text-align: left; border: 1px solid var(--color-border);">Finalidad</th>
        <th style="padding: 8px; text-align: left; border: 1px solid var(--color-border);">Duración</th>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid var(--color-border);">ads_consent</td>
        <td style="padding: 8px; border: 1px solid var(--color-border);">Almacena sus preferencias de consentimiento de cookies</td>
        <td style="padding: 8px; border: 1px solid var(--color-border);">1 año</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid var(--color-border);">ads_preferences</td>
        <td style="padding: 8px; border: 1px solid var(--color-border);">Almacena sus preferencias específicas de publicidad</td>
        <td style="padding: 8px; border: 1px solid var(--color-border);">1 año</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid var(--color-border);">esimpostor_hide_sticky_ad</td>
        <td style="padding: 8px; border: 1px solid var(--color-border);">Recuerda si ha ocultado el anuncio sticky en móvil</td>
        <td style="padding: 8px; border: 1px solid var(--color-border);">Sesión</td>
      </tr>
    </table>
    
    <h3>Cookies de Terceros (Google AdSense)</h3>
    <p>Google AdSense utiliza diversas cookies para personalizar anuncios y medir su efectividad. Algunas de las principales incluyen:</p>
    <ul>
      <li><strong>__gads, __gpi:</strong> Cookies de publicidad de Google (hasta 2 años)</li>
      <li><strong>IDE:</strong> Cookie de DoubleClick para publicidad (hasta 2 años)</li>
      <li><strong>test_cookie:</strong> Cookie de prueba de DoubleClick (sesión)</li>
      <li>Otras cookies de seguimiento y medición según la política de Google</li>
    </ul>
    <p>Para información detallada sobre las cookies de Google AdSense, consulte: <a href="https://policies.google.com/technologies/cookies" target="_blank" rel="noopener noreferrer">Política de Cookies de Google</a></p>
    
    <h2>4. Gestión de Cookies</h2>
    
    <h3>4.1. A través del Banner de Consentimiento</h3>
    <p>Al visitar el sitio por primera vez, verá un banner de consentimiento donde puede:</p>
    <ul>
      <li>Aceptar todas las cookies</li>
      <li>Rechazar todas las cookies (excepto las esenciales)</li>
      <li>Gestionar sus preferencias individualmente</li>
    </ul>
    <p>Puede cambiar sus preferencias en cualquier momento haciendo clic en el banner de consentimiento o accediendo a la configuración de cookies.</p>
    
    <h3>4.2. A través de la Configuración del Navegador</h3>
    <p>También puede gestionar las cookies directamente desde la configuración de su navegador:</p>
    <ul>
      <li><strong>Chrome:</strong> Configuración > Privacidad y seguridad > Cookies y otros datos de sitios</li>
      <li><strong>Firefox:</strong> Opciones > Privacidad y seguridad > Cookies y datos del sitio</li>
      <li><strong>Safari:</strong> Preferencias > Privacidad > Cookies y datos de sitios web</li>
      <li><strong>Edge:</strong> Configuración > Cookies y permisos de sitio > Cookies y datos del sitio</li>
    </ul>
    <p><strong>Nota importante:</strong> Desactivar las cookies esenciales puede afectar el funcionamiento del sitio web.</p>
    
    <h2>5. Cookies y Dispositivos Móviles</h2>
    <p>En dispositivos móviles, las cookies funcionan de manera similar. Puede gestionar las cookies a través de:</p>
    <ul>
      <li>La configuración del navegador móvil</li>
      <li>El banner de consentimiento del sitio web</li>
      <li>Las opciones de privacidad del sistema operativo</li>
    </ul>
    
    <h2>6. Tecnologías Similares</h2>
    <p>Además de cookies, utilizamos tecnologías similares como:</p>
    <ul>
      <li><strong>Local Storage:</strong> Para almacenar preferencias de usuario (tema, idioma) localmente en su dispositivo</li>
      <li><strong>Session Storage:</strong> Para datos temporales de sesión</li>
      <li><strong>Web Beacons/Pixels:</strong> Utilizados por Google AdSense para medir la efectividad de los anuncios</li>
    </ul>
    
    <h2>7. Actualizaciones de esta Política</h2>
    <p>Podemos actualizar esta política de cookies ocasionalmente para reflejar cambios en las cookies que utilizamos o por otras razones operativas, legales o regulatorias. Le recomendamos revisar esta página periódicamente.</p>
    
    <h2>8. Más Información</h2>
    <p>Para más información sobre cómo gestionamos sus datos personales, consulte nuestra Política de Privacidad.</p>
    <p>Para información sobre las cookies de Google, visite: <a href="https://policies.google.com/technologies/cookies" target="_blank" rel="noopener noreferrer">https://policies.google.com/technologies/cookies</a></p>
    <p>Para optar por no recibir anuncios personalizados de Google, visite: <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Configuración de anuncios de Google</a></p>
    
    <p><em>Última actualización: ${(() => { const d = new Date(); const m = d.toLocaleDateString('es-ES', { month: 'long' }); return m.charAt(0).toUpperCase() + m.slice(1) + ' de ' + d.getFullYear(); })()}</em></p>
  `,

  'legal.legal.title': 'Aviso Legal',
  'legal.legal.content': `
    <h2>1. Datos Identificativos</h2>
    <p>En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico, se informa de los siguientes datos:</p>
    <ul>
      <li><strong>Denominación:</strong> És Impostor</li>
      <li><strong>Desarrollador:</strong> MaxSM</li>
      <li><strong>Naturaleza:</strong> Aplicación web de entretenimiento</li>
      <li><strong>Dominio:</strong> El servicio está alojado en Cloudflare Pages</li>
    </ul>
    
    <h2>2. Objeto y Condiciones Generales de Uso</h2>
    <p>El presente aviso legal regula el uso del sitio web És Impostor (en adelante, "el Sitio"), que es un juego web de deducción social accesible a través de Internet.</p>
    <p>El acceso y uso del Sitio implica la aceptación plena y sin reservas de todas las disposiciones incluidas en este aviso legal. Si no está de acuerdo con alguna de estas condiciones, debe abstenerse de utilizar el Sitio.</p>
    
    <h2>3. Propiedad Intelectual e Industrial</h2>
    <p>Todos los contenidos del Sitio, incluyendo pero no limitándose a textos, gráficos, imágenes, iconos, tecnología, software, así como su diseño gráfico y códigos fuente, constituyen una obra cuya propiedad pertenece a MaxSM, y están protegidos por la legislación nacional e internacional aplicable en materia de propiedad intelectual e industrial.</p>
    <p>Queda expresamente prohibida la reproducción, distribución, comunicación pública y transformación, total o parcial, de los contenidos del Sitio, para fines comerciales, en cualquier soporte y por cualquier medio técnico, sin la autorización de MaxSM.</p>
    <p>Las marcas, nombres comerciales o signos distintivos de cualquier clase contenidos en el Sitio son también propiedad de MaxSM, sin que pueda entenderse que el uso o acceso al Sitio atribuya al usuario derecho alguno sobre los citados signos distintivos.</p>
    
    <h2>4. Servicios de Terceros</h2>
    <p>El Sitio utiliza los siguientes servicios de terceros para su funcionamiento:</p>
    
    <h3>4.1. Google AdSense</h3>
    <p>Servicio de publicidad proporcionado por Google LLC ("Google") que permite mostrar anuncios en el Sitio. Google utiliza cookies y tecnologías similares para personalizar anuncios y medir su efectividad.</p>
    <ul>
      <li><strong>Política de Privacidad:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">https://policies.google.com/privacy</a></li>
      <li><strong>Términos de Servicio:</strong> <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">https://policies.google.com/terms</a></li>
    </ul>
    
    <h3>4.2. Google Gemini AI</h3>
    <p>Servicio de inteligencia artificial proporcionado por Google que permite generar palabras personalizadas cuando los usuarios solicitan temas personalizados.</p>
    <ul>
      <li><strong>Política de Privacidad:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">https://policies.google.com/privacy</a></li>
      <li><strong>Términos de Servicio:</strong> <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">https://policies.google.com/terms</a></li>
    </ul>
    
    <h3>4.3. Cloudflare</h3>
    <p>Servicios de infraestructura proporcionados por Cloudflare, Inc. que incluyen:</p>
    <ul>
      <li><strong>Cloudflare Pages:</strong> Hosting y despliegue del sitio web</li>
      <li><strong>Cloudflare Workers:</strong> Servicios de backend y API</li>
      <li><strong>Cloudflare Durable Objects:</strong> Almacenamiento temporal de datos de salas online</li>
      <li><strong>CDN y servicios de red:</strong> Distribución de contenido y optimización</li>
    </ul>
    <ul>
      <li><strong>Política de Privacidad:</strong> <a href="https://www.cloudflare.com/privacy/" target="_blank" rel="noopener noreferrer">https://www.cloudflare.com/privacy/</a></li>
      <li><strong>Términos de Servicio:</strong> <a href="https://www.cloudflare.com/terms/" target="_blank" rel="noopener noreferrer">https://www.cloudflare.com/terms/</a></li>
    </ul>
    
    <h2>5. Exención de Responsabilidad</h2>
    <p>MaxSM no se hace responsable de:</p>
    <ul>
      <li><strong>Disponibilidad y continuidad:</strong> No garantizamos la disponibilidad y continuidad del funcionamiento del Sitio. El servicio puede interrumpirse por mantenimiento, actualizaciones o causas técnicas.</li>
      <li><strong>Contenido generado por IA:</strong> No nos responsabilizamos del contenido generado por Google Gemini AI, que puede no ser siempre apropiado, preciso o adecuado.</li>
      <li><strong>Contenido de terceros:</strong> No nos responsabilizamos del contenido de los anuncios mostrados por Google AdSense ni de los servicios proporcionados por terceros.</li>
      <li><strong>Pérdida de datos:</strong> No garantizamos la conservación de datos de partidas o salas online. Los datos pueden perderse por fallos técnicos o cierres de sesión.</li>
      <li><strong>Enlaces externos:</strong> El Sitio puede contener enlaces a sitios web de terceros. No controlamos ni nos responsabilizamos del contenido de estos sitios externos.</li>
      <li><strong>Uso indebido:</strong> No nos responsabilizamos del uso indebido que los usuarios puedan hacer del Sitio o de sus contenidos.</li>
      <li><strong>Virus y malware:</strong> Aunque implementamos medidas de seguridad, no podemos garantizar la ausencia de virus u otros elementos dañinos.</li>
    </ul>
    
    <h2>6. Modificaciones</h2>
    <p>MaxSM se reserva el derecho de realizar sin previo aviso las modificaciones que considere oportunas en el Sitio, pudiendo cambiar, suprimir o añadir tanto los contenidos y servicios que se presten a través del mismo como la forma en la que éstos aparezcan presentados o localizados.</p>
    <p>Asimismo, nos reservamos el derecho de modificar este aviso legal en cualquier momento. Las modificaciones entrarán en vigor desde su publicación en el Sitio.</p>
    
    <h2>7. Protección de Datos Personales</h2>
    <p>El tratamiento de datos personales se rige por nuestra Política de Privacidad, que cumple con el Reglamento General de Protección de Datos (RGPD) y la Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales.</p>
    
    <h2>8. Legislación Aplicable y Jurisdicción</h2>
    <p>Para la resolución de todas las controversias o cuestiones relacionadas con el presente aviso legal o de las relaciones entre el usuario y MaxSM, será de aplicación la legislación española, a la que se someten expresamente las partes, siendo competentes para la resolución de todos los conflictos derivados o relacionados con su uso los Juzgados y Tribunales de España.</p>
    
    <h2>9. Contacto</h2>
    <p>Para cualquier consulta, sugerencia o reclamación relacionada con este aviso legal o el funcionamiento del Sitio, puede contactarnos a través de los medios disponibles en el sitio web.</p>
    
    <h2>10. Versión</h2>
    <p>Este aviso legal fue actualizado por última vez en la fecha indicada al final del documento. Le recomendamos revisar periódicamente este aviso para estar informado de cualquier cambio.</p>
    
    <p><em>Última actualización: ${(() => { const d = new Date(); const m = d.toLocaleDateString('es-ES', { month: 'long' }); return m.charAt(0).toUpperCase() + m.slice(1) + ' de ' + d.getFullYear(); })()}</em></p>
  `,

  // Rules Page
  'rules.title': 'Reglas del Juego',
  'rules.button': 'Ver reglas',
  'rules.content': `
    <h2>📖 ¿Cómo se juega?</h2>
    <p>És Impostor es un juego de deducción social donde los jugadores deben descubrir quién es el impostor sin revelar la palabra secreta.</p>
    
    <h2>🎯 Objetivo del Juego</h2>
    <ul>
      <li><strong>Para los Civiles:</strong> Descubrir quién es el impostor votándolo correctamente.</li>
      <li><strong>Para el Impostor:</strong> Evitar ser descubierto y hacer que los civiles voten por otro jugador.</li>
    </ul>
    
    <h2>👥 Roles</h2>
    <h3>🟢 Civiles</h3>
    <ul>
      <li>Conocen la <strong>palabra secreta</strong> desde el inicio.</li>
      <li>Deben dar pistas sobre la palabra sin mencionarla directamente.</li>
      <li>Su objetivo es identificar al impostor durante la votación.</li>
    </ul>
    
    <h3>🔴 Impostor(es)</h3>
    <ul>
      <li><strong>NO conocen</strong> la palabra secreta.</li>
      <li>Pueden recibir una <strong>pista relacionada</strong> (si está habilitada en la configuración).</li>
      <li>Deben fingir que conocen la palabra y dar pistas convincentes.</li>
      <li>Su objetivo es pasar desapercibido y hacer que los civiles voten por otro jugador.</li>
    </ul>
    
    <h2>🎮 Desarrollo del Juego</h2>
    
    <h3>1️⃣ Fase de Configuración</h3>
    <ul>
      <li>Elige el número de jugadores (mínimo 3, recomendado 4-8).</li>
      <li>Selecciona cuántos impostores habrá (normalmente 1, pero puede haber más en partidas grandes).</li>
      <li>Elige el modo de juego:
        <ul>
          <li><strong>Aleatorio:</strong> Palabra de cualquier categoría.</li>
          <li><strong>Lista:</strong> Palabra de categorías específicas (animales, comida, películas, etc.).</li>
          <li><strong>IA Personalizada:</strong> Genera una palabra única basada en un tema que tú elijas.</li>
        </ul>
      </li>
      <li>Introduce los nombres de los jugadores.</li>
    </ul>
    
    <h3>2️⃣ Revelación de Roles</h3>
    <ul>
      <li>Cada jugador ve su rol y la información correspondiente:
        <ul>
          <li><strong>Civiles:</strong> Ven la palabra secreta.</li>
          <li><strong>Impostores:</strong> Ven que son impostores y su pista (si está habilitada).</li>
        </ul>
      </li>
      <li>Los roles se revelan uno por uno, pasando el dispositivo entre jugadores.</li>
      <li>⚠️ <strong>Importante:</strong> No reveles tu rol a los demás jugadores.</li>
    </ul>
    
    <h3>3️⃣ Fase de Pistas</h3>
    <ul>
      <li>Los jugadores dan pistas sobre la palabra secreta, uno por uno.</li>
      <li>Las pistas deben ser:
        <ul>
          <li>✅ Relacionadas con la palabra (para civiles).</li>
          <li>✅ Lo suficientemente vagas para no revelar la palabra directamente.</li>
          <li>✅ Convincentes (especialmente para impostores).</li>
        </ul>
      </li>
      <li>Ejemplo: Si la palabra es "ELEFANTE", buenas pistas serían: "grande", "trompa", "gris", "sabana".</li>
      <li>❌ No digas la palabra directamente ni uses palabras demasiado obvias.</li>
    </ul>
    
    <h3>4️⃣ Fase de Discusión</h3>
    <ul>
      <li>Después de todas las pistas, los jugadores debaten.</li>
      <li>Analiza las pistas dadas por cada jugador.</li>
      <li>Busca inconsistencias o pistas sospechosas.</li>
      <li>El impostor debe defender su posición y puede intentar acusar a otros.</li>
    </ul>
    
    <h3>5️⃣ Fase de Votación</h3>
    <ul>
      <li>Cada jugador vota por quién cree que es el impostor.</li>
      <li>Puedes votar por cualquier jugador, incluyéndote a ti mismo (aunque no tiene sentido).</li>
      <li>Una vez que todos han votado, se revelan los resultados.</li>
    </ul>
    
    <h3>6️⃣ Resultados</h3>
    <ul>
      <li><strong>Victoria de los Civiles:</strong> Si el jugador más votado es el impostor, los civiles ganan.</li>
      <li><strong>Victoria del Impostor:</strong> Si el jugador más votado NO es el impostor, el impostor gana.</li>
      <li>En caso de empate, el resultado puede variar según la configuración.</li>
    </ul>
    
    <h2>💡 Consejos y Estrategias</h2>
    
    <h3>Para Civiles:</h3>
    <ul>
      <li>Observa las pistas de todos los jugadores cuidadosamente.</li>
      <li>Busca pistas que no encajen con la palabra secreta.</li>
      <li>Presta atención a quién acusa a quién durante la discusión.</li>
      <li>No reveles la palabra secreta durante el debate.</li>
    </ul>
    
    <h3>Para Impostores:</h3>
    <ul>
      <li>Usa la pista proporcionada para dar pistas relacionadas pero vagas.</li>
      <li>Observa las pistas de los civiles para intentar adivinar la palabra.</li>
      <li>Actúa con confianza y no te pongas nervioso.</li>
      <li>Intenta acusar a otros jugadores para desviar la atención de ti.</li>
      <li>Si te acusan, defiéndete con calma y lógica.</li>
    </ul>
    
    <h2>🌐 Modo Online</h2>
    <p>En el modo online, cada jugador usa su propio dispositivo:</p>
    <ul>
      <li>Un jugador crea una sala y comparte el código con los demás.</li>
      <li>Los otros jugadores se unen usando el código de la sala.</li>
      <li>El juego se desarrolla de forma similar, pero cada jugador ve su información en su propio dispositivo.</li>
      <li>Las pistas y votos se sincronizan en tiempo real.</li>
    </ul>
    
    <h2>⚙️ Configuraciones Avanzadas</h2>
    <ul>
      <li><strong>Pista para Impostor:</strong> Si está habilitada, el impostor recibe una pista relacionada con la palabra para ayudarle a fingir mejor.</li>
      <li><strong>Número de Impostores:</strong> En partidas grandes (6+ jugadores), puedes tener múltiples impostores para mayor dificultad.</li>
      <li><strong>Temas Personalizados:</strong> Usa la IA para generar palabras únicas basadas en temas específicos que elijas.</li>
    </ul>
    
    <h2>🎲 Variantes del Juego</h2>
    <ul>
      <li><strong>Modo Clásico:</strong> Una palabra, un impostor, pistas simples.</li>
      <li><strong>Modo Desafiante:</strong> Múltiples impostores o sin pista para el impostor.</li>
      <li><strong>Modo Creativo:</strong> Usa temas personalizados con IA para palabras únicas y sorprendentes.</li>
    </ul>
    
    <p><em>¡Diviértete y buena suerte descubriendo al impostor!</em></p>
  `,

  // Online Game
  'online.turn.yours': '💭 Tu turno',
  'online.turn.others': '{icon} {name}',
  'online.hint.instruction': 'Di una pista en voz alta (sin decir la palabra) y escríbela aquí',
  'online.hint.waiting': 'Esperando a que {player} escriba su pista...',
  'online.vote.yours': '🗳️ Tu turno de votar',
  'online.vote.instruction': 'Tras debatir, vota: ¿quién crees que es el impostor?',
  'online.vote.waiting': 'Esperando a que {player} vote...',
  'online.role.impostor': '🎭 Impostor',
  'online.role.civil': '✅ Civil',
  'online.secretWord': 'Palabra: {word}',
  'online.impostorWarning': 'No conoces la palabra. Intenta adivinarla basándote en las pistas.',
  'online.placeholder': 'Escribe tu pista...',
  'online.send': 'Enviar',
  'online.yourHint': 'Tu pista: "{hint}"',
  'online.hintsReceived': 'Pistas recibidas:',
  'online.typing': 'Escribiendo...',
  'online.pending': 'Pendiente',
  'online.votedAlready': '✅ Ya votaste',
  'online.votedFor': 'Votaste por: {player}',
  'online.confirmVote': 'Confirmar voto',
  'online.votes': 'Votos:',
  'online.allHints': 'Pistas de todos:',
  'online.noHint': 'Sin pista',
  // New online game translations
  'online.lobby.title': 'Sala de espera',
  'online.lobby.ready': 'Listo',
  'online.lobby.notReady': 'No listo',
  'online.lobby.toggleReady': 'Cambiar estado',
  'online.lobby.waitingAll': 'Esperando que todos estén listos...',
  'online.lobby.allReady': '¡Todos listos!',
  'online.lobby.startGame': 'Iniciar partida',
  'online.lobby.host': 'Anfitrión',
  'online.lobby.you': '(Tú)',
  'online.lobby.kick': 'Expulsar',
  'online.lobby.connected': 'Conectado',
  'online.lobby.disconnected': 'Desconectado',
  'online.lobby.minPlayers': 'Mínimo 3 jugadores',
  'online.lobby.changeIcon': 'Cambiar icono',
  'online.reveal.title': 'Tu carta',
  'online.reveal.tapToSee': 'Toca para ver tu rol',
  'online.reveal.youAre': 'Eres',
  'online.reveal.civil': 'CIVIL',
  'online.reveal.impostor': 'IMPOSTOR',
  'online.reveal.secretWord': 'La palabra secreta es:',
  'online.reveal.noWord': '???',
  'online.reveal.clue': 'Tu pista:',
  'online.reveal.understood': 'Entendido',
  'online.reveal.waiting': 'Esperando a que todos vean su carta...',
  'online.hints.title': 'Ronda de pistas',
  'online.hints.instruction': 'Todos dan su pista a la vez',
  'online.hints.yourHint': 'Tu pista',
  'online.hints.submit': 'Enviar pista',
  'online.hints.sent': 'Pista enviada ✓',
  'online.hints.waitingOthers': 'Esperando a los demás...',
  'online.hints.playerSent': 'Enviada',
  'online.hints.playerPending': 'Pensando...',
  'online.vote.title': 'Votación',
  'online.vote.chooseImpostor': '¿Quién es el impostor?',
  'online.vote.confirm': 'Votar',
  'online.vote.waitingAll': 'Esperando votos...',
  'online.vote.voted': 'votos',
  'online.vote.waitingOthers': 'Esperando a que los demás voten...',
  'online.suspect': 'Sospecho',
  'online.suspects': 'sospechas',

  // Admin panel
  'admin.title': 'Panel de Control',
  'admin.subtitle': 'Gestión y estadísticas del servidor',
  'admin.pinLabel': 'PIN de administrador',
  'admin.pinPlaceholder': '',
  'admin.view': 'Acceder',
  'admin.pinRequired': 'Introduce el PIN',
  'admin.unauthorized': 'PIN incorrecto',
  'admin.networkError': 'No se pudo cargar el panel',
  'admin.statsTitle': 'Uso en tiempo real',
  'admin.totalRooms': 'Salas totales',
  'admin.publicRooms': 'Salas activas',
  'admin.geminiCalls': 'Gemini API',
  'admin.lastUpdate': 'Última actualización',
  'admin.publicRoomsList': 'Salas públicas',
  'admin.code': 'Código',
  'admin.players': 'Jugadores',
  'admin.name': 'Nombre',
  'admin.topic': 'Tema',
  'admin.ageMinutes': 'Minutos abierta',
  'admin.closeRoom': 'Cerrar',
  'admin.closing': 'Cerrando...',
  'admin.geminiNearLimit': '⚠️ Uso de Gemini cerca del límite diario. Se usará fallback local si se supera.',
  'admin.refresh': 'Actualizar',
  'admin.logout': 'Cerrar sesión',
  'admin.noRooms': 'No hay salas públicas activas',
};

const ca: Dictionary = {
  // Brand
  'brand.subtitle': 'Qui menteix?',
  'pill.local': 'Joc local',

  // Home
  'home.title': 'Benvingut!',
  'home.subtitle': 'Descobreix qui és l\'impostor sense revelar la paraula secreta.',
  'home.localGame': 'Jugar aquí',
  'home.localGame.desc': 'Passeu el mòbil/tablet entre jugadors',
  'home.onlineGame': 'Jugar online',
  'home.onlineGame.desc': 'Cada jugador al seu dispositiu',
  'home.comingSoon': 'Properament',

  // Setup
  'setup.title': 'Jugar aquí',
  'setup.subtitle': 'Configura la teva partida',
  'setup.basic': 'Configuració bàsica',
  'setup.numPlayers': 'Jugadors',
  'setup.numImpostors': 'Impostors',
  'setup.clueDesc': 'L\'impostor rep una pista similar a la paraula',
  'setup.player': 'Jugador',
  'setup.players': 'Jugadors',
  'setup.addPlayer': 'Afegir jugador',
  'setup.playerName': 'Nom',
  'setup.playerIcon': 'Icona',
  'setup.selectIcon': 'Tria una icona',
  'setup.mode': 'Mode de joc',
  'setup.topic': 'Tema personalitzat',
  'setup.topic.placeholder': 'Ex: Pel·lícules de por',
  'setup.clue': 'Pista',
  'setup.start': 'Començar partida',
  'setup.back': 'Tornar',
  'setup.minPlayers': 'Mínim 3 jugadors',
  'setup.maxImpostors': 'Màxim {max} impostors',
  'setup.next': 'SEGÜENT',

  // Modes
  'mode.list': 'Llistes',
  'mode.ai': 'IA personalitzada',
  'mode.list.helper': 'Paraula secreta de llistes predefinides',
  'mode.ai.helper': 'La IA genera la paraula segons el teu tema',

  // Categories / Themes
  'cat.general': 'General',
  'cat.animals': 'Animals',
  'cat.food': 'Menjar',
  'cat.movies': 'Pel·lícules',
  'cat.sports': 'Esports',
  'cat.places': 'Llocs',
  'cat.professions': 'Professions',
  'cat.technology': 'Tecnologia',
  'cat.music': 'Música',
  'cat.history': 'Història',
  'cat.school': 'Escola',
  'cat.family': 'Família',
  'cat.actions': 'Accions',
  'cat.nature': 'Natura',
  'cat.fantasy': 'Fantasia',
  'cat.science': 'Ciència',
  'cat.art': 'Art',
  'cat.space': 'Espai',
  'cat.games': 'Videojocs',
  'cat.vehicles': 'Vehicles',
  'cat.clothes': 'Roba',
  'cat.objects': 'Objectes',
  'cat.body': 'Cos',

  // Theme selector
  'theme.title': 'Temes',
  'theme.subtitle': 'Selecciona un o diversos temes. Les paraules sortiran dels temes seleccionats.',
  'theme.random': 'Aleatori',
  'theme.randomDesc': 'Barreja tots els temes disponibles',
  'theme.selectedOne': 'Tema seleccionat',
  'theme.selectedMany': 'Temes seleccionats',
  'theme.or': 'O',
  'theme.custom': 'Tema personalitzat',
  'theme.custom.desc': 'Crea un tema personalitzat amb IA',
  'theme.custom.placeholder': 'Ex: Superherois, Videojocs...',
  'theme.custom.send': 'Crear',
  'ai.adNotice': 'Es mostrarà un breu anunci',
  'ads.interstitial.generating': 'Generant...',
  'ads.interstitial.wait': 'Si us plau espera mentre creem la teva paraula personalitzada',

  // Turn reveal
  'turn.title': 'Torn de {player}',
  'turn.passDevice': 'Passa el dispositiu a {player}',
  'turn.tapToReveal': 'Toca per veure el teu rol',
  'turn.yourRole': 'El teu rol',
  'turn.youAreCivil': 'Ets CIVIL!',
  'turn.youAreImpostor': 'Ets IMPOSTOR!',
  'turn.memorized': 'Memoritzat',
  'turn.secretWord': 'La paraula secreta és:',
  'turn.noWord': 'No coneixes la paraula secreta. Dissimula!',
  'turn.clue': 'Pista:',
  'turn.understood': 'Entès',
  'turn.next': 'Següent jugador',
  'turn.startVote': 'Anar a votació',

  // Vote
  'vote.title': 'Qui és l\'impostor?',
  'vote.subtitle': 'Cada jugador vota en secret',
  'vote.turn': 'Vota {player}',
  'vote.passDevice': 'Passa el dispositiu a {player}',
  'vote.tapToVote': 'Toca per votar',
  'vote.selectImpostor': 'Selecciona l\'impostor',
  'vote.confirm': 'Confirmar vot',
  'vote.next': 'Següent votant',
  'vote.seeResults': 'Veure resultats',

  // Discussion
  'discussion.title': 'Hora de discutir!',
  'discussion.subtitle': 'Tots els jugadors donen pistes sobre la paraula secreta. L\'impostor ha de dissimular sense conèixer-la.',
  'discussion.hint': 'Quan acabeu de debatre, premeu per veure el resum de la partida.',
  'discussion.reveal': 'Revelar',

  // Results
  'results.title': 'Resultats',
  'results.summary': 'Resum',
  'results.civils': 'Civils',
  'results.civilsWin': 'Els civils guanyen!',
  'results.impostorWins': 'L\'impostor guanya!',
  'results.theImpostor': 'Impostors',
  'results.theWord': 'La paraula secreta',
  'results.theClue': 'La pista',
  'results.votes': 'Votació',
  'results.playAgain': 'Tornar a jugar',
  'results.backHome': 'Tornar a l\'inici',

  // Ads
  'ads.sidebar': 'Publicitat',
  'ads.sticky': 'Publicitat',
  'ads.interstitial.title': 'Publicitat',
  'ads.interstitial.body': 'El teu tema personalitzat es generarà en continuar',
  'ads.interstitial.btn': 'Generar',
  'ads.footer': 'Publicitat',

  // Online
  'online.title': 'Jugar online',
  'online.subtitle': 'Uneix-te a una sala o crea una de nova',
  'online.yourInfo': 'La teva informació',
  'online.yourName': 'El teu nom',
  'online.namePlaceholder': 'Escriu el teu nom',
  'online.joinRoom': 'Unir-se',
  'online.createRoom': 'Crear',
  'online.roomName': 'Nom de la sala',
  'online.roomNamePlaceholder': 'Ex: Amics',
  'online.roomNameRequired': 'Posa un nom a la sala',
  'online.unnamedRoom': 'Sala sense nom',
  'online.roomCode': 'Codi de sala',
  'online.join': 'Unir-se',
  'online.publicRooms': 'Sales Públiques',
  'online.noRooms': 'No hi ha sales públiques disponibles',
  'online.players': 'jugadors',
  'online.full': 'Plena',
  'online.makePublic': 'Sala pública',
  'online.publicDesc': 'Apareix a la llista perquè altres s\'uneixin',
  'online.refresh': 'Actualitzar',
  'online.createOne': 'Crea una sala nova a la pestanya "Crear"',
  'online.available': 'Disponible',
  'online.creating': 'Creant sala...',
  'online.loadingRooms': 'Carregant sales...',
  'online.autoRefresh': 'Actualització automàtica cada 8s',
  'online.filter.available': 'Disponibles',
  'online.filter.all': 'Totes',
  'online.room.full': 'Plena',
  'online.room.spots': 'llocs',
  'theme.selectedHint': 'Les paraules sortiran d\'aquests temes',
  'lobby.roomCode': 'Codi de sala',
  'lobby.waitingPlayers': 'Esperant jugadors',

  // Footer
  'footer.privacy': 'Privacitat',
  'footer.terms': 'Termes',
  'footer.cookies': 'Cookies',
  'footer.legal': 'Avís Legal',
  'footer.credits': '© 2025 · És Impostor · MaxSM',

  // Consent
  'consent.text': 'Utilitzem cookies i tecnologies similars per mostrar anuncis personalitzats i analitzar el trànsit del lloc. En fer clic a "Consentir", acceptes el nostre ús de cookies.',
  'consent.deny': 'No consentir',
  'consent.accept': 'Consentir',
  'consent.manage': 'Gestionar opcions',
  'consent.manage.title': 'Gestionar preferències de cookies',
  'consent.manage.desc': 'Pots triar quins tipus de cookies acceptar. Les cookies essencials són necessàries per al funcionament del lloc.',
  'consent.pref.ad_storage': 'Emmagatzematge d\'anuncis',
  'consent.pref.ad_storage.desc': 'Permet mostrar anuncis personalitzats',
  'consent.pref.ad_user_data': 'Dades d\'usuari per a anuncis',
  'consent.pref.ad_user_data.desc': 'Compartir dades amb anunciants',
  'consent.pref.ad_personalization': 'Personalització d\'anuncis',
  'consent.pref.ad_personalization.desc': 'Anuncis basats en els teus interessos',
  'consent.pref.analytics_storage': 'Emmagatzematge d\'anàlisi',
  'consent.pref.analytics_storage.desc': 'Analitzar l\'ús del lloc',
  'consent.denyAll': 'Rebutjar tot',
  'consent.save': 'Guardar preferències',

  // Legal Pages
  'legal.privacy.title': 'Política de Privacitat',
  'legal.privacy.content': `
    <h2>1. Informació General</h2>
    <p>És Impostor ("nosaltres", "el nostre" o "el lloc") es compromet a protegir la seva privacitat. Aquesta política explica com recopilem, utilitzem i protegeix la seva informació personal.</p>
    
    <h2>2. Informació que Recopilem</h2>
    <p>Recopilem informació mínima necessària per al funcionament del joc:</p>
    <ul>
      <li>Dades d'ús del joc (noms de jugadors, configuracions de partida)</li>
      <li>Informació tècnica (adreça IP, tipus de navegador, dispositiu)</li>
      <li>Cookies i tecnologies similars per a publicitat i anàlisi</li>
    </ul>
    
    <h2>3. Ús de la Informació</h2>
    <p>Utilitzem la seva informació per:</p>
    <ul>
      <li>Proporcionar i millorar els nostres serveis</li>
      <li>Mostrar anuncis personalitzats (amb el seu consentiment)</li>
      <li>Analitzar l'ús del lloc</li>
      <li>Complir amb obligacions legals</li>
    </ul>
    
    <h2>4. Cookies i Publicitat</h2>
    <p>Utilitzem Google AdSense per mostrar anuncis. Pot gestionar les seves preferències de cookies en qualsevol moment.</p>
    
    <h2>5. Els Seus Drets</h2>
    <p>Vostè té dret a accedir, rectificar, eliminar i oposar-se al tractament de les seves dades personals. Per exercir aquests drets, contacti'ns.</p>
    
    <h2>6. Contacte</h2>
    <p>Per a qualsevol consulta sobre privacitat, pot contactar-nos a través dels mitjans disponibles al lloc.</p>
    
    <p><em>Última actualització: ${new Date().toLocaleDateString('ca-ES')}</em></p>
  `,

  'legal.terms.title': 'Termes i Condicions',
  'legal.terms.content': `
    <h2>1. Acceptació dels Termes</h2>
    <p>En accedir i utilitzar És Impostor, accepta complir amb aquests termes i condicions.</p>
    
    <h2>2. Ús del Servei</h2>
    <p>El joc està destinat a ús personal i no comercial. Vostè es compromet a:</p>
    <ul>
      <li>No utilitzar el servei per a fins il·legals</li>
      <li>No intentar accedir a sistemes o dades no autoritzades</li>
      <li>No interferir amb el funcionament del servei</li>
      <li>Respectar altres usuaris</li>
    </ul>
    
    <h2>3. Contingut Generat per IA</h2>
    <p>El joc utilitza intel·ligència artificial (Google Gemini) per generar paraules personalitzades. No garantim la precisió o idoneïtat del contingut generat.</p>
    
    <h2>4. Limitació de Responsabilitat</h2>
    <p>El servei es proporciona "tal qual" sense garanties. No ens fem responsables de danys derivats de l'ús del servei.</p>
    
    <h2>5. Modificacions</h2>
    <p>Ens reservem el dret de modificar aquests termes en qualsevol moment. Els canvis entraran en vigor en publicar-se.</p>
    
    <h2>6. Llei Aplicable</h2>
    <p>Aquests termes es regeixen per la legislació espanyola.</p>
    
    <p><em>Última actualització: ${new Date().toLocaleDateString('ca-ES')}</em></p>
  `,

  'legal.cookies.title': 'Política de Cookies',
  'legal.cookies.content': `
    <h2>1. Què són les Cookies?</h2>
    <p>Les cookies són petits arxius de text que s'emmagatzemen al seu dispositiu quan visita el nostre lloc web.</p>
    
    <h2>2. Tipus de Cookies que Utilitzem</h2>
    <h3>Cookies Essencials</h3>
    <p>Necessàries per al funcionament bàsic del lloc. No es poden desactivar.</p>
    
    <h3>Cookies de Publicitat</h3>
    <p>Utilitzades per Google AdSense per mostrar anuncis personalitzats. Requereixen el seu consentiment.</p>
    
    <h3>Cookies d'Anàlisi</h3>
    <p>Ens ajuden a entendre com els usuaris interactuen amb el lloc. Requereixen el seu consentiment.</p>
    
    <h2>3. Gestió de Cookies</h2>
    <p>Pot gestionar les seves preferències de cookies en qualsevol moment fent clic al banner de consentiment o accedint a la configuració del seu navegador.</p>
    
    <h2>4. Cookies de Tercers</h2>
    <p>Utilitzem serveis de tercers (Google AdSense) que poden establir les seves pròpies cookies. No tenim control sobre aquestes cookies.</p>
    
    <h2>5. Més Informació</h2>
    <p>Per a més informació sobre com Google utilitza les cookies, visiteu: <a href="https://policies.google.com/technologies/cookies" target="_blank" rel="noopener noreferrer">Política de Cookies de Google</a></p>
    
    <p><em>Última actualització: ${new Date().toLocaleDateString('ca-ES')}</em></p>
  `,

  'legal.legal.title': 'Avís Legal',
  'legal.legal.content': `
    <h2>1. Dades Identificatives</h2>
    <p>És Impostor és un joc web desenvolupat i mantingut de forma independent.</p>
    
    <h2>2. Propietat Intel·lectual</h2>
    <p>Tot el contingut del lloc, incloent disseny, codi, textos i imatges, està protegit per drets d'autor. L'ús no autoritzat està prohibit.</p>
    
    <h2>3. Serveis de Tercers</h2>
    <p>El lloc utilitza els següents serveis de tercers:</p>
    <ul>
      <li><strong>Google AdSense:</strong> Per mostrar publicitat</li>
      <li><strong>Google Gemini AI:</strong> Per generar paraules personalitzades</li>
      <li><strong>Cloudflare:</strong> Per hosting i serveis de xarxa</li>
    </ul>
    
    <h2>4. Exempció de Responsabilitat</h2>
    <p>No ens fem responsables de:</p>
    <ul>
      <li>Interrupcions en el servei</li>
      <li>Pèrdua de dades</li>
      <li>Contingut generat per IA que pugui ser inadequat</li>
      <li>Enllaços a llocs externs</li>
    </ul>
    
    <h2>5. Modificacions</h2>
    <p>Ens reservem el dret de modificar el servei i aquest avís legal en qualsevol moment.</p>
    
    <h2>6. Contacte</h2>
    <p>Per a qualsevol consulta legal, pot contactar-nos a través dels mitjans disponibles al lloc.</p>
    
    <p><em>Última actualització: ${(() => { const d = new Date(); const m = d.toLocaleDateString('ca-ES', { month: 'long' }); return m.charAt(0).toUpperCase() + m.slice(1) + ' de ' + d.getFullYear(); })()}</em></p>
  `,

  // Rules Page
  'rules.title': 'Regles del Joc',
  'rules.button': 'Veure regles',
  'rules.content': `
    <h2>📖 Com es juga?</h2>
    <p>És Impostor és un joc de deducció social on els jugadors han de descobrir qui és l'impostor sense revelar la paraula secreta.</p>
    
    <h2>🎯 Objectiu del Joc</h2>
    <ul>
      <li><strong>Per als Civils:</strong> Descobrir qui és l'impostor votant-lo correctament.</li>
      <li><strong>Per a l'Impostor:</strong> Evitar ser descobert i fer que els civils votin per un altre jugador.</li>
    </ul>
    
    <h2>👥 Rols</h2>
    <h3>🟢 Civils</h3>
    <ul>
      <li>Conèixen la <strong>paraula secreta</strong> des de l'inici.</li>
      <li>Han de donar pistes sobre la paraula sense esmentar-la directament.</li>
      <li>El seu objectiu és identificar l'impostor durant la votació.</li>
    </ul>
    
    <h3>🔴 Impostor(s)</h3>
    <ul>
      <li><strong>NO coneixen</strong> la paraula secreta.</li>
      <li>Poden rebre una <strong>pista relacionada</strong> (si està habilitada a la configuració).</li>
      <li>Han de fingir que coneixen la paraula i donar pistes convincents.</li>
      <li>El seu objectiu és passar desapercebut i fer que els civils votin per un altre jugador.</li>
    </ul>
    
    <h2>🎮 Desenvolupament del Joc</h2>
    
    <h3>1️⃣ Fase de Configuració</h3>
    <ul>
      <li>Tria el nombre de jugadors (mínim 3, recomanat 4-8).</li>
      <li>Selecciona quants impostors hi haurà (normalment 1, però pot haver-hi més en partides grans).</li>
      <li>Tria el mode de joc:
        <ul>
          <li><strong>Aleatori:</strong> Paraula de qualsevol categoria.</li>
          <li><strong>Llista:</strong> Paraula de categories específiques (animals, menjar, pel·lícules, etc.).</li>
          <li><strong>IA Personalitzada:</strong> Genera una paraula única basada en un tema que tu triïs.</li>
        </ul>
      </li>
      <li>Introdueix els noms dels jugadors.</li>
    </ul>
    
    <h3>2️⃣ Revelació de Rols</h3>
    <ul>
      <li>Cada jugador veu el seu rol i la informació corresponent:
        <ul>
          <li><strong>Civils:</strong> Veuen la paraula secreta.</li>
          <li><strong>Impostors:</strong> Veuen que són impostors i la seva pista (si està habilitada).</li>
        </ul>
      </li>
      <li>Els rols es revelen un per un, passant el dispositiu entre jugadors.</li>
      <li>⚠️ <strong>Important:</strong> No revelis el teu rol als altres jugadors.</li>
    </ul>
    
    <h3>3️⃣ Fase de Pistes</h3>
    <ul>
      <li>Els jugadors donen pistes sobre la paraula secreta, un per un.</li>
      <li>Les pistes han de ser:
        <ul>
          <li>✅ Relacionades amb la paraula (per a civils).</li>
          <li>✅ Prou vagues per no revelar la paraula directament.</li>
          <li>✅ Convincents (especialment per a impostors).</li>
        </ul>
      </li>
      <li>Exemple: Si la paraula és "ELEFANT", bones pistes serien: "gran", "trompa", "gris", "savana".</li>
      <li>❌ No diguis la paraula directament ni utilitzis paraules massa òbvies.</li>
    </ul>
    
    <h3>4️⃣ Fase de Discussió</h3>
    <ul>
      <li>Després de totes les pistes, els jugadors debaten.</li>
      <li>Analitza les pistes donades per cada jugador.</li>
      <li>Cerca inconsistències o pistes sospitoses.</li>
      <li>L'impostor ha de defensar la seva posició i pot intentar acusar altres.</li>
    </ul>
    
    <h3>5️⃣ Fase de Votació</h3>
    <ul>
      <li>Cada jugador vota per qui creu que és l'impostor.</li>
      <li>Pots votar per qualsevol jugador, incloent-te a tu mateix (encara que no té sentit).</li>
      <li>Un cop tots han votat, es revelen els resultats.</li>
    </ul>
    
    <h3>6️⃣ Resultats</h3>
    <ul>
      <li><strong>Victòria dels Civils:</strong> Si el jugador més votat és l'impostor, els civils guanyen.</li>
      <li><strong>Victòria de l'Impostor:</strong> Si el jugador més votat NO és l'impostor, l'impostor guanya.</li>
      <li>En cas d'empat, el resultat pot variar segons la configuració.</li>
    </ul>
    
    <h2>💡 Consells i Estratègies</h2>
    
    <h3>Per a Civils:</h3>
    <ul>
      <li>Observa les pistes de tots els jugadors acuradament.</li>
      <li>Cerca pistes que no encaixin amb la paraula secreta.</li>
      <li>Presta atenció a qui acusa a qui durant la discussió.</li>
      <li>No revelis la paraula secreta durant el debat.</li>
    </ul>
    
    <h3>Per a Impostors:</h3>
    <ul>
      <li>Utilitza la pista proporcionada per donar pistes relacionades però vagues.</li>
      <li>Observa les pistes dels civils per intentar endevinar la paraula.</li>
      <li>Actua amb confiança i no et posis nerviós.</li>
      <li>Intenta acusar altres jugadors per desviar l'atenció de tu.</li>
      <li>Si t'acusen, defensa't amb calma i lògica.</li>
    </ul>
    
    <h2>🌐 Mode Online</h2>
    <p>En el mode online, cada jugador utilitza el seu propi dispositiu:</p>
    <ul>
      <li>Un jugador crea una sala i comparteix el codi amb els altres.</li>
      <li>Els altres jugadors s'uneixen utilitzant el codi de la sala.</li>
      <li>El joc es desenvolupa de forma similar, però cada jugador veu la seva informació al seu propi dispositiu.</li>
      <li>Les pistes i vots es sincronitzen en temps real.</li>
    </ul>
    
    <h2>⚙️ Configuracions Avançades</h2>
    <ul>
      <li><strong>Pista per a Impostor:</strong> Si està habilitada, l'impostor rep una pista relacionada amb la paraula per ajudar-lo a fingir millor.</li>
      <li><strong>Nombre d'Impostors:</strong> En partides grans (6+ jugadors), pots tenir múltiples impostors per major dificultat.</li>
      <li><strong>Temes Personalitzats:</strong> Utilitza la IA per generar paraules úniques basades en temes específics que triïs.</li>
    </ul>
    
    <h2>🎲 Variants del Joc</h2>
    <ul>
      <li><strong>Mode Clàssic:</strong> Una paraula, un impostor, pistes simples.</li>
      <li><strong>Mode Desafiant:</strong> Múltiples impostors o sense pista per a l'impostor.</li>
      <li><strong>Mode Creatiu:</strong> Utilitza temes personalitzats amb IA per paraules úniques i sorprenents.</li>
    </ul>
    
    <p><em>Diverteix-te i bona sort descobrint l'impostor!</em></p>
  `,

  // Online Game
  'online.turn.yours': '💭 El teu torn',
  'online.turn.others': '{icon} {name}',
  'online.hint.instruction': 'Digues una pista en veu alta (sense dir la paraula) i escriu-la aquí',
  'online.hint.waiting': 'Esperant que {player} escrigui la seva pista...',
  'online.vote.yours': '🗳️ El teu torn de votar',
  'online.vote.instruction': 'Després de debatre, vota: qui creus que és l\'impostor?',
  'online.vote.waiting': 'Esperant que {player} voti...',
  'online.role.impostor': '🎭 Impostor',
  'online.role.civil': '✅ Civil',
  'online.secretWord': 'Paraula: {word}',
  'online.impostorWarning': 'No coneixes la paraula. Intenta endevinar-la basant-te en les pistes.',
  'online.placeholder': 'Escriu la teva pista...',
  'online.send': 'Enviar',
  'online.yourHint': 'La teva pista: "{hint}"',
  'online.hintsReceived': 'Pistes rebudes:',
  'online.typing': 'Escrivint...',
  'online.pending': 'Pendent',
  'online.votedAlready': '✅ Ja has votat',
  'online.votedFor': 'Has votat per: {player}',
  'online.confirmVote': 'Confirmar vot',
  'online.votes': 'Vots:',
  'online.allHints': 'Pistes de tots:',
  'online.noHint': 'Sense pista',
  // New online game translations
  'online.lobby.title': 'Sala d\'espera',
  'online.lobby.ready': 'Llest',
  'online.lobby.notReady': 'No llest',
  'online.lobby.toggleReady': 'Canviar estat',
  'online.lobby.waitingAll': 'Esperant que tots estiguin llestos...',
  'online.lobby.allReady': 'Tots llestos!',
  'online.lobby.startGame': 'Iniciar partida',
  'online.lobby.host': 'Amfitrió',
  'online.lobby.you': '(Tu)',
  'online.lobby.kick': 'Expulsar',
  'online.lobby.connected': 'Connectat',
  'online.lobby.disconnected': 'Desconnectat',
  'online.lobby.minPlayers': 'Mínim 3 jugadors',
  'online.lobby.changeIcon': 'Canviar icona',
  'online.reveal.title': 'La teva carta',
  'online.reveal.tapToSee': 'Toca per veure el teu rol',
  'online.reveal.youAre': 'Ets',
  'online.reveal.civil': 'CIVIL',
  'online.reveal.impostor': 'IMPOSTOR',
  'online.reveal.secretWord': 'La paraula secreta és:',
  'online.reveal.noWord': '???',
  'online.reveal.clue': 'La teva pista:',
  'online.reveal.understood': 'Entès',
  'online.reveal.waiting': 'Esperant que tots vegin la seva carta...',
  'online.hints.title': 'Ronda de pistes',
  'online.hints.instruction': 'Tots donen la seva pista a la vegada',
  'online.hints.yourHint': 'La teva pista',
  'online.hints.submit': 'Enviar pista',
  'online.hints.sent': 'Pista enviada ✓',
  'online.hints.waitingOthers': 'Esperant als altres...',
  'online.hints.playerSent': 'Enviada',
  'online.hints.playerPending': 'Pensant...',
  'online.vote.title': 'Votació',
  'online.vote.chooseImpostor': 'Qui és l\'impostor?',
  'online.vote.confirm': 'Votar',
  'online.vote.waitingAll': 'Esperant vots...',
  'online.vote.voted': 'vots',
  'online.vote.waitingOthers': 'Esperant que els altres votin...',
  'online.suspect': 'Sospito',
  'online.suspects': 'sospites',

  // Admin panel
  'admin.title': 'Panell de Control',
  'admin.subtitle': 'Gestió i estadístiques del servidor',
  'admin.pinLabel': 'PIN d\'administrador',
  'admin.pinPlaceholder': '',
  'admin.view': 'Accedir',
  'admin.pinRequired': 'Introdueix el PIN',
  'admin.unauthorized': 'PIN incorrecte',
  'admin.networkError': 'No s\'ha pogut carregar el panell',
  'admin.statsTitle': 'Ús en temps real',
  'admin.totalRooms': 'Sales totals',
  'admin.publicRooms': 'Sales actives',
  'admin.geminiCalls': 'Gemini API',
  'admin.lastUpdate': 'Última actualització',
  'admin.publicRoomsList': 'Sales públiques',
  'admin.code': 'Codi',
  'admin.players': 'Jugadors',
  'admin.name': 'Nom',
  'admin.topic': 'Tema',
  'admin.ageMinutes': 'Minuts oberta',
  'admin.closeRoom': 'Tancar',
  'admin.closing': 'Tancant...',
  'admin.geminiNearLimit': '⚠️ Ús de Gemini a prop del límit diari. S\'utilitzarà fallback local si se supera.',
  'admin.refresh': 'Actualitzar',
  'admin.logout': 'Tancar sessió',
  'admin.noRooms': 'No hi ha sales públiques actives',
};

const dictionaries: Record<Locale, Dictionary> = { es, ca };

export function translate(locale: Locale, key: string, params?: Record<string, string>): string {
  const dict = dictionaries[locale] ?? dictionaries.es;
  let text = dict[key] ?? key;

  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, v);
    });
  }

  return text;
}
