import { ServerCertificate, ServerRegisterResponse } from "@/types/server/register";
import { applicationVersion, sslCA, sslCert, sslKey } from "../Helper/paths";
import { deviceId, deviceName, platform } from "../Helper/system";

import { AxiosResponse } from "axios";
import Logger from "@framework/Foundation/Logger";
import apiClient from "../Http/Clients/apiClient";
import certificateNeedsRenewal from "./certificateNeedsRenewal";
import { promises } from "fs";

class Register {

    public async init() {
        const serverData = {
            server_id: deviceId,
            server_name: deviceName,
            internal_ip: globalThis.internalIp,
            internal_port: serverPort(),
            external_ip: globalThis.externalIp,
            external_port: serverPort(),
            server_version: applicationVersion,
            platform: platform.toTitleCase(),
        };

        Logger.log({
            level: 'info',
            name: 'setup',
            color: 'blueBright',
            message: 'Registering server, this takes a moment...',
        });

        return new Promise(async (resolve) => {

            apiClient()
                .post<ServerRegisterResponse>('server/register', serverData)
                .then(async ({ data }) => {
                    await this.assignServer();
                    resolve(data);
                })
                .catch(async (error) => {
                    error = true;
                    if (error.response) {
                        Logger.log({
                            level: 'info',
                            name: 'setup',
                            color: 'blueBright',
                            message: error?.response?.data?.message ?? error,
                        });
                    }
                });
        });
    }

    private async assignServer() {

        Logger.log({
            level: 'info',
            name: 'register',
            color: 'blueBright',
            message: 'Validating server',
        });

        return new Promise(async (resolve) => {
            const serverData = {
                server_id: deviceId,
            };

            apiClient()
                .post('server/assign', serverData)
                .then(async () => {
                    Logger.log({
                        level: 'info',
                        name: 'register',
                        color: 'blueBright',
                        message: 'Server validated',
                    });

                    await this.refresh();
                    resolve(true);
                })
                .catch(({ response }) => {
                    Logger.log({
                        level: 'error',
                        name: 'register',
                        color: 'red',
                        message: JSON.stringify(response?.data ?? response, null, 2),
                    });
                });
        });
    };

    private async refresh() {

        return new Promise((resolve) => {

            if (certificateNeedsRenewal(sslCert)) {

                Logger.log({
                    level: 'info',
                    name: 'setup',
                    color: 'blueBright',
                    message: 'Obtaining SSL certificate',
                });

                apiClient()
                    .get<ServerCertificate>(`server/renewcertificate?server_id=${deviceId}`)
                    .then(async (response: AxiosResponse<ServerCertificate>) => {

                        await Promise.all([
                            promises.rm(sslKey, { force: true }),
                            promises.rm(sslCert, { force: true }),
                            promises.rm(sslCA, { force: true }),
                        ]);

                        await Promise.all([
                            promises.writeFile(sslKey, response.data.private_key),
                            promises.writeFile(sslCA, response.data.certificate_authority),
                            promises.writeFile(sslCert, `${response.data.certificate}\n${response.data.issuer_certificate}`),
                        ]);

                        Logger.log({
                            level: 'info',
                            name: 'setup',
                            color: 'blueBright',
                            message: 'New SSL certificate has been obtained',
                        });

                        resolve(true);
                    })
                    .catch((error) => {
                        if (error.response) {
                            Logger.log({
                                level: 'info',
                                name: 'setup',
                                color: 'red',
                                message: error.response.data.message,
                            });
                        } else {
                            Logger.log({
                                level: 'info',
                                name: 'setup',
                                color: 'red',
                                message: error.message ?? error,
                            });
                        }
                    });
            } else {
                Logger.log({
                    level: 'info',
                    name: 'setup',
                    color: 'blueBright',
                    message: 'SSL certificate is valid',
                });
                resolve(true);
            }
        });
    };

}

export default Register;