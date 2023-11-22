import { Cast } from "../shared/cast";
import { Crew } from "../shared/crew";
import { GuestStar } from "../shared/guest_star";

export interface Credits {
	cast: Cast[];
	crew: Crew[];
	guest_stars: GuestStar[];
	id?: number;
}
