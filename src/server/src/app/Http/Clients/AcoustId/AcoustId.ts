import { exec } from "child_process";
import AcoustIdClientClient from "./AcoustIdClient";
import { FingerprintLookup, Result } from "./types/fingerprint";
import { fpcalc } from "@/app/Helper/paths";
import { existsSync } from "fs";

/**
 * Represents AcoustId.
 */
class AcoustId extends AcoustIdClientClient {

    meta = [
        'recordings',
        'recordingids',
        'releases',
        'releaseids',
        'releasegroups',
        'releasegroupids',
        'tracks',
        'compress',
        'usermeta',
        'sources',
    ].join('+');

    constructor() {
        super();
    }

    public async generateFingerPrint(path: string): Promise<{ duration: string, fingerprint: string; }> {

        let fingerprint: string | undefined = undefined;

        await new Promise((resolve, reject) => {

            if (!existsSync(path)) {
                return reject('File does not exist');
            }

            exec(`${fpcalc} -json "${path}"`, (error, stdout, stderr) => {
                if (error) {
                    AcoustIdClientClient.error(`error: ${error.message}`);
                    return;
                }

                if (stderr) {
                    AcoustIdClientClient.error(`stderr: ${stderr}`);
                    return;
                }

                fingerprint = stdout;
                return resolve(true);
            });
        });

        return JSON.parse(fingerprint ?? '{}');

    }

    public async byFingerPrint(path: string): Promise<void | Result> {

        AcoustIdClientClient.info(`Getting fingerprint`);

        const fingerprintData = await this.generateFingerPrint(path);

        try {
            const response = await this.get<FingerprintLookup>(`lookup?meta=${this.meta}`, {
                params: {
                    duration: parseInt(fingerprintData.duration, 10),
                    fingerprint: fingerprintData.fingerprint,
                },
            });

            return response.data?.results?.[0];

        } catch (error: any) {
            AcoustIdClientClient.error(error.response.data.error);
        }
    };

    public async byTrackId(id: string): Promise<void | Result> {

        AcoustIdClientClient.info(`Getting fingerprint`);

        try {
            const response = await this.get<FingerprintLookup>(`lookup?meta=${this.meta}`, {
                params: {
                    trackid: id,
                },
            });

            return response.data?.results?.[0];

        } catch (error: any) {
            AcoustIdClientClient.error(error.response.data.error);
        }
    };
};

export default AcoustId;