// Textos legales de diahabil.es. Revisar antes de activar AdSense o analítica:
// en ese momento hay que actualizar privacidad y cookies e instalar un gestor de consentimiento.

export const TITULAR = {
  proyecto: 'RANKOVA',
  entidad: 'ASOCIACIÓN ESTUDIANTIL JUNIOR EMPRESA OPPAL',
  nif: 'G75298281',
  registro: { es: 'Registro de Asociaciones de Cataluña, número 76334', ca: "Registre d'Associacions de Catalunya, número 76334" },
  domicilio: "Carrer de la Ciutat d'Asunción, 16, 08030 Barcelona, España",
  email: 'contacto@rankova.es',
};

export const ACTUALIZADO = { es: '21 de octubre de 2026', ca: "21 d'octubre de 2026" };

const mail = `<a href="mailto:${TITULAR.email}">${TITULAR.email}</a>`;

const identificacion = {
  es: `<ul>
    <li>Titular: ${TITULAR.proyecto}, proyecto de la ${TITULAR.entidad}</li>
    <li>NIF: ${TITULAR.nif}</li>
    <li>Inscripción: ${TITULAR.registro.es}</li>
    <li>Domicilio: ${TITULAR.domicilio}</li>
    <li>Correo electrónico: ${mail}</li>
  </ul>`,
  ca: `<ul>
    <li>Titular: ${TITULAR.proyecto}, projecte de l'${TITULAR.entidad}</li>
    <li>NIF: ${TITULAR.nif}</li>
    <li>Inscripció: ${TITULAR.registro.ca}</li>
    <li>Domicili: Carrer de la Ciutat d'Asunción, 16, 08030 Barcelona, Espanya</li>
    <li>Correu electrònic: ${mail}</li>
  </ul>`,
};

