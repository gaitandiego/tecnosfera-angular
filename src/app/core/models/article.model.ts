// Modelo de una noticia. Los nombres de los campos son los mismos que trae
// data/news.json, así que el JSON se consume sin transformaciones.

export type ArticleCategory = 'technology' | 'networks' | 'security' | 'ai';

// El cuerpo de la noticia viene como una lista de bloques: párrafos y subtítulos.
export interface ContentBlock {
  readonly type: 'p' | 'h3';
  readonly text: string;
}

export interface Article {
  readonly id: string;
  readonly title: string;
  readonly category: ArticleCategory;

  // Fecha de publicación en formato YYYY-MM-DD.
  readonly date: string;
  readonly author: string;
  readonly readingTime: number;

  // Ruta de la imagen (img/news-01.svg). Si es null se muestra el marcador.
  readonly image: string | null;
  readonly caption: string;
  readonly summary: string;

  // cover marca la noticia de portada; featured, las destacadas del inicio.
  readonly cover: boolean;
  readonly featured: boolean;
  readonly content: readonly ContentBlock[];
}

// Datos que llegan desde el formulario de gestión.
export interface ArticleDraft {
  readonly title: string;
  readonly category: ArticleCategory;
  readonly image: string | null;
  readonly summary: string;
  readonly content: string;
  readonly author: string;
}
