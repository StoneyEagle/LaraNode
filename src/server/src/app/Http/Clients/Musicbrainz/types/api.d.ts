export type RelationsIncludes =
  'area-rels'
  | 'artist-rels'
  | 'event-rels'
  | 'instrument-rels'
  | 'label-rels'
  | 'place-rels'
  | 'recording-rels'
  | 'release-rels'
  | 'release-group-rels'
  | 'series-rels'
  | 'url-rels'
  | 'work-rels';

export type SubQueryIncludes =
  /**
   * include discids for all media in the releases
   */
  'discids'
  /**
   * include media for all releases, this includes the # of tracks on each medium and its format.
   */
  | 'media'
  /**
   * include isrcs for all recordings
   */
  | 'isrcs'
  /**
   * include artists credits for all releases and recordings
   */
  | 'artist-credits'
  /**
   * include only those releases where the artist appears on one of the tracks, only valid on artists in combination with `releases`
   */
  | 'various-artists';

export type MiscIncludes =
  'aliases'
  | 'annotation'
  | 'tags'
  | 'genres'
  | 'ratings'
  | 'media';

export type AreaIncludes = MiscIncludes | RelationsIncludes;

export type ArtistIncludes =
  MiscIncludes
  | RelationsIncludes
  | 'recordings'
  | 'releases'
  | 'release-groups'
  | 'works';

export type CollectionIncludes =
  MiscIncludes
  | RelationsIncludes
  | 'user-collections';

export type EventIncludes = MiscIncludes | RelationsIncludes;

export type GenreIncludes = MiscIncludes;

export type InstrumentIncludes = MiscIncludes | RelationsIncludes;

export type LabelIncludes =
  MiscIncludes
  | RelationsIncludes
  | 'releases';

export type PlaceIncludes = MiscIncludes | RelationsIncludes;

export type RecordingIncludes =
  MiscIncludes
  | RelationsIncludes
  | SubQueryIncludes
  | 'artists'
  | 'releases'
  | 'isrcs';

export type ReleasesIncludes =
  MiscIncludes
  | SubQueryIncludes
  | RelationsIncludes
  | 'artists'
  | 'collections'
  | 'labels'
  | 'recordings'
  | 'release-groups';

export type ReleaseGroupIncludes =
  MiscIncludes
  | SubQueryIncludes
  | RelationsIncludes
  | 'artists'
  | 'releases';

export type SeriesIncludes = MiscIncludes | RelationsIncludes;

export type WorkIncludes = MiscIncludes | RelationsIncludes;

export type UrlIncludes = RelationsIncludes;

export type FormData = { [key: string]: string | number; };
