// ── TOGGLE SECTION ──
function toggleSection(hdr) {
  const section = hdr.closest('.section');
  section.classList.toggle('collapsed');
}

// ── EXPAND / COLLAPSE ALL ──
document.getElementById('btn-expand-all').addEventListener('click', function() {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('collapsed'));
});
document.getElementById('btn-collapse-all').addEventListener('click', function() {
  document.querySelectorAll('.section').forEach(s => s.classList.add('collapsed'));
});

// ── SEARCH ──
const input = document.getElementById('search-input');
const notice = document.getElementById('search-notice');
const label = document.getElementById('search-label');

function norm(s) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
}

input.addEventListener('input', function() {
  const q = norm(this.value.trim());
  const cards = document.querySelectorAll('.term-card');
  const sections = document.querySelectorAll('.section');

  if (!q) {
    cards.forEach(c => c.classList.remove('hidden'));
    sections.forEach(s => s.classList.remove('hidden-section'));
    notice.style.display = 'none';
    return;
  }

  sections.forEach(s => s.classList.remove('collapsed'));
  notice.style.display = 'block';
  label.textContent = '"' + this.value.trim() + '"';

  cards.forEach(card => {
    card.classList.toggle('hidden', !norm(card.textContent).includes(q));
  });

  sections.forEach(section => {
    const visible = section.querySelectorAll('.term-card:not(.hidden)');
    section.classList.toggle('hidden-section', visible.length === 0);
  });
});

// ── ACTIVE NAV ──
const ids = ['ug','vlt','cab','eq','aer','doc'];
const navLinks = document.querySelectorAll('.nav-link');

function updateNav() {
  const y = window.scrollY + 100;
  let cur = ids[0];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.offsetTop <= y) cur = id;
  });
  navLinks.forEach(a => {
    const href = a.getAttribute('href').replace('#','');
    a.classList.toggle('active', href === cur);
  });
}

window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

