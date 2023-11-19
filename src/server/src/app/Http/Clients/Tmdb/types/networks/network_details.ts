import { Network } from './network';
import { NetworkAlternatetiveNames } from './network_alternatetive_names';
import { NetworkImages } from './network_images';

export interface NetworkDetails extends Network {
	description: string;
	headquarters: string;
	homepage: string;
	parent_network: string;
}

export interface NetworkAppend extends NetworkDetails {
	alternative_names: NetworkAlternatetiveNames;
	images: NetworkImages;
}

export type NetworkWithAppends<T extends keyof NetworkAppend> = NetworkDetails & Pick<NetworkAppend, T>;
