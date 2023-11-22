import { Episode } from './episode';
import { Network } from '../networks/network';

export interface EpisodeGroups {
	description: string;
	episode_count: number;
	group_count: number;
	groups: Group[];
	id: string;
	name: string;
	network: Network;
	type: GroupEnum;
}

export enum GroupEnum {
	'Original air date' = 'Original air date',
	'Absolute' = 'Absolute',
	'DVD' = 'DVD',
	'Digital' = 'Digital',
	'Story arc' = 'Story arc',
	'Production' = 'Production',
	'TV' = 'TV',
}

export interface Group {
	id: string;
	name: string;
	order: number;
	episodes: Episode;
	locked: boolean;
}