// ── LANGUAGE TOGGLE ──
const TRANS = {
  'Trench / Trenching': {
    def: {
      es: 'Excavación abierta en el suelo para colocar conductos o cables. Se abre la zanja, se instalan los conductos y se tapan y reparan la superficie (asfalto, banqueta, tierra). Es el método más tradicional y directo cuando el terreno lo permite.',
      en: 'Open cut excavation in the ground to place conduits or cables. The trench is opened, conduits are installed, and the surface (asphalt, sidewalk, soil) is backfilled and repaired. It is the most traditional and direct method when terrain allows.'
    }
  },
  'Bore / Directional Bore': {
    def: {
      es: 'Perforación horizontal dirigida (HDD — Horizontal Directional Drilling) que instala el conducto <b>sin abrir la superficie</b>. Se guía la broca bajo tierra en la dirección correcta. Se usa para cruzar calles, carreteras, vías de tren o cualquier zona donde no se puede excavar. Un bore existente puede reutilizarse para jalar nuevos cables.',
      en: 'Guided horizontal directional drilling (HDD — Horizontal Directional Drilling) that installs conduit <b>without opening the surface</b>. The drill bit is steered underground in the correct direction. Used to cross streets, roads, railroad tracks, or any area where excavation is not possible. An existing bore can be reused to pull new cables.'
    }
  },
  'New Bore': {
    def: {
      es: 'Indica que la perforación <b>no existe</b> y debe realizarse desde cero. A diferencia de utilizar un <b>conducto existente</b>, el new bore implica costos adicionales de maquinaria, tiempo y gestión de permisos. Se especifica claramente en los planos de construcción para distinguirlo de los tramos donde ya se cuenta con infraestructura de canalización aprovechable.',
      en: 'Indicates that the bore <b>does not exist</b> and must be performed from scratch. Unlike using an <b>existing conduit</b>, a new bore involves additional costs for machinery, time, and permit management. It is clearly specified on construction drawings to distinguish it from segments where existing duct infrastructure is already available.'
    }
  },
  'Missile Bore': {
    def: {
      es: 'Técnica de perforación de corta distancia donde se dispara un "misil" o torpedo neumático que abre paso en el suelo sin guía direccional. Es más rápido y económico que el HDD pero solo funciona en tramos cortos y terrenos blandos. No se controla su dirección con la misma precisión.',
      en: 'Short-distance drilling technique where a pneumatic "missile" or torpedo is fired through the soil without directional guidance. Faster and more economical than HDD but only works for short distances and soft soils. Direction cannot be controlled with the same precision.'
    }
  },
  'Plowing / Cable Plow': {
    def: {
      es: 'Método en el que una máquina abre una ranura estrella en el suelo e instala el cable o conducto <b>en un solo paso</b>, sin zanja abierta. Es muy eficiente en terrenos blandos como jardines, campos o bermas. No requiere reponer asfalto. Se usa frecuentemente para instalar drops en zonas residenciales.',
      en: 'Method in which a machine opens a narrow slot in the ground and installs the cable or conduit <b>in a single pass</b>, without an open trench. Very efficient in soft terrain such as lawns, fields, or berms. No asphalt restoration required. Frequently used for installing drops in residential areas.'
    }
  },
  'Conduit / HDPE Conduit': {
    def: {
      es: 'Tubo por donde viaja el cable de fibra óptica bajo tierra. El <b>HDPE</b> (High Density Polyethylene) es el material estándar en telecom: es flexible, resistente a golpes, químicos y humedad. El cable se jala a través del conducto una vez instalado. Protege el cable de aplastamiento y permite reemplazarlo sin excavar de nuevo.',
      en: 'Tube through which fiber optic cable travels underground. <b>HDPE</b> (High Density Polyethylene) is the standard material in telecom: flexible, resistant to impact, chemicals, and moisture. The cable is pulled through the conduit once installed. Protects the cable from crushing and allows replacement without re-excavating.'
    }
  },
  'Linear Footage / Footage': {
    def: {
      es: 'Medida de longitud en <b>pies</b> que indica cuántos pies de zanja o bore se instalan. Es la unidad estándar en proyectos de construcción en EUA y se aplica a cualquier tipo de proyecto, no solo telecomunicaciones. Ejemplo: <span class="code">450 ft of bore</span> = 450 pies de perforación. Se usa para estimar materiales, costos y tiempo de trabajo.',
      en: 'Length measurement in <b>feet</b> indicating how many feet of trench or bore are installed. It is the standard unit in construction projects in the USA and applies to any type of project, not just telecommunications. Example: <span class="code">450 ft of bore</span> = 450 feet of drilling. Used to estimate materials, costs, and work time.'
    },
    note: {
      es: '⚠ El footage aplica a los métodos de construcción (trench, bore, plow), no al cable en sí. El cable tiene su propio metraje.',
      en: '⚠ Footage applies to construction methods (trench, bore, plow), not to the cable itself. The cable has its own separate measurement.'
    }
  },
  'Manhole': {
    def: {
      es: 'Cámara subterránea con tapa al nivel del suelo (en banqueta o calle) que permite a técnicos bajar y acceder a los cables para empalmes, jaloneos y mantenimiento. Son más grandes que los handholes: el técnico puede entrar físicamente. Pueden alojar múltiples cables y equipos de empalme.',
      en: 'Underground chamber with a surface-level cover (in sidewalk or street) that allows technicians to descend and access cables for splicing, pulling, and maintenance. Larger than handholes: the technician can physically enter. Can house multiple cables and splicing equipment.'
    }
  },
  'Pedestal': {
    def: {
      es: 'Caja pequeña que emerge sobre la superficie del suelo (generalmente en jardines o bermas) y que aloja terminales de fibra, splitters o puntos de empalme. A diferencia del handhole, no está enterrado al ras sino que tiene una parte visible. Es un punto de distribución común en redes residenciales enterradas (buried).',
      en: 'Small box that emerges above the ground surface (typically in lawns or berms) and houses fiber terminals, splitters, or splice points. Unlike a handhole, it is not flush-buried but has a visible above-ground portion. A common distribution point in buried residential networks.'
    }
  },
  'BD03 / Flowerpot': {
    def: {
      es: 'La bóveda de menor tamaño. Se entierra al ras del suelo y da acceso a cables de fibra en zonas residenciales. Su apodo <b>"flowerpot"</b> viene de su forma cilíndrica similar a una maceta. Ideal para puntos simples con pocos cables.',
      en: 'The smallest vault. Buried flush with the ground and provides access to fiber cables in residential areas. Its nickname <b>"flowerpot"</b> comes from its cylindrical shape similar to a flowerpot. Ideal for simple access points with few cables.'
    }
  },
  'Handhole (HH)': {
    def: {
      es: 'Bóveda rectangular enterrada con tapa al ras del suelo. Permite acceder a los cables sin necesidad de excavar. Los tamaños más comunes son <span class="code">HH 17</span>, <span class="code">HH 24</span> y <span class="code">HH 30</span> (pulgadas), pero existen muchos otros tamaños según el fabricante y la aplicación. A mayor tamaño, más cables y equipos puede alojar.',
      en: 'Rectangular buried vault with a flush-to-grade cover. Allows cable access without excavation. The most common sizes are <span class="code">HH 17</span>, <span class="code">HH 24</span>, and <span class="code">HH 30</span> (inches), but many other sizes exist depending on manufacturer and application. Larger sizes accommodate more cables and equipment.'
    },
    note: {
      es: 'Nota: los tamaños HH 17, 24 y 30 son los más frecuentes en campo, pero no son los únicos disponibles.',
      en: 'Note: sizes HH 17, 24, and 30 are the most common in the field, but they are not the only ones available.'
    }
  },
  'FDH': {
    def: {
      es: '<b>Fiber Distribution Hub</b>: el nodo donde el cable de distribución se divide para llegar a los hogares mediante splitters. Puede instalarse en poste, en gabinete o en bóveda. Los modelos <span class="code">288</span>, <span class="code">432</span>, <span class="code">576</span> y <span class="code">864</span> indican la capacidad máxima en fibras.',
      en: '<b>Fiber Distribution Hub</b>: the node where the distribution cable is split to reach homes through splitters. Can be installed on a pole, in a cabinet, or in a vault. Models <span class="code">288</span>, <span class="code">432</span>, <span class="code">576</span>, and <span class="code">864</span> indicate the maximum fiber capacity.'
    }
  },
  'Cabinet / Enclosure': {
    def: {
      es: 'Caja metálica o plástica que protege equipos activos o pasivos de red (splitters, empalmes, patch panels) instalada en la vía pública, en postes o en losas. Puede ser un <b>enclosure</b> (caja cerrada con acceso por puerta) o un <b>cabinet</b> (versión más grande, generalmente con temperatura controlada). Son puntos clave de la red de distribución.',
      en: 'Metal or plastic box that protects active or passive network equipment (splitters, splices, patch panels) installed on public roads, poles, or slabs. Can be an <b>enclosure</b> (closed box with door access) or a <b>cabinet</b> (larger version, generally temperature-controlled). Key points in the distribution network.'
    }
  },
  'ct \u2014 Fiber Count': {
    def: {
      es: '<b>"ct"</b> significa <i>count</i> (conteo). Indica cuántas fibras ópticas individuales contiene el cable. A más fibras, más conexiones puede soportar simultáneamente. Ejemplo: un cable <span class="code">48ct</span> tiene 48 fibras individuales dentro de su cubierta protectora.',
      en: '<b>"ct"</b> stands for <i>count</i>. Indicates how many individual optical fibers a cable contains. More fibers means more simultaneous connections it can support. Example: a <span class="code">48ct</span> cable has 48 individual fibers inside its protective sheath.'
    }
  },
  '2ct \u00b7 4ct \u00b7 6ct \u00b7 12ct': {
    def: {
      es: 'Los cables de menor conteo, usados principalmente para conexiones de un solo cliente o puntos finales muy específicos. El cable <b>drop</b> que llega a la casa del cliente suele ser de 2ct o 4ct. También se usan en jumpers y pigtails dentro de equipos.',
      en: 'The lowest fiber count cables, used primarily for single-client connections or very specific endpoints. The <b>drop</b> cable that reaches the customer\'s home is typically 2ct or 4ct. Also used in jumpers and pigtails inside equipment.'
    }
  },
  '24ct \u00b7 48ct \u00b7 72ct \u00b7 96ct': {
    def: {
      es: 'Cables de distribución para ramas secundarias del vecindario. Conectan los FDH con las terminales (OTE) en los postes o con grupos de pedestales. Son más delgados y económicos que los cables de troncal.',
      en: 'Distribution cables for secondary neighborhood branches. Connect FDHs to pole terminals (OTE) or groups of pedestals. Thinner and more economical than backbone cables.'
    }
  },
  '144ct \u00b7 288ct \u00b7 432ct \u00b7 576ct+': {
    def: {
      es: 'Cables de alta capacidad usados en el tramo principal (<b>feeder</b> o <b>backbone</b>) que conecta el OLT o hub central con los FDH de cada zona. Existen cables de mayor capacidad como <span class="code">864ct</span>, <span class="code">1152ct</span> o más para rutas de muy alta densidad.',
      en: 'High-capacity cables used on the main segment (<b>feeder</b> or <b>backbone</b>) connecting the OLT or central hub to each zone\'s FDHs. Higher-capacity cables exist such as <span class="code">864ct</span>, <span class="code">1152ct</span>, or more for very high-density routes.'
    }
  },
  'Drop Cable': {
    def: {
      es: 'Cable de fibra que va desde la <b>terminal (OTE, MST o FDT)</b> hasta el domicilio del cliente. La terminal puede estar en un poste, en un handhole o en un pedestal. Es el tramo final de la red: el más delgado, con menor conteo (2\u20134ct), y puede instalarse aéreo (desde el poste) o enterrado (buried drop).',
      en: 'Fiber cable that runs from the <b>terminal (OTE, MST or FDT)</b> to the customer\'s home. The terminal can be on a pole, in a handhole, or in a pedestal. It is the last mile of the network: the thinnest, lowest count (2\u20134ct), and can be installed aerially (from the pole) or buried (buried drop).'
    }
  },
  'OTE \u2014 Optical Terminal Equipment': {
    def: {
      es: 'Caja donde se conectan los cables drop de los clientes. Se instala principalmente en postes. El número de puertos indica cuántos clientes puede servir: <span class="code">OTE 4-port</span>, <span class="code">OTE 6-port</span>, <span class="code">OTE 8-port</span>, <span class="code">OTE 12-port</span>. Pueden existir variantes de mayor capacidad según el fabricante.',
      en: 'Box where customer drop cables are connected. Installed primarily on poles. The number of ports indicates how many customers it can serve: <span class="code">OTE 4-port</span>, <span class="code">OTE 6-port</span>, <span class="code">OTE 8-port</span>, <span class="code">OTE 12-port</span>. Higher-capacity variants may exist depending on the manufacturer.'
    },
    note: {
      es: 'Ver también: MST y FDT, que son tipos alternativos de terminal con diferente diseño y capacidad.',
      en: 'See also: MST and FDT, which are alternative terminal types with different design and capacity.'
    }
  },
  'MST \u2014 Multi-Service Terminal': {
    def: {
      es: 'Tipo de terminal de fibra óptica diseñada para servir a múltiples clientes desde un solo punto. A diferencia de una OTE convencional, la MST destaca por integrar un tail (latiguillo de entrada) de diferentes longitudes, lo que permite una mayor flexibilidad en su instalación según la distancia al punto de empalme. Posee un diseño constructivo robusto orientado a marcas específicas y puede montarse en poste, pared o pedestal. En algunos proyectos, se utiliza "MST" como término genérico para cualquier terminal de distribución final.',
      en: 'Type of fiber optic terminal designed to serve multiple customers from a single point. Unlike a conventional OTE, the MST stands out for integrating a tail (entry pigtail) of different lengths, allowing greater installation flexibility based on the distance to the splice point. It has a robust construction design oriented toward specific brands and can be mounted on a pole, wall, or pedestal. In some projects, "MST" is used as a generic term for any final distribution terminal.'
    }
  },
  'FDT \u2014 Fiber Distribution Terminal': {
    def: {
      es: 'Terminal de fibra instalada típicamente en pedestal o handhole, que sirve como punto final de distribución en zonas de red enterrada (buried). Desde aquí salen los drops enterrados hacia las casas. Cumple la misma función que la OTE pero en instalaciones subterráneas o de piso.',
      en: 'Fiber terminal typically installed in a pedestal or handhole, serving as the final distribution point in buried network areas. Buried drops to homes originate from here. Serves the same function as the OTE but in underground or surface-level installations.'
    }
  },
  'Splice Case': {
    def: {
      es: 'Caja sellada que protege los empalmes de fibra por fusión (<i>fusion splices</i>). Protege las fibras del polvo, agua y daño mecánico. Viene en tres tamaños según la cantidad de cables y fibras a empalmar:',
      en: 'Sealed box that protects fusion fiber splices (<i>fusion splices</i>). Protects fibers from dust, water, and mechanical damage. Available in three sizes based on the number of cables and fibers to be spliced:'
    }
  },
  'B-Case': {
    def: {
      es: 'El splice case más pequeño. Para empalmes sencillos con cables de bajo conteo. Común en ramas residenciales secundarias.',
      en: 'The smallest splice case. For simple splices with low fiber count cables. Common in secondary residential branches.'
    }
  },
  'C-Case': {
    def: {
      es: 'Tamaño mediano. Para nodos intermedios con mayor densidad de cables y empalmes.',
      en: 'Medium size. For intermediate nodes with higher cable and splice density.'
    }
  },
  'D-Case': {
    def: {
      es: 'La más grande. Para nodos principales donde convergen cables de alto conteo (144ct o más).',
      en: 'The largest. For main nodes where high-count cables (144ct or more) converge.'
    }
  },
  'OLT \u2014 Optical Line Terminal': {
    def: {
      es: 'El equipo activo que vive en la central o headend del proveedor. Es el <b>punto de origen</b> de toda la red PON: controla, gestiona y envía la señal óptica hacia todos los clientes de su área. La red de fibra "nace" aquí y se distribuye por el feeder cable hacia los FDH y terminales.',
      en: 'The active equipment located in the provider\'s central office or headend. It is the <b>origin point</b> of the entire PON network: it controls, manages, and transmits the optical signal to all customers in its area. The fiber network "originates" here and is distributed via feeder cable to the FDHs and terminals.'
    }
  },
  'Splitter': {
    def: {
      es: 'Dispositivo pasivo que toma <b>una señal de fibra y la divide</b> en múltiples señales hacia varios clientes. Una entrada, muchas salidas. No necesita energía eléctrica. Se instalan típicamente dentro del FDH o en los enclosures de distribución.',
      en: 'Passive device that takes <b>one fiber signal and splits it</b> into multiple signals for several customers. One input, many outputs. Requires no electrical power. Typically installed inside the FDH or in distribution enclosures.'
    }
  },
  'NAP Cluster': {
    def: {
      es: '<b>Network Access Point</b> cluster: agrupación de puntos donde se conectan varios drops de clientes en una misma área. Es el nivel más local de distribución antes de llegar a la casa. Puede ser un conjunto de terminales en postes contiguos o un pedestal con múltiples salidas.',
      en: '<b>Network Access Point</b> cluster: grouping of connection points where several customer drops are served in the same area. It is the most local level of distribution before reaching the home. Can be a set of terminals on adjacent poles or a pedestal with multiple outputs.'
    }
  },
  'Pole': {
    def: {
      es: 'Estructura vertical de soporte para cables aéreos. Puede ser de madera (más común en EUA), concreto o acero. Los cables de fibra, eléctricos y telefónicos comparten el poste en franjas o zonas asignadas por tipo de servicio, con separaciones de seguridad reglamentarias.',
      en: 'Vertical support structure for aerial cables. Can be wood (most common in the USA), concrete, or steel. Fiber, electrical, and telephone cables share the pole in assigned strips or zones by service type, with regulated safety separations.'
    }
  },
  'Pole Attachment': {
    def: {
      es: 'El punto físico donde el strand o cable queda anclado al poste mediante herrajes (ganchos, abrazaderas o soportes). Cada empresa tiene reglamentos sobre en qué franja vertical del poste puede instalar su equipo, para mantener separación segura respecto a cables eléctricos. También se refiere al <i>derecho</i> de instalar en ese poste (contrato de pole attachment).',
      en: 'The physical point where the strand or cable is anchored to the pole using hardware (hooks, clamps, or brackets). Each company has regulations about which vertical zone of the pole it can use for its equipment, to maintain safe separation from electrical cables. Also refers to the <i>right</i> to install on that pole (pole attachment agreement).'
    }
  },
  'Strand': {
    def: {
      es: 'Cable de acero galvanizado tensado entre postes. Su función es <b>exclusivamente mecánica</b>: soportar el peso del cable de fibra a lo largo del vano aéreo. No lleva ninguna señal. El calibre del strand se elige según la longitud del span y el peso del cable.',
      en: 'Galvanized steel cable tensioned between poles. Its function is <b>purely mechanical</b>: to support the weight of the fiber cable along the aerial span. It carries no signal. The strand gauge is chosen based on span length and cable weight.'
    }
  },
  'Span / Aerial Span': {
    def: {
      es: 'Distancia entre dos postes consecutivos, que es la longitud del cable que queda en el aire. A mayor span, mayor tensión en el strand y mayor "flecha" (curvatura del cable). El span máximo permitido depende del calibre del strand y el peso del cable.',
      en: 'Distance between two consecutive poles, which is the length of cable suspended in the air. Longer spans mean greater tension on the strand and more "sag" (cable curvature). The maximum permitted span depends on the strand gauge and cable weight.'
    }
  },
  'Mid Span': {
    def: {
      es: 'El punto central entre dos postes, donde el cable tiene su mayor curvatura (máxima flecha). Es el lugar más vulnerable a contacto con otras líneas o vegetación. Se mide para verificar que se respete la altura mínima reglamentaria sobre la vía o vegetación.',
      en: 'The midpoint between two poles, where the cable has its greatest curvature (maximum sag). The most vulnerable point to contact with other lines or vegetation. Measured to verify that the minimum regulatory height above the road or vegetation is maintained.'
    }
  },
  'Lash / Lashing Wire': {
    def: {
      es: '<b>Lash</b> es el proceso de sujetar el cable de fibra al strand. El <b>lashing wire</b> es el alambre en espiral (acero galvanizado o aluminio) que se enrolla alrededor del strand y el cable simultáneamente, uniéndolos a lo largo de todo el vano. Se aplica con una máquina lasheadora que avanza por el strand enrollando el alambre. Sin el lash, el cable quedaría suelto y se movería con el viento.',
      en: '<b>Lash</b> is the process of securing the fiber cable to the strand. The <b>lashing wire</b> is a spiral wire (galvanized steel or aluminum) that wraps around both the strand and cable simultaneously, binding them along the entire span. Applied with a lashing machine that advances along the strand coiling the wire. Without lashing, the cable would be loose and would move in the wind.'
    }
  },
  'Overlash': {
    def: {
      es: 'Técnica de instalar un nuevo cable de fibra <b>sobre un strand que ya tiene un cable lasheado</b>. En lugar de instalar un strand nuevo, el nuevo cable se lashea encima del existente. Es más económico pero requiere verificar que la capacidad del strand soporte el peso adicional.',
      en: 'Technique of installing a new fiber cable <b>on a strand that already has a lashed cable</b>. Instead of installing a new strand, the new cable is lashed on top of the existing one. More economical but requires verifying that the strand capacity can support the additional weight.'
    }
  },
  'Clearance': {
    def: {
      es: 'Distancia mínima reglamentaria que debe existir entre el cable de fibra (o strand) y otros cables o líneas en el mismo poste. La más crítica es la <b>separación entre la primera fila de telecom y los cables eléctricos o de alumbrado</b>, para seguridad del personal y el equipo. Los valores exactos los define la autoridad local o el propietario del poste.',
      en: 'Minimum regulatory distance that must exist between the fiber cable (or strand) and other cables or lines on the same pole. The most critical is the <b>separation between the first telecom row and electrical or lighting cables</b>, for personnel and equipment safety. Exact values are defined by the local authority or pole owner.'
    }
  },
  'Crossover': {
    def: {
      es: 'Punto donde el cable aéreo cruza sobre otra línea, calle, vía, río u obstáculo. Los crossovers requieren atención especial al clearance y en muchos casos necesitan permiso específico. El diseño debe garantizar la altura mínima sobre el cruce.',
      en: 'Point where an aerial cable crosses over another line, street, road, river, or obstacle. Crossovers require special attention to clearance and in many cases need specific permits. The design must ensure the minimum height over the crossing.'
    }
  },
  'Splice (Aerial)': {
    def: {
      es: 'Punto donde dos tramos de cable de fibra se unen (empalman) en la red aérea. En la planta aérea, el splice generalmente se aloja en un splice case colgado del strand o del poste, protegido de la intemperie.',
      en: 'Point where two sections of fiber cable are joined (spliced) in the aerial network. In aerial plant, the splice is typically housed in a splice case hung from the strand or pole, protected from the elements.'
    }
  },
  'Riser Pole': {
    def: {
      es: 'Poste donde el cable <b>transita de subterráneo a aéreo</b> (o viceversa). El cable lleva un tubo de acero o conduit protector llamado <b>riser</b> que lo cubre desde el nivel del suelo hasta el punto de fijación en el poste, para protegerlo de daños físicos.',
      en: 'Pole where the cable <b>transitions from underground to aerial</b> (or vice versa). The cable uses a steel conduit or protective conduit called a <b>riser</b> that covers it from ground level to the attachment point on the pole, protecting it from physical damage.'
    }
  },
  'Drop Pole': {
    def: {
      es: 'El último poste de la red aérea antes de llegar al domicilio del cliente. Desde aquí sale el cable drop hacia la fachada de la casa. No es necesariamente el poste más cercano a la casa: es el poste designado como punto de salida del drop.',
      en: 'The last pole of the aerial network before reaching the customer\'s home. The drop cable exits from here to the building facade. It is not necessarily the pole closest to the home: it is the pole designated as the drop exit point.'
    }
  },
  'Riser Drop Pole': {
    def: {
      es: 'Poste que cumple dos funciones simultáneamente: es <b>riser</b> (transición de underground a aerial) y también <b>drop pole</b> (punto de salida del cable al cliente). Común cuando el cable llega al vecindario enterrado y el primer punto de distribución es también el punto de drop.',
      en: 'Pole that simultaneously serves two functions: it is a <b>riser</b> (underground-to-aerial transition) and a <b>drop pole</b> (drop cable exit to the customer). Common when the cable arrives in the neighborhood buried and the first distribution point is also the drop point.'
    }
  },
  'Anchor / Guying': {
    def: {
      es: 'Sistema de cables diagonales de acero (<b>guys</b>) que anclan el poste al suelo para resistir la tensión lateral del strand o cargas de viento. Obligatorio en esquinas, puntos de fin de línea, postes con mucha carga o donde la geometría genera fuerzas laterales importantes.',
      en: 'System of diagonal steel cables (<b>guys</b>) that anchor the pole to the ground to resist lateral tension from the strand or wind loads. Mandatory at corners, end-of-line points, heavily loaded poles, or where the geometry generates significant lateral forces.'
    }
  },
  'Crossing Overhead Guy': {
    def: {
      es: 'Guy (retenida) que pasa sobre una vía, calle u obstáculo para anclar el poste en el lado opuesto. Requiere que el cable de la retenida cumpla la altura mínima sobre la vía. El diseño varía por empresa y normativa local.',
      en: 'Guy that passes over a road, street, or obstacle to anchor the pole on the opposite side. Requires the guy cable to meet the minimum height over the road. Design varies by company and local regulations.'
    }
  },
  'Slack Loop / Coil': {
    def: {
      es: 'Reserva de cable extra enrollada en un punto del trayecto, para usar en reparaciones futuras sin tener que jalar cable desde otro punto. Hay dos variantes:',
      en: 'Extra cable reserve coiled at a point along the route, for use in future repairs without having to pull cable from another point. Two variants:'
    }
  },
  'UG Structure Slack': {
    def: {
      es: 'Lazo guardado dentro de un handhole o manhole, enrollado en figura 8 u oval dentro de la caja.',
      en: 'Loop stored inside a handhole or manhole, coiled in a figure-8 or oval pattern inside the box.'
    }
  },
  'Pole Slack': {
    def: {
      es: 'Lazo guardado en el poste, sujeto con soporte tipo "figura 8" o gancho metálico. Queda enrollado en la parte superior del poste.',
      en: 'Loop stored on the pole, secured with a "figure-8" support or metal hook. Remains coiled at the top of the pole.'
    }
  },
  'Overlap': {
    def: {
      es: 'Longitud extra de cable que se deja en empalmes o transiciones para asegurar margen de trabajo. Evita que el cable quede a ras y sin posibilidad de maniobra en futuras intervenciones o reparaciones.',
      en: 'Extra cable length left at splices or transitions to ensure working margin. Prevents the cable from being cut too short with no room for future interventions or repairs.'
    }
  },
  'Passing': {
    def: {
      es: 'Cable que atraviesa un poste o bóveda <b>sin terminar, empalmar ni conectar nada</b> en ese punto. Solo pasa de camino a otro destino más adelante. Se amarra para mantenerlo ordenado pero no se interviene.',
      en: 'Cable that passes through a pole or vault <b>without terminating, splicing, or connecting anything</b> at that point. It only passes on its way to another destination further ahead. It is secured to keep things tidy but is not intervened.'
    }
  },
  'Restoration': {
    def: {
      es: 'Trabajo de reparación para regresar el servicio a condición operativa después de un corte, daño accidental o intervención de terceros. Incluye empalmes de emergencia, sustitución de tramos, pruebas OTDR, restauración de la superficie y documentación del incidente.',
      en: 'Repair work to return service to operational condition after a cut, accidental damage, or third-party intervention. Includes emergency splices, segment replacement, OTDR testing, surface restoration, and incident documentation.'
    }
  },
  'Outside Plant (OSP)': {
    def: {
      es: 'Todo el sistema de cables, postes, conductos, bóvedas y equipos que se instalan <b>fuera de los edificios</b>, en la vía pública. Es la parte de la red que se diseña, permisa y construye en campo. Esta guía de constructabilidad cubre principalmente el OSP.',
      en: 'All cables, poles, conduits, vaults, and equipment installed <b>outside buildings</b>, in the public right-of-way. It is the part of the network that is designed, permitted, and built in the field. This constructability guide primarily covers the OSP.'
    }
  },
  'High Level Design (HLD)': {
    def: {
      es: 'El diseño general de la red: qué zonas se van a cubrir, qué tecnología se usará, cuántos usuarios se proyectan, por dónde irán las rutas principales. Es el plano estratégico del proyecto, sin el detalle de cada poste o conducto. Lo producen ingenieros de red y sirve como base para el Low Level Design.',
      en: 'The general network design: which areas will be covered, what technology will be used, how many users are projected, where the main routes will run. It is the strategic plan of the project, without the detail of each pole or conduit. Produced by network engineers and serves as the basis for the Low Level Design.'
    }
  },
  'Low Level Design (LLD)': {
    def: {
      es: 'El diseño detallado y ejecutable de la red. Especifica exactamente cada poste, cada empalme, cada tipo de cable, cada handhole y cada método de instalación. Es el documento que usa el equipo de campo para construir. También conocido como <b>construction drawings</b>.',
      en: 'The detailed and executable network design. Specifies exactly each pole, each splice, each cable type, each handhole, and each installation method. It is the document the field team uses to build. Also known as <b>construction drawings</b>.'
    }
  },
  'Construction Drawings (Dwgs)': {
    def: {
      es: 'Planos detallados aprobados que el equipo de campo sigue durante la construcción. Incluyen rutas de cable, tipos de conducto, ubicación de vaults, detalles de postes, leyendas y notas de ingeniería. Son el documento oficial de referencia en obra.',
      en: 'Detailed approved drawings that the field team follows during construction. Include cable routes, conduit types, vault locations, pole details, legends, and engineering notes. The official reference document on site.'
    }
  },
  'As-Built': {
    def: {
      es: 'Documentación que refleja <b>exactamente cómo quedó construida la red</b>, incluyendo cualquier cambio respecto al plano original. Es el registro oficial de lo que existe en campo. Esencial para mantenimiento, expansión y resolución de fallas futuras. Se entrega al cliente al finalizar la obra.',
      en: 'Documentation that accurately reflects <b>exactly how the network was built</b>, including any changes from the original plan. It is the official record of what exists in the field. Essential for maintenance, expansion, and future fault resolution. Delivered to the client upon project completion.'
    }
  },
  'GIS': {
    def: {
      es: '<b>Geographic Information System</b>: plataforma de software que almacena, visualiza y analiza la información geoespacial de la red. En telecom se usa para mapear rutas de cable, postes, handholes, zonas de servicio y cobertura. El as-built se carga en GIS para que toda la organización pueda consultarlo.',
      en: '<b>Geographic Information System</b>: software platform that stores, visualizes, and analyzes the geospatial information of the network. In telecom, used to map cable routes, poles, handholes, service areas, and coverage. The as-built is uploaded to GIS for the entire organization to consult.'
    }
  },
  'Permit': {
    def: {
      es: 'Autorización emitida por la autoridad municipal, estatal o el propietario del derecho de vía para excavar, instalar postes o realizar trabajos en la vía pública. Sin el permiso, no se puede iniciar la construcción. El proceso de obtención puede tardar semanas o meses dependiendo de la jurisdicción.',
      en: 'Authorization issued by the municipal, state authority, or right-of-way owner to excavate, install poles, or perform work in the public right-of-way. Without the permit, construction cannot begin. The approval process can take weeks or months depending on the jurisdiction.'
    }
  },
  'MOT \u2014 Maintenance of Traffic': {
    def: {
      es: 'Plan que especifica cómo se gestionará el flujo vehicular y peatonal mientras se trabaja en la vía pública. Incluye señalización, conos, policías de tránsito o desviaciones. Es un requisito del permiso de construcción y su cumplimiento es obligatorio. También llamado <b>Traffic Control Plan</b>.',
      en: 'Plan specifying how vehicle and pedestrian flow will be managed while working on public roads. Includes signage, cones, traffic officers, or detours. It is a construction permit requirement and its compliance is mandatory. Also called <b>Traffic Control Plan</b>.'
    }
  },
  'Fielding': {
    def: {
      es: 'Visita física al sitio de construcción para verificar las condiciones reales antes o durante el proyecto. Se revisan los postes, las rutas de cable, los obstáculos, el estado del terreno y cualquier diferencia entre los planos y la realidad. Es crítico para identificar problemas de constructabilidad antes de que ocurran en obra.',
      en: 'Physical site visit to verify real conditions before or during the project. Poles, cable routes, obstacles, terrain conditions, and any discrepancy between drawings and reality are reviewed. Critical for identifying constructability issues before they occur in the field.'
    }
  },
  'Fiber Marker / Fink Marker': {
    def: {
      es: 'Dispositivo o señal que indica la ubicación de un cable de fibra subterráneo. Puede ser una estaca, una placa o un marcador electrónico. Sirve para que futuros trabajos en el área no dañen el cable enterrado. Es obligatorio en muchos códigos de construcción para cables nuevos.',
      en: 'Device or sign indicating the location of a buried fiber cable. Can be a stake, a plate, or an electronic marker. Serves to prevent future work in the area from damaging the buried cable. Required by many construction codes for new cables.'
    }
  },
  'Miss / 811 / Utility Locate': {
    def: {
      es: 'Proceso obligatorio antes de cualquier excavación: se notifica a las empresas de servicios (gas, electricidad, agua, telecomunicaciones) para que marquen la ubicación de sus cables o tuberías subterráneas en el área de trabajo. En EUA se llama al <span class="code">811</span> (Call Before You Dig). Excavar sin hacer este proceso puede causar accidentes graves y multas.',
      en: 'Mandatory process before any excavation: utility companies (gas, electric, water, telecom) are notified to mark the location of their underground cables or pipes in the work area. In the USA, call <span class="code">811</span> (Call Before You Dig). Excavating without completing this process can cause serious accidents and fines.'
    }
  }
};

