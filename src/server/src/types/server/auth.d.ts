
declare global {

    var access_token: string;
    var refresh_token: string;
    var expires_in: number = 0;
    var refresh_expires_in: number;
    var token_type: string;
    var id_token: string;
    var session_state: string;
    var scope: string;

}

export default {};