export const paginas = {
  avisoLegal: {
    es: {
      titulo: 'Aviso legal',
      secciones: [
        ['Identificación del titular', `<p>En cumplimiento del artículo 10 de la Ley 34/2002, de servicios de la sociedad de la información y de comercio electrónico, se informa de que el sitio web diahabil.es pertenece a:</p>${identificacion.es}`],
        ['Objeto', '<p>diahabil.es ofrece de forma gratuita una calculadora de plazos administrativos y el calendario de festivos de los municipios de Cataluña, elaborados a partir de fuentes oficiales.</p>'],
        ['Carácter orientativo de la información', '<p>Los resultados de la calculadora y los calendarios son orientativos. Se elaboran a partir de las normas publicadas en el Diari Oficial de la Generalitat de Catalunya y en el Boletín Oficial del Estado, pero pueden contener errores o no reflejar modificaciones posteriores. No constituyen asesoramiento jurídico ni sustituyen la consulta al órgano administrativo competente o a un profesional. Antes de presentar un escrito en el último día de un plazo, compruebe la fecha con la notificación recibida o con el órgano que la emitió.</p><p>La calculadora aplica las reglas del artículo 30 de la Ley 39/2015, de 1 de octubre. No es válida para plazos judiciales ni para plazos señalados en horas. Los límites conocidos se describen en la página de metodología.</p>'],
        ['Propiedad intelectual', '<p>El diseño, el código y los textos de este sitio pertenecen a su titular o se usan con autorización. Los datos de festivos proceden de disposiciones oficiales y de los datos abiertos de la Generalitat de Catalunya, que se reutilizan conforme a sus condiciones de uso.</p>'],
        ['Enlaces', '<p>Este sitio puede incluir enlaces a páginas de terceros, como boletines oficiales. El titular no es responsable de su contenido ni de su disponibilidad.</p>'],
        ['Disponibilidad', '<p>El titular puede modificar, suspender o retirar el sitio o sus contenidos sin previo aviso, y no responde de las interrupciones o errores técnicos ajenos a su control.</p>'],
        ['Legislación aplicable', '<p>Este aviso legal se rige por la legislación española. Para cualquier controversia serán competentes los juzgados y tribunales del domicilio de la persona usuaria cuando tenga la condición de consumidora y, en otro caso, los de Barcelona.</p>'],
      ],
    },
    ca: {
      titulo: 'Avís legal',
      secciones: [
        ['Identificació del titular', `<p>En compliment de l'article 10 de la Llei 34/2002, de serveis de la societat de la informació i de comerç electrònic, s'informa que el lloc web diahabil.es pertany a:</p>${identificacion.ca}`],
        ['Objecte', '<p>diahabil.es ofereix de manera gratuïta una calculadora de terminis administratius i el calendari de festius dels municipis de Catalunya, elaborats a partir de fonts oficials.</p>'],
        ['Caràcter orientatiu de la informació', "<p>Els resultats de la calculadora i els calendaris són orientatius. S'elaboren a partir de les normes publicades al Diari Oficial de la Generalitat de Catalunya i al Butlletí Oficial de l'Estat, però poden contenir errors o no recollir modificacions posteriors. No constitueixen assessorament jurídic ni substitueixen la consulta a l'òrgan administratiu competent o a un professional. Abans de presentar un escrit l'últim dia d'un termini, comproveu la data amb la notificació rebuda o amb l'òrgan que la va emetre.</p><p>La calculadora aplica les regles de l'article 30 de la Llei 39/2015, d'1 d'octubre. No és vàlida per a terminis judicials ni per a terminis assenyalats en hores. Els límits coneguts es descriuen a la pàgina de metodologia.</p>"],
        ['Propietat intel·lectual', "<p>El disseny, el codi i els textos d'aquest lloc pertanyen al seu titular o s'utilitzen amb autorització. Les dades de festius provenen de disposicions oficials i de les dades obertes de la Generalitat de Catalunya, que es reutilitzen d'acord amb les seves condicions d'ús.</p>"],
        ['Enllaços', "<p>Aquest lloc pot incloure enllaços a pàgines de tercers, com ara butlletins oficials. El titular no és responsable del seu contingut ni de la seva disponibilitat.</p>"],
        ['Disponibilitat', '<p>El titular pot modificar, suspendre o retirar el lloc o els seus continguts sense avís previ, i no respon de les interrupcions o els errors tècnics aliens al seu control.</p>'],
        ['Legislació aplicable', "<p>Aquest avís legal es regeix per la legislació espanyola. Per a qualsevol controvèrsia seran competents els jutjats i tribunals del domicili de la persona usuària quan tingui la condició de consumidora i, altrament, els de Barcelona.</p>"],
      ],
    },
  },

  privacidad: {
    es: {
      titulo: 'Política de privacidad',
      secciones: [
        ['Responsable del tratamiento', identificacion.es],
        ['Qué datos tratamos', '<p>diahabil.es no tiene formularios, registro de usuarios ni boletines. Los datos que introduce en la calculadora (fechas, plazos y municipios) se procesan únicamente en su navegador y no se envían a ningún servidor.</p><p>Solo se tratan estos datos:</p><ul><li><strong>Datos técnicos de la conexión.</strong> Al visitar el sitio, el servidor y la red de distribución registran de forma automática la dirección IP, la fecha y hora, la página solicitada y el navegador utilizado. Se usan para servir la web, garantizar su seguridad y detectar errores o abusos. Base jurídica: interés legítimo del responsable en el funcionamiento seguro del sitio (artículo 6.1.f del RGPD). Se conservan como máximo 30 días, salvo que sean necesarios para investigar un incidente de seguridad.</li><li><strong>Correos que nos envíe.</strong> Si escribe a la dirección de contacto, trataremos su dirección de correo y el contenido del mensaje para responderle. Base jurídica: su consentimiento al escribirnos y nuestro interés legítimo en atender la consulta. Se conservan mientras dure la consulta y, después, el tiempo necesario para atender posibles responsabilidades.</li></ul>'],
        ['Encargados del tratamiento y transferencias', '<ul><li><strong>Hetzner Online GmbH</strong> (Alemania): alojamiento del sitio en servidores situados en la Unión Europea.</li><li><strong>Cloudflare, Inc.</strong> (Estados Unidos): red de distribución de contenidos y protección frente a ataques. Puede tratar datos técnicos de la conexión fuera del Espacio Económico Europeo. Cloudflare está adherida al Marco de Privacidad de Datos UE-EE. UU. y aplica cláusulas contractuales tipo aprobadas por la Comisión Europea.</li></ul><p>No cedemos datos a terceros salvo obligación legal.</p>'],
        ['Sus derechos', `<p>Puede ejercer los derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad escribiendo a ${mail}. Si considera que no hemos atendido correctamente su solicitud, puede presentar una reclamación ante la Agencia Española de Protección de Datos (<a href="https://www.aepd.es">www.aepd.es</a>).</p>`],
        ['Cambios', '<p>Si en el futuro el sitio incorpora publicidad o herramientas de analítica, esta política se actualizará antes de activarlas y se informará de ello en la propia web.</p>'],
      ],
    },
    ca: {
      titulo: 'Política de privacitat',
      secciones: [
        ['Responsable del tractament', identificacion.ca],
        ['Quines dades tractem', "<p>diahabil.es no té formularis, registre d'usuaris ni butlletins. Les dades que introduïu a la calculadora (dates, terminis i municipis) es processen únicament al vostre navegador i no s'envien a cap servidor.</p><p>Només es tracten aquestes dades:</p><ul><li><strong>Dades tècniques de la connexió.</strong> En visitar el lloc, el servidor i la xarxa de distribució registren de manera automàtica l'adreça IP, la data i l'hora, la pàgina sol·licitada i el navegador utilitzat. S'utilitzen per servir el web, garantir-ne la seguretat i detectar errors o abusos. Base jurídica: interès legítim del responsable en el funcionament segur del lloc (article 6.1.f del RGPD). Es conserven com a màxim 30 dies, llevat que siguin necessàries per investigar un incident de seguretat.</li><li><strong>Correus que ens envieu.</strong> Si escriviu a l'adreça de contacte, tractarem la vostra adreça de correu i el contingut del missatge per respondre-us. Base jurídica: el vostre consentiment en escriure'ns i el nostre interès legítim a atendre la consulta. Es conserven mentre duri la consulta i, després, el temps necessari per atendre possibles responsabilitats.</li></ul>"],
        ['Encarregats del tractament i transferències', "<ul><li><strong>Hetzner Online GmbH</strong> (Alemanya): allotjament del lloc en servidors situats a la Unió Europea.</li><li><strong>Cloudflare, Inc.</strong> (Estats Units): xarxa de distribució de continguts i protecció contra atacs. Pot tractar dades tècniques de la connexió fora de l'Espai Econòmic Europeu. Cloudflare està adherida al Marc de Privacitat de Dades UE-EUA i aplica clàusules contractuals tipus aprovades per la Comissió Europea.</li></ul><p>No cedim dades a tercers llevat d'obligació legal.</p>"],
        ['Els vostres drets', `<p>Podeu exercir els drets d'accés, rectificació, supressió, oposició, limitació del tractament i portabilitat escrivint a ${mail}. Si considereu que no hem atès correctament la vostra sol·licitud, podeu presentar una reclamació a l'Agència Espanyola de Protecció de Dades (<a href="https://www.aepd.es">www.aepd.es</a>).</p>`],
        ['Canvis', "<p>Si en el futur el lloc incorpora publicitat o eines d'analítica, aquesta política s'actualitzarà abans d'activar-les i se n'informarà al mateix web.</p>"],
      ],
    },
  },

  cookies: {
    es: {
      titulo: 'Política de cookies',
      secciones: [
        ['Qué son las cookies', '<p>Las cookies son pequeños archivos que un sitio web guarda en su navegador para recordar información entre visitas o para su funcionamiento.</p>'],
        ['Cookies que usa este sitio', '<p>diahabil.es no instala cookies propias, ni de análisis, ni de publicidad.</p><p>La red de distribución Cloudflare, que protege el sitio, puede instalar una cookie técnica de seguridad (por ejemplo, <code>__cf_bm</code>, con una duración de 30 minutos) para distinguir el tráfico legítimo del automatizado. Es estrictamente necesaria para prestar el servicio de forma segura y, por eso, está exenta de consentimiento según el artículo 22.2 de la Ley 34/2002.</p>'],
        ['Responsable', identificacion.es],
        ['Cómo gestionarlas', '<p>Puede bloquear o eliminar las cookies desde la configuración de su navegador. El sitio seguirá funcionando, aunque la protección frente a tráfico automatizado podría mostrarle alguna verificación adicional.</p>'],
        ['Cambios', '<p>Si el sitio incorpora publicidad o analítica, se actualizará esta política y se mostrará un aviso para que pueda aceptar o rechazar las cookies que no sean necesarias antes de que se instalen.</p>'],
      ],
    },
    ca: {
      titulo: 'Política de galetes',
      secciones: [
        ['Què són les galetes', "<p>Les galetes són petits fitxers que un lloc web desa al vostre navegador per recordar informació entre visites o per al seu funcionament.</p>"],
        ['Galetes que utilitza aquest lloc', "<p>diahabil.es no instal·la galetes pròpies, ni d'anàlisi, ni de publicitat.</p><p>La xarxa de distribució Cloudflare, que protegeix el lloc, pot instal·lar una galeta tècnica de seguretat (per exemple, <code>__cf_bm</code>, amb una durada de 30 minuts) per distingir el trànsit legítim de l'automatitzat. És estrictament necessària per prestar el servei de manera segura i, per això, està exempta de consentiment segons l'article 22.2 de la Llei 34/2002.</p>"],
        ['Responsable', identificacion.ca],
        ['Com gestionar-les', "<p>Podeu bloquejar o eliminar les galetes des de la configuració del vostre navegador. El lloc continuarà funcionant, tot i que la protecció contra el trànsit automatitzat us podria mostrar alguna verificació addicional.</p>"],
        ['Canvis', "<p>Si el lloc incorpora publicitat o analítica, s'actualitzarà aquesta política i es mostrarà un avís perquè pugueu acceptar o rebutjar les galetes que no siguin necessàries abans que s'instal·lin.</p>"],
      ],
    },
  },

  condiciones: {
    es: {
      titulo: 'Condiciones de uso',
      secciones: [
        ['Aceptación', '<p>El uso de diahabil.es es gratuito y no requiere registro. Al utilizarlo, acepta estas condiciones y el aviso legal.</p>'],
        ['Uso de la calculadora', '<p>La calculadora estima la fecha de vencimiento de un plazo administrativo con los datos que usted introduce. Usted es responsable de introducir correctamente la fecha de notificación, la duración del plazo, la unidad y los municipios, y de comprobar que el plazo se rige por la Ley 39/2015. El resultado es orientativo: si duda, consulte al órgano que le notificó o a un profesional.</p>'],
        ['Responsabilidad', '<p>El titular revisa los datos con fuentes oficiales y somete el cálculo a pruebas, pero no garantiza la ausencia de errores. En la medida en que lo permita la ley, no responde de los daños derivados de decisiones tomadas a partir de la información de este sitio, como la presentación de un escrito fuera de plazo.</p>'],
        ['Usos no permitidos', '<p>No está permitido usar el sitio para fines ilícitos, intentar dañar su funcionamiento ni extraer sus contenidos de forma masiva o automatizada sin autorización.</p>'],
        ['Avisos de errores', `<p>Si detecta un error en un festivo o en un cálculo, escríbanos a ${mail}. Revisaremos cada aviso con la fuente oficial.</p>`],
        ['Legislación aplicable', '<p>Estas condiciones se rigen por la legislación española. Para cualquier controversia serán competentes los juzgados y tribunales del domicilio de la persona usuaria cuando tenga la condición de consumidora y, en otro caso, los de Barcelona.</p>'],
      ],
    },
    ca: {
      titulo: "Condicions d'ús",
      secciones: [
        ['Acceptació', "<p>L'ús de diahabil.es és gratuït i no requereix registre. En utilitzar-lo, accepteu aquestes condicions i l'avís legal.</p>"],
        ['Ús de la calculadora', "<p>La calculadora estima la data de venciment d'un termini administratiu amb les dades que hi introduïu. Sou responsables d'introduir correctament la data de notificació, la durada del termini, la unitat i els municipis, i de comprovar que el termini es regeix per la Llei 39/2015. El resultat és orientatiu: si teniu dubtes, consulteu l'òrgan que us va notificar o un professional.</p>"],
        ['Responsabilitat', "<p>El titular revisa les dades amb fonts oficials i sotmet el càlcul a proves, però no garanteix l'absència d'errors. En la mesura que ho permeti la llei, no respon dels danys derivats de decisions preses a partir de la informació d'aquest lloc, com ara la presentació d'un escrit fora de termini.</p>"],
        ['Usos no permesos', "<p>No es permet utilitzar el lloc per a finalitats il·lícites, intentar danyar-ne el funcionament ni extreure'n els continguts de manera massiva o automatitzada sense autorització.</p>"],
        ["Avisos d'errors", `<p>Si detecteu un error en un festiu o en un càlcul, escriviu-nos a ${mail}. Revisarem cada avís amb la font oficial.</p>`],
        ['Legislació aplicable', "<p>Aquestes condicions es regeixen per la legislació espanyola. Per a qualsevol controvèrsia seran competents els jutjats i tribunals del domicili de la persona usuària quan tingui la condició de consumidora i, altrament, els de Barcelona.</p>"],
      ],
    },
  },

  contacto: {
    es: {
      titulo: 'Contacto',
      secciones: [
        ['Escríbenos', `<p>Para avisar de un error en un festivo o en un cálculo, proponer una mejora o cualquier otra consulta, escribe a ${mail}.</p><p>Si nos avisas de un error, indica el municipio, la fecha y, si la tienes, la fuente oficial (por ejemplo, el bando del ayuntamiento o la orden del DOGC). Revisamos cada aviso con la fuente oficial antes de corregir los datos.</p><p>No podemos asesorar sobre casos concretos ni confirmar plazos de procedimientos particulares: para eso, consulta al órgano que te notificó o a un profesional.</p>`],
        ['Quién está detrás', `<p>diahabil.es es un proyecto de ${TITULAR.proyecto}, de la ${TITULAR.entidad} (NIF ${TITULAR.nif}), con domicilio en ${TITULAR.domicilio}.</p>`],
      ],
    },
    ca: {
      titulo: 'Contacte',
      secciones: [
        ["Escriu-nos", `<p>Per avisar d'un error en un festiu o en un càlcul, proposar una millora o qualsevol altra consulta, escriu a ${mail}.</p><p>Si ens avises d'un error, indica el municipi, la data i, si la tens, la font oficial (per exemple, el ban de l'ajuntament o l'ordre del DOGC). Revisem cada avís amb la font oficial abans de corregir les dades.</p><p>No podem assessorar sobre casos concrets ni confirmar terminis de procediments particulars: per a això, consulta l'òrgan que et va notificar o un professional.</p>`],
        ['Qui hi ha darrere', `<p>diahabil.es és un projecte de ${TITULAR.proyecto}, de l'${TITULAR.entidad} (NIF ${TITULAR.nif}), amb domicili a Carrer de la Ciutat d'Asunción, 16, 08030 Barcelona.</p>`],
      ],
    },
  },
};

export const rutasLegales = {
  avisoLegal: { es: '/es/aviso-legal/', ca: '/ca/avis-legal/' },
  privacidad: { es: '/es/privacidad/', ca: '/ca/privacitat/' },
  cookies: { es: '/es/cookies/', ca: '/ca/galetes/' },
  condiciones: { es: '/es/condiciones-de-uso/', ca: '/ca/condicions-d-us/' },
  contacto: { es: '/es/contacto/', ca: '/ca/contacte/' },
};
