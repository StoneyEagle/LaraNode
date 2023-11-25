
export interface Covers {
  images: Image[];
  release: string;
}

export interface Image {
  approved: boolean;
  back: boolean;
  comment: string;
  edit: number;
  front: boolean;
  id: number;
  image: string;
  thumbnails: Thumbnails;
  types: CoverType[];
}

export interface Thumbnails {
  '250': string;
  '500': string;
  '1200': string;
  large: string;
  small: string;
}

export enum CoverType {
  MatrixRunout = 'Matrix/Runout',
  RawUnedited = 'Raw/Unedited',
  Back = 'Back',
  BackSpine = 'BackSpine',
  Booklet = 'Booklet',
  Bottom = 'Bottom',
  Front = 'Front',
  Liner = 'Liner',
  Medium = 'Medium',
  Obi = 'Obi',
  Other = 'Other',
  Poster = 'Poster',
  Spine = 'Spine',
  Sticker = 'Sticker',
  Top = 'Top',
  Track = 'Track',
  Tray = 'Tray',
  Watermar = 'Watermark'
}
