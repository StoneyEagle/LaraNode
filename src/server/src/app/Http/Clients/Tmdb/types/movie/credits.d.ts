import { Cast } from "../shared/cast";
import { Crew } from "../shared/crew";

export interface Credits {
	cast: Cast[];
	crew: Crew[];
	id: number;
}
