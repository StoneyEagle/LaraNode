import { FormData } from "./api";
import DateTimeFormat = Intl.DateTimeFormat;

export interface Period {
  'begin': string;
  'ended': boolean;
  'end': string;
}

export interface Entity {
  id: string;
}

export interface Area extends Entity {
  'iso-3166-1-codes': string[];
  name: string;
  'sort-name': string;
  disambiguation: string;
}

export interface Alias extends Entity {
  name: string;
  'sort-name': string;
  ended: boolean;
  'type-id': string;
  type: string;
  locale: string;
  primary: string;
  begin: string;
  end: string;
}

export interface Match {
  score: number; // ToDo: provide feedback: should be a number
}

export interface Artist extends Entity {
  name: string;
  disambiguation: string;
  'sort-name': string;
  'type-id'?: string;
  'gender-id'?: string;
  'life-span'?: Period;
  country?: string;
  ipis?: any[]; // ToDo
  isnis?: string[];
  aliases?: Alias[];
  gender?: string;
  type?: string;
  area?: Area;
  begin_area?: Area;
  end_area?: Area;
  relations?: Relation[];
  /**
   * Only defined if 'releases' are includes
   */
  releases?: Release[];
  'release-groups'?: ReleaseGroup[];
}

export interface ArtistCredit {
  artist: Artist;
  joinphrase: string;
  name: string;
}

export interface Collection extends Entity {
  type: string;
  name: string;
  'type-id': string;
  'recording-count': number;
  editor: string;
  'entity-type': string;
}

export interface Event extends Entity {
  cancelled: boolean;
  type: string;
  'life-span': Period;
  disambiguation: string;
  'type-id': string;
  time: string;
  setlist: string;
  name: string;
}

export interface Instrument extends Entity {
  disambiguation: string;
  name: string;
  'type-id': string;
  type: string;
  description: string;
}

export type ReleaseQuality = 'normal';  // ToDo

export interface Release extends Entity {
  title: string;
  'text-representation': { 'language': string, 'script': string },
  disambiguation: string;
  asin: string,
  'status-id': string;
  packaging?: string;
  status: string;
  'packaging-id'?: string;
  'release-events'?: ReleaseEvent[];
  date: string;
  media: Medium[];
  'cover-art-archive': CoverArtArchive;
  country: string;
  quality: string; // type ReleaseQuality doesnt work here
  barcode: string;
  relations?: Relation[];
  'artist-credit'?: ArtistCredit[]; // nclude 'artist-credits '
  'release-group'?: ReleaseGroup; // nclude: 'release-groups'
}

export interface ReleaseEvent {
  area?: Area;
  date?: string;
}

export type MediaFormatType = 'Digital Media'; // ToDo

export interface Recording extends Entity {
  video: boolean;
  length: number;
  title: string;
  disambiguation: string;
  isrcs?: string[];
  releases?: Release[];
  relations?: Relation[];
  'artist-credit'?: ArtistCredit[];
  aliases?: Alias[];
}

export interface Track extends Entity{
  position: number;
  recording: Recording;
  'number': string; // in JSON, this is a string field
  length: number;
  title: string;
  'artist-credit'?: ArtistCredit[];
}

export interface Medium {
  title: string;
  format?: string; // optional, type dosent work
  'format-id': string;
  tracks: Track[];
  'track-count': number;
  'track-offset': number;
  position: number;
}

export interface CoverArtArchive {
  count: number;
  front: boolean;
  darkened: boolean;
  artwork: boolean;
  back: boolean;
}

export interface ReleaseGroup extends Entity {
  count: number;
  disambiguation?: string;
  title: string;
  'secondary-types': string[];
  'first-release-date': string;
  'primary-type': string;
  'primary-type-id'?: string,
  'secondary-type-ids'?: string[],
  'sort-name': string;
  'artist-credit': { artist: Artist, name: string, joinphrase: string }[];
  releases?: Release[]; // include 'releases'
}

export interface ArtistMatch extends Artist, Match {
}

