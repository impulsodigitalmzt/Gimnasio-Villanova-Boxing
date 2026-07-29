const eventPhoto = (name: string) => `/Eventos/fotos/${name}`;
const eventVideo = (name: string) => `/Eventos/videos/${name}`;

export const oceanFightNight = {
  name: 'Ocean Fight Night',
  hero: eventPhoto('743996065_1610202344438217_1978835452550022204_n.jpg'),
  nightScene: eventPhoto('702241005_18091330469252708_7369719696191240629_n.jpg'),
  featuredPoster: eventPhoto('695788316_18090962984252708_2553461239787938425_n.jpg'),
  sponsors: eventPhoto('694605192_18090746717252708_6310615972385733572_n.jpg'),
} as const;

export const eventMoments = [
  {
    src: eventPhoto('702163569_18091330496252708_1715451908301156367_n.jpg'),
    alt: 'Ring de Ocean Fight Night frente al mar durante el atardecer',
    title: 'El ring frente al mar',
    copy: 'Una postal única de Mazatlán antes de comenzar la función.',
  },
  {
    src: eventPhoto('743996065_1610202344438217_1978835452550022204_n.jpg'),
    alt: 'Público disfrutando Ocean Fight Night al atardecer',
    title: 'Una noche para todos',
    copy: 'Familias, amigos y aficionados reunidos alrededor del ring.',
  },
  {
    src: eventPhoto('702241005_18091330469252708_7369719696191240629_n.jpg'),
    alt: 'Ring iluminado y público durante Ocean Fight Night',
    title: 'La función en vivo',
    copy: 'Luces, público y boxeo amateur en una atmósfera inolvidable.',
  },
  {
    src: eventPhoto('696344492_18091330478252708_5850622053182686692_n.jpg'),
    alt: 'Público reunido alrededor del ring durante la noche',
    title: 'Adrenalina alrededor del ring',
    copy: 'La comunidad vive cada round desde muy cerca.',
  },
  {
    src: eventPhoto('700379501_18091330487252708_4422013643120650143_n.jpg'),
    alt: 'Entrenador atendiendo a un peleador en la esquina',
    title: 'La esquina Villanova',
    copy: 'Orientación, cuidado y estrategia entre cada round.',
  },
  {
    src: eventPhoto('700109897_18091330460252708_4468228580141734174_n.jpg'),
    alt: 'Presentación de un peleador antes de subir al ring',
    title: 'El momento de salir',
    copy: 'Cada peleador entra acompañado por su equipo y su comunidad.',
  },
] as const;

export const eventPosters = [
  {
    src: eventPhoto('658798071_18088977041252708_1445315406203436050_n.jpg'),
    alt: 'Cartel de Fernando El Búho López para Ocean Fight Night',
  },
  {
    src: eventPhoto('670550755_18088448606252708_5940485038468961549_n.jpg'),
    alt: 'Cartel de Bruno Orozco para Ocean Fight Night',
  },
  {
    src: eventPhoto('670675306_18088448597252708_3653820619240838534_n.jpg'),
    alt: 'Cartel de Patricio Velasco para Ocean Fight Night',
  },
  {
    src: eventPhoto('670774178_18088448579252708_6986398655155038135_n.jpg'),
    alt: 'Cartel de Diego Robles para Ocean Fight Night',
  },
  {
    src: eventPhoto('671260714_18088448588252708_2581686625217284277_n.jpg'),
    alt: 'Cartel de Emiliano Orozco para Ocean Fight Night',
  },
  {
    src: eventPhoto('671794254_18088448615252708_5134358323398278038_n.jpg'),
    alt: 'Cartel de Guillermo Pérez para Ocean Fight Night',
  },
  {
    src: eventPhoto('673054349_18088977020252708_5495829715197087836_n.jpg'),
    alt: 'Cartel de Jesús El Chumy Bañuelos para Ocean Fight Night',
  },
  {
    src: eventPhoto('673114305_18088977050252708_6039749679606707337_n.jpg'),
    alt: 'Cartel de Jeremy Zazueta para Ocean Fight Night',
  },
  {
    src: eventPhoto('673800736_18088448576252708_6427537200131098401_n.jpg'),
    alt: 'Cartel de Ricardo El Richi Sánchez para Ocean Fight Night',
  },
  {
    src: eventPhoto('675496586_18088977032252708_3570038651494309446_n.jpg'),
    alt: 'Cartel de Miguel Lizárraga para Ocean Fight Night',
  },
] as const;

export const eventVideos = [
  {
    src: eventVideo(
      'AQM8CjVSNc5eDGFZGHnwzDFWZY5DJgsMn6PIvF9H2Fz2SPwdgLNz4oTrF-86xlVIPEs-CwZJYECXUqM0-Xirn7p0io_gAKT5ZyCzhyo.mp4',
    ),
    title: 'Ocean Fight Night',
    copy: 'La emoción de la función desde adentro.',
  },
  {
    src: eventVideo(
      'AQN9Ah9mLrNi8lv18U5DfIOaiKjvaz48mzeOdB0Nyj33cQWxHBVBxR-GaY7l_OUcV499jYjcBSyg-EtlZPBtZsOY5gwfyPt8rR9_sqWiPA.mp4',
    ),
    title: 'Acción en el ring',
    copy: 'Rounds, técnica y el apoyo del público.',
  },
  {
    src: eventVideo(
      'AQNyM6Ns9xkKX0JkUcyE5z0e4NFEhk2xZoaT1S8dKp2Z4EnR5zfQxFa_Yqib4mm-rNqC0fNnJz8CQk6_EVv195yfFvzAyFhANZH5Y48.mp4',
    ),
    title: 'Una noche diferente',
    copy: 'Boxeo amateur junto al mar en Mazatlán.',
  },
  {
    src: eventVideo(
      'AQOVvkewSX5KahkbqJHvo1eJ7zw75S-2k0XxU9LJyqyeI16YM707shPrDETLHzptehfXo2iZanjNgBgoUB_GCG-I6t6Y-vFk4CHjEcxLGg.mp4',
    ),
    title: 'La comunidad presente',
    copy: 'Familias y aficionados viviendo cada combate.',
  },
  {
    src: eventVideo(
      'AQPYsH9BDO-M2yCLAq25yY3V2xSH3tw64obtvgnimunGH4gYy7eltumpt7u4xoWeanZu8QnuWz9pse5A8tgcYFrD0KTGyafhRJB7dXU.mp4',
    ),
    title: 'Detrás de la cartelera',
    copy: 'Peleadores, esquinas y momentos que forman historia.',
  },
] as const;
