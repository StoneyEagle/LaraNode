import Route from "@framework/Routing/Route";

import TmdbEpisode from "@/app/Http/Clients/Tmdb/TmdbEpisodes";
import TmdbPerson from "@/app/Http/Clients/Tmdb/TmdbPeople";
import TmdbSeason from "@/app/Http/Clients/Tmdb/TmdbSeasons";
import TmdbTvSeries from "@/app/Http/Clients/Tmdb/TmdbTvSeries";
import ServerController from "@/app/Http/Controllers/ServerController";

Route.get('/', function () {
    return redirect('https://vue-dev.nomercy.tv');
});

Route.get('/test', async function () {

    // const acoustic = new AcoustId();
    // const releaseGroup = await acoustic.byFingerPrint('M:\\Music\\A\\Akon\\[2008] Freedom\\02 Beautiful [Akon feat. Colby O\'Donis & Kardinal Offishall].mp3');

    // return send(releaseGroup);

    // const music = new Musicbrainz();
    // const releaseGroup = await music.releaseGroup('70664047-2545-4e46-b75f-4556f2a7b83e');

    // return send(releaseGroup);

    // const music = new FanartMusic();
    // const artist = await music.artist('f4a31f0a-51dd-4fa7-986d-3095c40c5ed9');

    // return send(artist);

    // return send(await TmdbMovie.discover({
    //     params: {
    //         year: 1989,
    //         sort_by: DiscoverMovieSortOrder.PrimaryReleaseDate_desc,
    //         "certification.gte": '16',
    //     }
    // }));

    // const discover = new TmdbDiscover({
    //     language: 'nl-NL',
    // });

    // return send(await discover.movie({
    //     params: {
    //     }
    // }));

    // const network = new TmdbNetwork({
    //     id: 49,
    //     language: 'nl-NL'
    // });
    // return send({
    //     network: await network.details(),
    //     alternativeNames: await network.alternativeNames(),
    //     images: await network.images(),
    //     allDetails: await network.allDetails(),
    // });

    // const company = new TmdbCompany({
    //     id: 1,
    //     language: 'nl-NL'
    // });
    // return send({
    //     company: await company.details(),
    //     alternativeNames: await company.alternativeNames(),
    //     images: await company.images(),
    //     allDetails: await company.allDetails(),
    // });

    // const confuguration = new TmdbConfiguration({
    //     language: 'nl-NL'
    // });

    // return send({
    //     configuration: await confuguration.configuration(),
    //     languages: await confuguration.languages(),
    //     countries: await confuguration.countries(),
    //     jobs: await confuguration.jobs(),
    //     primaryTranslations: await confuguration.primaryTranslations(),
    //     timezones: await confuguration.timezones(),
    // });

    // const popular = await TmdbPerson.popular({
    //     limit: 150,
    //     language: 'nl-NL'
    // });
    // return send(popular);

    // const _people = await TmdbPerson.people({
    //     people: popular.map((person) => person.id),
    //     language: 'nl-NL'
    // });

    // return send(_people);

    // const movie = new TmdbMovie({
    //     id: 550,
    //     language: 'nl-NL',
    // });

    const show = await new TmdbTvSeries({
        id: 456,
    }).allDetails();

    const peopleIds = unique([
        ...show.aggregate_credits.cast,
        ...show.aggregate_credits.crew,
    ], 'id').map((person) => person.id);

    const people = await TmdbPerson.people({
        people: peopleIds,
    });

    show.aggregate_credits.cast = show.aggregate_credits.cast.map((person) => {
        return {
            ...person,
            ...people.find((p) => p.id === person.id)
        };
    }) as any;

    show.aggregate_credits.crew = show.aggregate_credits.crew.map((person) => {
        return {
            ...person,
            ...people.find((p) => p.id === person.id)
        };
    }) as any;

    const seasons = await TmdbSeason.seasons({
        id: show.id,
        seasons: show.seasons.map((season) => season.season_number),
    });

    for (const season of seasons) {
        const episodes = await TmdbEpisode.episodes({
            id: show.id,
            season: season.season_number,
            episodes: season.episodes.map((episode) => episode.episode_number),
        });

        season.episodes = episodes;
    }

    show.seasons = seasons;

    return send(show);
});

Route.get('/routes', [ServerController.class, 'routes']);
Route.get('/status', [ServerController.class, 'status']);