export interface ReleaseGroupMatch extends ReleaseGroup, Match {
}

export interface ReleaseMatch extends Release, Match {
}

export interface AreaMatch extends Area, Match {
}

export interface SearchResult {
  created: DateTimeFormat;
  count: number;
  offset: number;
}

export interface ArtistList extends SearchResult {
  artists: ArtistMatch[];
}

export interface AreaList extends SearchResult {
  areas: AreaMatch[];
}

export interface ReleaseList extends SearchResult {
  releases: ReleaseMatch[];
  'release-count': number;
}

export interface ReleaseGroupList extends SearchResult {
  'release-groups': ReleaseGroupMatch[];
}

export interface UrlList extends SearchResult {
  urls: UrlMatch[];
}

export type RelationDirection = 'backward' | 'forward';

export interface Relation {
  'attribute-ids':any;
  direction: RelationDirection;
  'target-credit': string;
  end: null | unknown;
  'source-credit': string;
  ended: boolean;
  'attribute-values': unknown;
  attributes?: any[];
  type: string;
  begin?: null | unknown;
  'target-type'?: 'url';
  'type-id': string;
  url?: Url;
  release?: Release;
}

export interface RelationList {
  relations: Relation[];
}

export interface Work extends Entity {
  title: string;
}

export interface Label extends Entity {
  name: string;
}

export interface Place extends Entity {
  name: string;
}

export interface Series extends Entity {
  name: string;
  type: string;
  disambiguation: string;
  'type-id': string;
}

export interface Url extends Entity {
  id: string,
  resource: string,
  'relation-list'?: RelationList[];
}

export interface UrlMatch extends Match, Url {
}

export interface UrlSearchResult extends SearchResult {
  urls?: UrlMatch[];
}

export interface IsrcSearchResult extends SearchResult {
  'isrc': string;
  'recordings': Recording[];
}

export interface ExernalIds {
  [type: string]: string;
}

export interface ReleaseSearchResult extends SearchResult {
  releases: Release[];
}

/**
 * https://musicbrainz.org/doc/Development/XML_Web_Service/Version_2#Subqueries
 */
export type EntityType = 'area' |
'artist' |
'collection' |
'event' |
'instrument' |
'label' |
'place' |
'recording' |
'release' |
'release-group' |
'series' |
'work' |
'url';

export type Relationships = 'area-rels' |
'artist-rels' |
'event-rels' |
'instrument-rels' |
'label-rels' |
'place-rels' |
'recording-rels' |
'release-rels' |
'release-group-rels' |
'series-rels' |
'url-rels' |
'work-rels';

export enum LinkType {
  license = 302,
  production = 256,
  samples_IMDb_entry = 258,
  get_the_music = 257,
  purchase_for_download = 254,
  download_for_free = 255,
  stream_for_free = 268,
  crowdfunding_page = 905,
  other_databases = 306,
  Allmusic = 285
}

/**
 * https://wiki.musicbrainz.org/Development/XML_Web_Service/Version_2/Search#Artist
 */
export interface Pagination {
  /**
   * Return search results starting at a given offset. Used for paging through more than one page of results.
   */
  offset?: number;
  /**
   * An integer value defining how many entries should be returned. Only values between 1 and 100 (both inclusive) are allowed. f not given, this defaults to 25.
   */
  limit?: number;
}

/**
 * https://wiki.musicbrainz.org/Development/XML_Web_Service/Version_2/Search#Artist
 */
export interface SearchQuery<I extends string> extends Pagination {
  /**
   * Lucene search query, this is mandatory
   */
  query?: string | FormData,
  inc?: I[]
}

/**
 * https://musicbrainz.org/doc/MusicBrainz_API#Browse
 * /ws/2/area              collection
 */
export interface LinkedEntitiesArea {
  collection?: string;
}

/**
 * https://musicbrainz.org/doc/MusicBrainz_API#Browse
 * /ws/2/artist            area, collection, recording, release, release-group, work
 */