let currentLang = 'es';

// ── TERM INDEX ──
// Category metadata for chips
const CAT_META = {
  'ug':  { label: 'UG',  color: 'var(--c1)', bg: 'var(--c1l)' },
  'vlt': { label: 'VLT', color: 'var(--c2)', bg: 'var(--c2l)' },
  'cab': { label: 'CAB', color: 'var(--c3)', bg: 'var(--c3l)' },
  'eq':  { label: 'EQ',  color: 'var(--c4)', bg: 'var(--c4l)' },
  'aer': { label: 'AER', color: 'var(--c5)', bg: 'var(--c5l)' },
  'doc': { label: 'DOC', color: 'var(--c6)', bg: 'var(--c6l)' },
};

function buildTermIndex() {
  // Collect all term cards with their section category
  var allTerms = [];
  document.querySelectorAll('.section').forEach(function(sec) {
    var catClass = '';
    sec.classList.forEach(function(cls) { if (cls.startsWith('cat-')) catClass = cls.replace('cat-',''); });
    sec.querySelectorAll('.term-card').forEach(function(card) {
      var enEl = card.querySelector('.term-en');
      if (!enEl) return;
      var name = enEl.textContent.trim();
      var id = card.id || '';
      allTerms.push({ name: name, cat: catClass, card: card, section: sec });
    });
  });

  // Give each card an id if missing
  allTerms.forEach(function(t, i) {
    if (!t.card.id) t.card.id = 'term-' + i;
  });

  // Sort alphabetically (ignoring special chars)
  allTerms.sort(function(a, b) {
    var ka = a.name.replace(/[^a-zA-Z0-9]/g,'').toUpperCase();
    var kb = b.name.replace(/[^a-zA-Z0-9]/g,'').toUpperCase();
    return ka.localeCompare(kb);
  });

  // Group by first letter
  var groups = {};
  allTerms.forEach(function(t) {
    var letter = t.name.replace(/[^a-zA-Z0-9]/g,'').charAt(0).toUpperCase() || '#';
    if (!isNaN(letter)) letter = '#';
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push(t);
  });

  var letters = Object.keys(groups).sort(function(a, b) {
    if (a === '#') return 1;
    if (b === '#') return -1;
    return a.localeCompare(b);
  });

  // Update total badge
  var total = allTerms.length;
  document.getElementById('index-total-badge').textContent = total + ' términos';
  document.getElementById('index-count-badge').textContent = total;

  // Build alpha nav
  var nav = document.getElementById('alpha-nav');
  var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('');
  alphabet.forEach(function(l) {
    var btn = document.createElement('button');
    btn.className = 'alpha-btn' + (groups[l] ? ' has-terms' : ' disabled');
    btn.textContent = l;
    if (groups[l]) {
      btn.onclick = function() {
        var el = document.getElementById('alpha-group-' + l);
        if (el) {
          // Open the index panel if collapsed
          var panel = document.getElementById('term-index');
          if (panel.classList.contains('collapsed')) panel.classList.remove('collapsed');
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };
    }
    nav.appendChild(btn);
  });

  // Build groups
  var container = document.getElementById('alpha-groups');
  letters.forEach(function(letter) {
    var group = document.createElement('div');
    group.className = 'alpha-group';
    group.id = 'alpha-group-' + letter;

    var lbl = document.createElement('div');
    lbl.className = 'alpha-group-letter';
    lbl.textContent = letter === '#' ? '0–9' : letter;
    group.appendChild(lbl);

    var items = document.createElement('div');
    items.className = 'alpha-group-items';

    groups[letter].forEach(function(t) {
      var chip = document.createElement('a');
      chip.className = 'index-term-chip';
      chip.href = '#' + t.card.id;

      var meta = CAT_META[t.cat] || { label: t.cat.toUpperCase(), color: 'var(--muted)', bg: 'var(--bg)' };

      var catSpan = document.createElement('span');
      catSpan.className = 'chip-cat';
      catSpan.textContent = meta.label;
      catSpan.style.background = meta.bg;
      catSpan.style.color = meta.color;

      chip.appendChild(document.createTextNode(t.name + ' '));
      chip.appendChild(catSpan);

      // On click: expand the section if collapsed, then scroll
      chip.addEventListener('click', function(e) {
        e.preventDefault();
        var sec = t.section;
        if (sec.classList.contains('collapsed')) sec.classList.remove('collapsed');
        setTimeout(function() {
          t.card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Brief highlight
          t.card.style.transition = 'box-shadow 0.2s, border-color 0.2s';
          t.card.style.boxShadow = '0 0 0 3px rgba(26,107,107,0.25)';
          t.card.style.borderColor = 'var(--c6)';
          setTimeout(function() {
            t.card.style.boxShadow = '';
            t.card.style.borderColor = '';
          }, 1600);
        }, 80);
      });

      items.appendChild(chip);
    });

    group.appendChild(items);
    container.appendChild(group);
  });
}

function toggleTermIndex(hdr) {
  var panel = hdr.closest('.term-index-panel');
  panel.classList.toggle('collapsed');
}

function openTermIndex() {
  var panel = document.getElementById('term-index');
  if (panel) {
    panel.classList.remove('collapsed');
    setTimeout(function() {
      panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }
}

// Build index on load
document.addEventListener('DOMContentLoaded', buildTermIndex);


// ── UI STRINGS FOR LANGUAGE TOGGLE ──
var UI_STRINGS = {
  es: {
    searchPlaceholder:  'Search term / Buscar término...',
    navCategorias:      'Categorías',
    navIndice:          'Índice',
    navResumen:         'Resumen',
    navAlfabetico:      'Índice alfabético',
    statTotal:          'Total definidos',
    statCats:           'Categorías',
    heroEyebrow:        'Uso interno · Telecomunicaciones · Constructabilidad',
    heroSub:            'Guía de referencia para personal de campo, operaciones e ingeniería. Enfocada en el proceso de <strong style="color:#9CE7FF">construcción de red FTTH</strong>: métodos, materiales, equipos y documentación. Los términos aparecen en inglés (idioma de trabajo) con su equivalente en español.',
    btnExpand:          '▼ Expandir todo',
    btnCollapse:        '▲ Colapsar todo',
    indexTitle:         'Índice de Términos',
    indexBadgeSuffix:   ' términos',
    secSubUg:           'Construcción subterránea — métodos de instalación bajo tierra',
    secSubVlt:          'Bóvedas y puntos de acceso subterráneo',
    secSubCab:          'Cable de fibra óptica — tipos según capacidad y uso',
    secSubEq:           'Equipos de red — terminales, empalmes y distribución',
    secSubAer:          'Construcción aérea — instalación sobre postes',
    secSubDoc:          'Diseño, planeación, permisos y entregables de proyecto',
    searchNoticePrefix: 'Resultados para: ',
    footerLeft:         'FiberOps · Field Construction Glossary · Uso interno',
    footerRight:        'Telecomunicaciones · Constructabilidad · v2.0 · 2026'
  },
  en: {
    searchPlaceholder:  'Search term...',
    navCategorias:      'Categories',
    navIndice:          'Index',
    navResumen:         'Summary',
    navAlfabetico:      'Alphabetical index',
    statTotal:          'Total defined',
    statCats:           'Categories',
    heroEyebrow:        'Internal use · Telecommunications · Constructability',
    heroSub:            'Reference guide for field personnel, operations, and engineering. Focused on the <strong style="color:#9CE7FF">FTTH network construction</strong> process: methods, materials, equipment, and documentation. Terms are shown in English (working language).',
    btnExpand:          '▼ Expand all',
    btnCollapse:        '▲ Collapse all',
    indexTitle:         'Term Index',
    indexBadgeSuffix:   ' terms',
    secSubUg:           'Underground construction — subsurface installation methods',
    secSubVlt:          'Vaults and underground access points',
    secSubCab:          'Fiber optic cable — types by capacity and use',
    secSubEq:           'Network equipment — terminals, splices, and distribution',
    secSubAer:          'Aerial construction — pole-mounted installation',
    secSubDoc:          'Design, planning, permits, and project deliverables',
    searchNoticePrefix: 'Results for: ',
    footerLeft:         'FiberOps · Field Construction Glossary · Internal use',
    footerRight:        'Telecommunications · Constructability · v2.0 · 2026'
  }
};

function toggleLang() {
  currentLang = currentLang === 'es' ? 'en' : 'es';
  var s = UI_STRINGS[currentLang];

  // ── Term definitions & notes (existing logic) ──
  document.querySelectorAll('.term-card').forEach(function(card) {
    var termEnEl = card.querySelector('.term-en');
    if (!termEnEl) return;
    var key = termEnEl.textContent.trim();
    var trans = TRANS[key];
    if (!trans) return;
    var defEl = card.querySelector('.term-def');
    var noteEl = card.querySelector('.term-note');
    if (defEl && trans.def) defEl.innerHTML = trans.def[currentLang];
    if (noteEl && trans.note) noteEl.innerHTML = trans.note[currentLang];
  });

  // ── Hide/show .term-es spans ──
  document.querySelectorAll('.term-es').forEach(function(el) {
    el.style.display = currentLang === 'en' ? 'none' : '';
  });

  // ── Search placeholder ──
  var searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.placeholder = s.searchPlaceholder;

  // ── Sidebar nav-section-labels (by order: Categorías, Índice, Resumen) ──
  var navLabels = document.querySelectorAll('.nav-section-label');
  if (navLabels[0]) navLabels[0].textContent = s.navCategorias;
  if (navLabels[1]) navLabels[1].textContent = s.navIndice;
  if (navLabels[2]) navLabels[2].textContent = s.navResumen;

  // ── Sidebar: "Índice alfabético" link text node ──
  var navIndexLink = document.querySelector('.nav-index-link');
  if (navIndexLink) {
    navIndexLink.childNodes.forEach(function(node) {
      if (node.nodeType === 3 && node.textContent.trim()) {
        node.textContent = '\n      ' + s.navAlfabetico + '\n      ';
      }
    });
  }

  // ── Sidebar stat labels ──
  var statLabels = document.querySelectorAll('.stat-lbl');
  if (statLabels[0]) statLabels[0].textContent = s.statTotal;
  if (statLabels[1]) statLabels[1].textContent = s.statCats;

  // ── Hero eyebrow ──
  var eyebrow = document.querySelector('.hero-eyebrow');
  if (eyebrow) eyebrow.textContent = s.heroEyebrow;

  // ── Hero subtitle ──
  var heroSub = document.querySelector('.hero-sub');
  if (heroSub) heroSub.innerHTML = s.heroSub;

  // ── Expand / Collapse all buttons ──
  var btnExpand = document.getElementById('btn-expand-all');
  var btnCollapse = document.getElementById('btn-collapse-all');
  if (btnExpand) btnExpand.textContent = s.btnExpand;
  if (btnCollapse) btnCollapse.textContent = s.btnCollapse;

  // ── Term index title & badge ──
  var indexTitle = document.querySelector('.term-index-title');
  if (indexTitle) indexTitle.textContent = s.indexTitle;
  var indexBadge = document.getElementById('index-total-badge');
  if (indexBadge) {
    var match = indexBadge.textContent.match(/\d+/);
    var n = match ? match[0] : '56';
    indexBadge.textContent = n + s.indexBadgeSuffix;
  }

  // ── Section subtitles ──
  var secSubMap = {
    'ug':  s.secSubUg,
    'vlt': s.secSubVlt,
    'cab': s.secSubCab,
    'eq':  s.secSubEq,
    'aer': s.secSubAer,
    'doc': s.secSubDoc
  };
  Object.keys(secSubMap).forEach(function(id) {
    var sec = document.getElementById(id);
    if (!sec) return;
    var sub = sec.querySelector('.sec-sub');
    if (sub) sub.textContent = secSubMap[id];
  });

  // ── Search notice prefix (text node before the label span) ──
  var searchNotice = document.getElementById('search-notice');
  if (searchNotice) {
    searchNotice.childNodes.forEach(function(node) {
      if (node.nodeType === 3 && node.textContent.trim()) {
        node.textContent = '\n    ' + s.searchNoticePrefix;
      }
    });
  }

  // ── Footer ──
  var footerSpans = document.querySelectorAll('.site-footer span');
  if (footerSpans[0]) footerSpans[0].textContent = s.footerLeft;
  if (footerSpans[1]) footerSpans[1].textContent = s.footerRight;

  // ── Lang button state ──
  var btn = document.getElementById('btn-lang');
  if (currentLang === 'en') {
    btn.textContent = 'ES';
    btn.classList.add('en-active');
  } else {
    btn.textContent = 'EN';
    btn.classList.remove('en-active');
  }
}