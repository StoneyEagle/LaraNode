import FanartClient from "./FanartClient";

import type { MovieLatest } from "./types/movie/latest";
import type { Movie } from "./types/movie/movie";

/**
 * Represents Movies in the Fanart API.
 */
class FanartMovies extends FanartClient {

    constructor() {
        super();

        this.url = `movies`;
    }

    public async images(id: number){
        FanartClient.info(`Fetching Movie ${id} Images`);
        
        const { data } = await this.get<Movie>(`${this.url}/${id}`);
    
        return data;
    };
    
    public async latest(date = Date.now()){
        FanartClient.info('Fetching Latest Movies');
    
        const { data } = await this.get<MovieLatest>(`${this.url}/latest`, {
            params: { date },
        });
    
        return data;
    };
};

export default FanartMovies;