export interface LinkedEntitiesArtist {
  area?: string;
  collection?: string;
  recording?: string;
  release?: string;
  'release-group'?: string;
  work?: string;
}

/**
 * https://musicbrainz.org/doc/MusicBrainz_API#Browse
 * /ws/2/collection        area, artist, editor, event, label, place, recording, release, release-group, work
 */
export interface LinkedEntitiesCollection {
  area?: string;
  artist?: string;
  editor?: string;
  event?: string;
  label?: string;
  place?: string;
  recording?: string;
  release?: string;
  'release-group'?: string;
  work?: string;
}

/**
 * https://musicbrainz.org/doc/MusicBrainz_API#Subqueries
 * /ws/2/event             area, artist, collection, place
 */
export interface LinkedEntitiesEvent {
  area?: string;
  artist?: string;
  collection?: string;
  place?: string;
}

/**
 * https://musicbrainz.org/doc/MusicBrainz_API#Subqueries
 * /ws/2/instrument        collection
 */
export interface LinkedEntitiesInstrument {
  collection?: string;
}

/**
 * https://musicbrainz.org/doc/MusicBrainz_API#Subqueries
 * /ws/2/label             area, collection, release
 */
export interface LinkedEntitiesLabel {
  area?: string;
  collection?: string;
  release?: string;
}

/**
 * https://musicbrainz.org/doc/MusicBrainz_API#Subqueries
 * /ws/2/place             area, collection
 */
export interface BrowseArgumentPlace {
  area?: string;
  collection?: string;
}

/**
 * https://musicbrainz.org/doc/MusicBrainz_API#Subqueries
 * /ws/2/recording         artist, collection, release, work
 */
export interface LinkedEntitiesRecording {
  area?: string;
  collection?: string;
  release?: string;
  work?: string;
}

/**
 * https://musicbrainz.org/doc/MusicBrainz_API#Subqueries
 * /ws/2/release           area, artist, collection, label, track, track_artist, recording, release-group
 */
export interface LinkedEntitiesRelease {
  area?: string;
  artist?: string;
  collection?: string;
  label?: string;
  track?: string;
  track_artist?: string;
  recording?: string;
  'release-group'?: string;
}

/**
 * https://musicbrainz.org/doc/MusicBrainz_API#Subqueries
 * /ws/2/release-group     artist, collection, release
 */
export interface LinkedEntitiesReleaseGroup {
  artist?: string;
  collection?: string;
  release?: string;
}

/**
 * https://musicbrainz.org/doc/MusicBrainz_API#Subqueries
 * /ws/2/series            collection
 */
export interface LinkedEntitiesSeries {
  collection?: string;
}

/**
 * https://musicbrainz.org/doc/MusicBrainz_API#Browse
 * /ws/2/work              artist, collection
 */
export interface LinkedEntitiesWork {
  artist?: string;
  collection?: string;
}

/**
 * https://musicbrainz.org/doc/MusicBrainz_API#Browse
 * /ws/2/url               resource
 */
export interface LinkedEntitiesUrl {
  resource?: string;
}

/**
 * Browse artist query <entity>: <MBID>
 * https://wiki.musicbrainz.org/MusicBrainz_API#Linked_entities
 */
export interface BrowseAreasQuery extends Pagination {
  collection?: string;
}

/**
 * Browse artist query <entity>: <MBID>
 * https://wiki.musicbrainz.org/MusicBrainz_API#Linked_entities
 */
export interface BrowseArtistsQuery extends Pagination {
  area?: string;
  collection?: string;
  recording?: string;
  release?: string;
  'release-group'?: string;
  work?: string;
}

/**
 * Browse collection query <entity>: <MBID>
 * https://wiki.musicbrainz.org/MusicBrainz_API#Linked_entities
 */
export interface BrowseCollectionsQuery extends Pagination {
  area?: string;
  artist?: string;
  editor?: string;
  event?: string;
  label?: string;
  place?: string;
  recording?: string;
  release?: string;
  'release-group'?: string;
  work?: string;
}

