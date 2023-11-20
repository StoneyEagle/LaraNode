import FanartClient from "./FanartClient";

import type { TvLatest } from "./types/tv/latest";
import type { Tv } from "./types/tv/tv";

/**
 * Represents TV Show in the Fanart API.
 */
class FanartTv extends FanartClient {

    constructor() {
        super();

        this.url = `tv`;
    }

    public async images(id: number){
        FanartClient.info(`Fetching TV Show ${id} Images`);

        const { data } = await this.get<Tv>(`${this.url}/${id}`);

        return data;
    };

    public async latest(date = Date.now()){
        FanartClient.info('Fetching Latest TV Shows');

        const { data } = await this.get<TvLatest>(`${this.url}/latest`, {
            params: { date },
        });

        return data;
    };

};

export default FanartTv;