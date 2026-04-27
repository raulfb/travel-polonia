const PLACES = [
  // ─────────────────────────────────────────
  // AUSCHWITZ
  // ─────────────────────────────────────────
  {
    id: "auschwitz-i",
    city: "auschwitz",
    cityLabel: "Auschwitz / Oswiecim",
    name: "Auschwitz I — Campo Principal",
    type: "Campo de concentración",
    icon: "⚓",
    color: "#c0392b",
    lat: 50.02701,
    lng: 19.20336,
    description: "El campo original, inaugurado en 1940 para presos políticos polacos. Aquí se encuentra la infame entrada con el letrero 'Arbeit Macht Frei' (El trabajo os hará libres). Fue también donde se realizaron los primeros experimentos con gas Zyklon B en septiembre de 1941.",
    curiosities: [
      "El letrero 'Arbeit Macht Frei' que ves hoy es una replica; el original fue robado en 2009 y recuperado roto en tres partes.",
      "El campo empezó siendo una cuartel del ejército polaco antes de ser convertido en campo de concentración.",
      "El Bloque 11, conocido como el 'bloque de la muerte', tenía celdas de pie donde cuatro personas debían estar de pie durante semanas. Muchos morían de agotamiento.",
      "La primera cámara de gas era en realidad el sótano del Bloque 11, después se trasladó al crematorio.",
      "El comandante Rudolf Höss fue capturado después de la guerra y ejecutado en las horcas situadas a pocos metros de su antigua villa, dentro del propio recinto.",
      "Aquí estuvo prisionero el padre franciscano Maximiliano Kolbe, que ofreció su vida a cambio de la de otro recluso. Fue canonizado en 1982.",
    ],
    practical: {
      entrada: "Reserva online obligatoria (especialmente en verano). Visita guiada recomendada.",
      horario: "8:00–19:00 (verano). Varía según temporada.",
      precio: "La entrada es gratuita para visita libre, guiada ~45 PLN.",
      tiempo: "2-3 horas para este campo solo.",
      aviso: "Lugar de duelo. Se ruega silencio y respeto. No está permitido comer dentro.",
    }
  },
  {
    id: "auschwitz-ii",
    city: "auschwitz",
    cityLabel: "Auschwitz / Birkenau",
    name: "Auschwitz II — Birkenau",
    type: "Campo de exterminio",
    icon: "🚂",
    color: "#922b21",
    lat: 50.03537,
    lng: 19.18376,
    description: "El campo más grande y el verdadero centro de exterminio. Construido en 1941, aquí fueron gaseadas más de un millón de personas, principalmente judíos deportados de toda Europa. La vía de tren penetraba directamente dentro del campo hasta la 'rampa' donde se hacía la selección: vida o muerte en cuestión de segundos.",
    curiosities: [
      "La rampa de selección que ves hoy fue construida en 1944 específicamente para acelerar la deportación de 437.000 judíos húngaros en tan solo 56 días.",
      "Los cuatro grandes crematorios-cámaras de gas fueron volados por los SS en enero de 1945 para destruir las evidencias. Sus ruinas aún son visibles.",
      "El campo llegó a albergar a más de 90.000 prisioneros simultáneamente en barracones diseñados para caballos.",
      "Existía una orquesta de prisioneras obligadas a tocar música alegre mientras las columnas marchaban al trabajo.",
      "El 'Sonderkommando' (prisioneros obligados a trabajar en las cámaras de gas) protagonizó un motín el 7 de octubre de 1944. Volaron el Crematorio IV con explosivos que habían introducido de contrabando mujeres del campo.",
      "Los nazis quemaron documentos y registros, por eso el número exacto de víctimas nunca se podrá saber con certeza.",
    ],
    practical: {
      entrada: "Incluida en el ticket del complejo Auschwitz-Birkenau.",
      horario: "Mismo horario que Auschwitz I.",
      transporte: "Bus de enlace gratuito entre Auschwitz I y II, o 20 min a pie.",
      tiempo: "2-3 horas adicionales. El recinto es enorme.",
      aviso: "Las ruinas de los crematorios y la laguna de cenizas son lugares de entierro. Máximo respeto.",
    }
  },

  // ─────────────────────────────────────────
  // CRACOVIA
  // ─────────────────────────────────────────
  {
    id: "cracovia-fabrica-schindler",
    city: "cracovia",
    cityLabel: "Cracovia",
    name: "Fabrica de Oskar Schindler",
    type: "Museo histórico",
    icon: "🏭",
    color: "#1a5276",
    lat: 50.04793,
    lng: 19.96378,
    description: "La auténtica fábrica de esmaltes donde Oskar Schindler empleó a más de 1.000 judíos del gueto de Cracovia, salvándoles de ser deportados. Hoy alberga un excelente museo sobre la ocupación nazi de Cracovia. La experiencia es muy inmersiva: recreaciones de época, historias personales, fotografías originales.",
    curiosities: [
      "Schindler era un empresario alemán del partido nazi que al principio buscaba mano de obra barata judía por motivos puramente económicos. Con el tiempo se transformó en su protector.",
      "La famosa 'lista de Schindler' no fue un documento redactado de una vez: fue elaborada y enmendada varias veces con ayuda de su contable judío Itzhak Stern.",
      "Al final de la guerra, Schindler había gastado toda su fortuna sobornando a oficiales SS para proteger a 'sus' trabajadores.",
      "Schindler murió en la ruina en 1974. Está enterrado en Jerusalén, siendo uno de los pocos nazis honrados como 'Justo entre las Naciones'.",
      "La película de Spielberg (1993) se rodó en parte en la propia fábrica y en Cracovia.",
    ],
    practical: {
      entrada: "24 PLN aprox. Reserva online muy recomendada.",
      horario: "Mar-Dom 10:00–18:00 (lunes cerrado salvo festivos).",
      tiempo: "2-3 horas mínimo.",
      tip: "Muy concurrido. Ve a primera hora o al cierre.",
    }
  },
  {
    id: "cracovia-gueto",
    city: "cracovia",
    cityLabel: "Cracovia",
    name: "Gueto de Cracovia — Plaza de los Heroes",
    type: "Memorial / Gueto histórico",
    icon: "🪑",
    color: "#1a5276",
    lat: 50.04575,
    lng: 19.95603,
    description: "El gueto judío de Cracovia fue establecido en el barrio de Podgórze en 1941. Aquí vivieron hacinados más de 15.000 judíos en condiciones infrahumanas. La Plaza de los Heroes del Gueto tiene hoy 33 sillas vacías de metal como memorial: representan los muebles que los judíos dejaron en la calle al ser deportados.",
    curiosities: [
      "El gueto ocupaba solo 16 manzanas de casas para más de 15.000 personas. Antes de la guerra, ese mismo espacio lo habitaban 3.000 personas.",
      "Las 33 sillas del memorial representan también los 33 meses de existencia del gueto.",
      "Aún se conservan restos del muro original del gueto en la calle Lwowska 29. Tiene forma de lápidas judías, lo cual se cree fue una burla deliberada de los nazis.",
      "La liquidación del gueto en marzo de 1943 fue especialmente brutal: miles de personas mayores y niños fueron fusilados en el lugar.",
      "El barrio de Kazimierz, al otro lado del Vistula, era el antiguo barrio judío antes de la guerra. Hoy es bohemio y lleno de restaurantes.",
    ],
    practical: {
      entrada: "Gratuita (espacio público).",
      horario: "Siempre accesible.",
      tip: "Combínalo con una visita a pie por el barrio de Kazimierz. El Museo de la Farmacia Bajo el Aguila, en la propia plaza, es muy recomendable.",
    }
  },
  {
    id: "cracovia-plaszow",
    city: "cracovia",
    cityLabel: "Cracovia",
    name: "Campo de Plaszow",
    type: "Campo de concentración (ruinas)",
    icon: "⛰️",
    color: "#1a5276",
    lat: 50.03598,
    lng: 19.96892,
    description: "Campo de concentración dirigido por el sádico comandante Amon Göth, inmortalizado como villano en 'La Lista de Schindler'. Se conservan pocas estructuras, pero el terreno y las colinas donde se ejecutaba a los prisioneros siguen siendo visitables. Un lugar muy solemne y poco turístico.",
    curiosities: [
      "Amon Göth disparaba a prisioneros al azar desde el balcón de su villa por simple placer. Fue ejecutado en Cracovia en 1946.",
      "El campo fue construido sobre dos cementerios judíos, cuyos restos fueron profanados.",
      "Los nazis exhumaron y quemaron miles de cadáveres en las colinas para borrar evidencias cuando el frente se acercó en 1944.",
      "La villa de Göth aún existe y es de propiedad privada. No es visitable pero se puede ver desde fuera.",
    ],
    practical: {
      entrada: "Gratuita. Parque memorial abierto.",
      tiempo: "1 hora caminando por el recinto.",
      aviso: "No hay señalización turística abundante. Lleva el mapa descargado.",
    }
  },
  {
    id: "cracovia-sinagoga",
    city: "cracovia",
    cityLabel: "Cracovia — Kazimierz",
    name: "Sinagoga Vieja de Kazimierz",
    type: "Monumento histórico / Museo",
    icon: "✡️",
    color: "#1a5276",
    lat: 50.05130,
    lng: 19.94740,
    description: "La sinagoga más antigua de Polonia (siglo XV). Fue saqueada y profanada por los nazis y usada como almacén. Hoy es un museo dedicado a la historia y cultura judía de Cracovia. El barrio de Kazimierz a su alrededor conserva la atmósfera del antiguo mundo judío de Polonia.",
    curiosities: [
      "Antes de la guerra, Cracovia tenía 65.000 judíos. Representaban el 25% de la población. Hoy quedan poco más de 200.",
      "Kazimierz era una ciudad independiente fundada por el rey Casimiro el Grande específicamente para acoger judíos expulsados de otros reinos europeos.",
      "Muchos de los judíos que ves representados en las pinturas y figuras de los mercados de Kazimierz son una tradición cuestionada: algunos lo ven como memoria, otros como folclore kitsch.",
    ],
    practical: {
      entrada: "15 PLN aprox.",
      horario: "Dom-Vie. Cerrado sábados (Shabat).",
      tip: "El barrio de Kazimierz tiene varios museos e instituciones judías. Reserva medio día.",
    }
  },

  // ─────────────────────────────────────────
  // VARSOVIA
  // ─────────────────────────────────────────
  {
    id: "varsovia-museo-alzamiento",
    city: "varsovia",
    cityLabel: "Varsovia",
    name: "Museo del Alzamiento de Varsovia",
    type: "Museo histórico",
    icon: "🔫",
    color: "#117a65",
    lat: 52.23204,
    lng: 20.98135,
    description: "Uno de los mejores museos de la IIGM en Europa. Dedicado al Alzamiento de Varsovia de 1944, cuando la resistencia polaca (Armia Krajowa) se levantó contra la ocupación alemana. En 63 días de combates urbanos, 200.000 civiles murieron y la ciudad fue destruida deliberadamente por Hitler hasta los cimientos.",
    curiosities: [
      "El Alzamiento comenzó el 1 de agosto de 1944, cuando el Ejército Rojo soviético estaba a tan solo 10 km. Stalin ordenó detenerse deliberadamente para dejar que los nazis destruyesen el ejército polaco independiente.",
      "Tras la rendición, Hitler ordenó demoler Varsovia ladrillo a ladrillo con equipos de demolición especiales. El 85% de la ciudad fue destruida.",
      "Los insurgentes construyeron una red de 150 km de alcantarillas que usaban para moverse por la ciudad sitiada. El museo tiene una réplica que se puede recorrer.",
      "La RAF y la USAF intentaron lanzar suministros desde Italia, pero Stalin negó permiso para que aterrizasen en aeropuertos soviéticos, haciendo las misiones casi imposibles.",
      "El símbolo 'P' anclada (kotwica) del Alzamiento sigue siendo el símbolo de resistencia polaca más reconocido.",
    ],
    practical: {
      entrada: "30 PLN aprox. Gratis los martes.",
      horario: "Lun, Mie, Vie: 8:00–18:00. Jue: hasta 20:00. Fin de semana: 10:00–18:00.",
      tiempo: "3-4 horas. Es muy extenso.",
      tip: "Uno de los museos más emocionalmente impactantes de toda Europa. No te lo pierdas.",
    }
  },
  {
    id: "varsovia-polin",
    city: "varsovia",
    cityLabel: "Varsovia",
    name: "Museo POLIN — Historia de los Judios Polacos",
    type: "Museo histórico",
    icon: "📖",
    color: "#117a65",
    lat: 52.24964,
    lng: 20.99378,
    description: "Museo de clase mundial situado en el corazón del antiguo gueto de Varsovia. Narra 1.000 años de historia judía en Polonia: desde la llegada en la Edad Media hasta el Holocausto. Edificio espectacular. La galería del Holocausto es devastadora.",
    curiosities: [
      "El nombre 'POLIN' significa en hebreo 'aquí descansarás' — según la leyenda, fue la palabra que los judíos expulsados de Europa escucharon al llegar a Polonia.",
      "Varsovia tenía antes de la guerra 380.000 judíos: el 30% de la población y la mayor comunidad judía de Europa fuera de la URSS.",
      "El gueto de Varsovia era la mayor concentración judía bajo ocupación nazi: 400.000 personas hacinadas en 3,4 km², con una ración de 184 calorías al día.",
      "El Alzamiento del Gueto (abril-mayo 1943, anterior al Alzamiento de Varsovia) fue la primera rebelión urbana contra los nazis en Europa ocupada.",
    ],
    practical: {
      entrada: "35 PLN aprox. Reserva online recomendada.",
      horario: "Lun, Mie, Vie: 10:00–18:00. Jue: hasta 20:00. Sab-Dom: 10:00–20:00.",
      tiempo: "3-4 horas mínimo.",
    }
  },
  {
    id: "varsovia-umschlagplatz",
    city: "varsovia",
    cityLabel: "Varsovia",
    name: "Umschlagplatz",
    type: "Memorial",
    icon: "🪨",
    color: "#117a65",
    lat: 52.25283,
    lng: 20.99506,
    description: "El punto de embarque desde donde 300.000 judíos del gueto de Varsovia fueron deportados a Treblinka entre julio y septiembre de 1942. El monumento actual es sobrio y poderoso: un muro de mármol con los nombres de pila de las víctimas, pues los nazis no registraron sus apellidos.",
    curiosities: [
      "En solo 52 días (operación 'Reinhard'), 265.000 judíos fueron deportados desde aquí a Treblinka, donde fueron gaseados al llegar.",
      "Los deportados recibían 3 kg de pan y 1 kg de mermelada para el viaje para hacerles creer que iban a 'reasentarse al Este'.",
      "El monumento tiene intencionalmente forma de vagón de tren.",
      "Janusz Korczak, famoso pedagogo y escritor judío polaco, se negó a ser liberado y subió voluntariamente al tren con los 192 niños huérfanos de su orfanato.",
    ],
    practical: {
      entrada: "Gratuita (monumento exterior).",
      horario: "Siempre accesible.",
      tip: "Está a 5 minutos caminando del Museo POLIN.",
    }
  },
  {
    id: "varsovia-pawiak",
    city: "varsovia",
    cityLabel: "Varsovia",
    name: "Prision Pawiak",
    type: "Museo / Prisión histórica",
    icon: "⛓️",
    color: "#117a65",
    lat: 52.24700,
    lng: 20.99433,
    description: "La principal prisión de la Gestapo en Varsovia durante la ocupación. Por aquí pasaron 100.000 prisioneros polacos; 37.000 fueron ejecutados en sus muros o deportados a campos de exterminio. Hoy es un museo con los objetos originales de las celdas y las listas de prisioneros.",
    curiosities: [
      "Los nazis dejaron un árbol vivo frente a la prisión cubierto de fichas de metal con nombres de prisioneros. El árbol original murió, pero el memorial fue reproducido y sigue allí.",
      "La Gestapo usaba la prisión también como centro de tortura para extraer información sobre la resistencia.",
      "Muchas personalidades de la cultura y política polaca pasaron por Pawiak antes de ser ejecutadas.",
    ],
    practical: {
      entrada: "Gratuita.",
      horario: "Mie 9:00–17:00, Jue-Vie 9:00–17:00, Sab 10:00–17:00, Dom 10:00–17:00.",
      tiempo: "1-1,5 horas.",
    }
  },

  // ─────────────────────────────────────────
  // GDANSK
  // ─────────────────────────────────────────
  {
    id: "gdansk-westerplatte",
    city: "gdansk",
    cityLabel: "Gdansk",
    name: "Westerplatte — Primer Disparo de la IIGM",
    type: "Memorial histórico",
    icon: "💥",
    color: "#6c3483",
    lat: 54.40326,
    lng: 18.66900,
    description: "El 1 de septiembre de 1939, a las 4:48 de la madrugada, el acorazado alemán Schleswig-Holstein abrió fuego sobre la guarnición polaca de Westerplatte. Fue el primer disparo de la Segunda Guerra Mundial. 182 soldados polacos resistieron durante 7 días contra miles de soldados alemanes antes de rendirse honorablemente.",
    curiosities: [
      "La pequeña guarnición tenía órdenes de resistir solo unas horas para dar tiempo al ejército polaco a movilizarse. Resistieron 7 días.",
      "Los alemanes esperaban tomar Westerplatte en 10 minutos. Enviaron 3.500 soldados contra 182 polacos.",
      "El comandante polaco Major Henryk Sucharski sufrió un colapso nervioso el tercer día. Su subordinado Franciszek Dabrowski lideró la resistencia de facto sin revelar la situación para mantener la moral.",
      "Los defensores se rindieron cuando se quedaron sin munición, agua y medicamentos. Los alemanes les permitieron conservar sus armas de oficiales como reconocimiento a su valor.",
      "El barco que disparó el primer cañonazo, el Schleswig-Holstein, había llegado al puerto de Gdansk días antes como 'visita de cortesía'.",
    ],
    practical: {
      entrada: "Gratuita (zona exterior). Museo en el recinto: ~10 PLN.",
      transporte: "Bus 106 o 138 desde el centro de Gdansk.",
      tiempo: "1,5-2 horas.",
      tip: "Las ruinas del almacén polaco (con impactos de bala aún visibles) son muy impresionantes.",
    }
  },
  {
    id: "gdansk-museo-iigm",
    city: "gdansk",
    cityLabel: "Gdansk",
    name: "Museo de la Segunda Guerra Mundial",
    type: "Museo histórico",
    icon: "🏛️",
    color: "#6c3483",
    lat: 54.35538,
    lng: 18.65363,
    description: "Uno de los museos más modernos y completos sobre la IIGM en el mundo, inaugurado en 2017. Cuenta la guerra desde la perspectiva de los civiles y las víctimas, no solo de los militares. El edificio inclinado y rojo es ya un icono arquitectónico de Gdansk. La exposición principal está a -12 metros bajo tierra.",
    curiosities: [
      "El museo fue muy controvertido: el gobierno polaco intentó fusionarlo con otro museo y despidió a su director por considerar que no era suficientemente 'patriótico polaco'.",
      "La exposición cubre no solo Europa: incluye el frente del Pacifico, el Africa Corps, China y la Guerra Civil Española como preludio.",
      "Hay un tanque T-34 soviético, una locomotora de época, objetos personales de víctimas del Holocausto y reconstrucciones a escala real de ciudades bombardeadas.",
      "Gdansk (entonces llamada Danzig) era una ciudad libre bajo mandato de la Liga de Naciones. La reclamación nazi de Danzig fue uno de los pretextos para invadir Polonia.",
    ],
    practical: {
      entrada: "30 PLN aprox. Gratis los domingos.",
      horario: "Mar-Dom 10:00–19:00 (temporada alta). Lunes cerrado.",
      tiempo: "3-4 horas mínimo.",
      tip: "El museo cierra la entrada 1 hora antes de cerrar. Llega con tiempo.",
    }
  },
  {
    id: "gdansk-correos",
    city: "gdansk",
    cityLabel: "Gdansk",
    name: "Oficina de Correos Polaca — Defensa de 1939",
    type: "Memorial / Museo",
    icon: "✉️",
    color: "#6c3483",
    lat: 54.35230,
    lng: 18.65170,
    description: "El 1 de septiembre de 1939, junto al ataque a Westerplatte, un grupo de 57 funcionarios de correos polacos resistió durante 15 horas el asalto de las SS y tropas alemanas. Fueron fusilados como 'francos tiradores'. Hoy el edificio es un museo dedicado a su heroica defensa.",
    curiosities: [
      "Los funcionarios no eran soldados: eran empleados de correos con escasa formación militar. Aún así resistieron 15 horas con armas ligeras.",
      "Los alemanes usaron un camión de bomberos con gasolina para incendiar el edificio y obligarles a salir.",
      "Fueron juzgados en un juicio sumario de menos de una hora y fusilados el mismo día. Sus familias no fueron informadas.",
      "El Tribunal Supremo polaco rehabilitó su memoria en 1998, confirmando que actuaron como defensores legítimos.",
      "Günter Grass, premio Nobel de Literatura y nacido en Danzig, hizo famosa esta historia en su novela 'El Tambor de Hojalata'.",
    ],
    practical: {
      entrada: "15 PLN aprox.",
      horario: "Mar-Dom 10:00–18:00.",
      tiempo: "1-1,5 horas.",
    }
  },
];

const CITY_COLORS = {
  auschwitz: "#c0392b",
  cracovia: "#1a5276",
  varsovia: "#117a65",
  gdansk: "#6c3483",
};

const CITY_ORDER = ["auschwitz", "cracovia", "varsovia", "gdansk"];

const CITY_CENTERS = {
  auschwitz: [50.031, 19.195],
  cracovia: [50.0614, 19.9366],
  varsovia: [52.2297, 21.0122],
  gdansk: [54.3520, 18.6466],
};
