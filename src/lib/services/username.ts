import { httpRequest } from "./request";

export async function isUsernameExist(username: string, isNewUser: boolean) {
    if (!username || !/^[a-zA-Z0-9]+$/.test(username) || !isNewUser) {
        return;
    }
    return httpRequest< { isExist: boolean } >(`/api/customlink?username=${username}`, 'GET');
}