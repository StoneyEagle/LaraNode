export interface Configuration {
	images: Images;
	change_keys: string[];
}

export interface Images {
	base_url: string;
	secure_base_url: string;
	Backdrop_sizes: BackdropSizes[];
	logo_sizes: LogoSizes[];
	poster_sizes: PosterSizes[];
	profile_sizes: ProfileSizes[];
	still_sizes: StillSizes[];
}

export enum BackdropSizes {
	w300,
	w780,
	w1280,
	original
}
export enum LogoSizes {
	w45,
	w92,
	w154,
	w185,
	w300,
	w500,
	original
}
export enum PosterSizes {
	w92,
	w154,
	w185,
	w342,
	w500,
	w780,
	original
}
export enum ProfileSizes {
	w45,
	w185,
	h632,
	original
}
export enum StillSizes {
	w92,
	w185,
	w300,
	original
}