/**
 * Browse events query <entity>: <MBID>
 * https://wiki.musicbrainz.org/MusicBrainz_API#Linked_entities
 */
export interface BrowseEventsQuery extends Pagination {
  area?: string;
  artist?: string;
  collection?: string;
  place?: string;
}

/**
 * Browse instruments query <entity>: <MBID>
 * https://wiki.musicbrainz.org/MusicBrainz_API#Linked_entities
 */
export interface BrowseInstrumentsQuery extends Pagination {
  collection?: string;
}

/**
 * Browse labels query <entity>: <MBID>
 * https://wiki.musicbrainz.org/MusicBrainz_API#Linked_entities
 */
export interface BrowseLabelsQuery extends Pagination {
  area?: string;
  collection?: string;
  release?: string;
}

/**
 * Browse places query <entity>: <MBID>
 * https://wiki.musicbrainz.org/MusicBrainz_API#Linked_entities
 */
export interface BrowsePlacesQuery extends Pagination {
  area?: string;
  collection?: string;
}
/**
 * Browse recordings query <entity>: <MBID>
 * https://wiki.musicbrainz.org/MusicBrainz_API#Linked_entities
 */
export interface BrowseRecordingsQuery extends Pagination {
  artist?: string;
  collection?: string;
  release?: string;
  work?: string;
}

/**
 * Browse releases query <entity>: <MBID>
 * https://wiki.musicbrainz.org/MusicBrainz_API#Linked_entities
 */
export interface BrowseReleasesQuery extends Pagination {
  area?: string;
  artist?: string;
  editor?: string;
  event?: string;
  label?: string;
  place?: string;
  recording?: string;
  release?: string;
  'release-group'?: string;
  work?: string;
}

/**
 * Browse release-groups query <entity>: <MBID>
 */
export interface ReleaseGroupsQuery extends Pagination {
  artist?: string;
  collection?: string;
  release?: string;
}

/**
 * Browse release query <entity>: <MBID>
 * https://wiki.musicbrainz.org/MusicBrainz_API#Linked_entities
 */
export interface BrowseSeriesQuery extends Pagination {
  collection?: string;
}

/**
 * Browse urls query <entity>: <MBID>
 * https://wiki.musicbrainz.org/MusicBrainz_API#Linked_entities
 */
export interface BrowseUrlsQuery extends Pagination {
  resource?: string;
}

/**
 * Browse works query <entity>: <MBID>
 * https://wiki.musicbrainz.org/MusicBrainz_API#Linked_entities
 */
export interface BrowseWorksQuery extends Pagination {
  artist?: string;
  collection?: string;
}

export interface BrowseAreasResult {
  area: Area;
  'area-count': number;
  'area-offset': number;
}

export interface BrowseArtistsResult {
  artists: Artist[];
  'artist-count': number;
  'artist-offset': number;
}

export interface BrowseCollectionsResult {
  collections: Collection[];
  'collection-count': number;
  'collection-offset': number;
}

export interface BrowseEventsResult {
  events: Event[];
  'event-count': number;
  'event-offset': number;
}

export interface BrowseInstrumentsResult {
  instruments: Instrument[];
  'instrument-count': number;
  'instrument-offset': number;
}

export interface BrowseLabelsResult {
  label: Label[];
  'label-count': number;
  'label-offset': number;
}

export interface BrowsePlacesResult {
  place: Place[];
  'place-count': number;
  'place-offset': number;
}

export interface BrowseRecordingsResult {
  recording: Recording[];
  'recording-count': number;
  'recording-offset': number;
}

export interface BrowseReleasesResult {
  releases: Release[];
  'release-count': number;
  'release-offset': number;
}

export interface BrowseReleaseGroupsResult {
  'release-groups': ReleaseGroup[];
  'release-group-count': number;
  'release-group-offset': number;
}

export interface BrowseSeriesResult {
  series: ReleaseGroupsQuery[];
  'series-count': number;
  'series-offset': number;
}

export interface BrowseWorksResult {
  works: ReleaseGroupsQuery[];
  'work-count': number;
  'work-offset': number;
}