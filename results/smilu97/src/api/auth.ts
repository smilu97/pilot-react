import { FetchError, getData, postData } from './util';

import { UserData } from '../type';

/**
 * Ask server health
 * @returns if server is healthy
 */
 export async function getHealth(): Promise<boolean> {
    const response = await getData('health');
    const { status } = response;
    const jsonBody = await response.json();
    
    return status === 204 && jsonBody === '';
}

/**
 * Fetch access token by (account, password)
 * @returns accessToken
 */
export async function fetchAccessToken(account: string, password: string): Promise<string> {
    const body = { account, password };
    const response = await postData('auth/login', body);
    const { status } = response;
    const jsonBody = await response.json();
    
    if (status !== 200)
        throw new FetchError('status is not 200');

    if (typeof jsonBody !== 'object')
        throw new FetchError('body must be object type');
    
    const { accessToken } = jsonBody;

    if (typeof accessToken !== 'string')
        throw new FetchError('accessToken does not exist, or is not string');
    
    return accessToken;
}

/**
 * Fetch user data
 * @param accessToken
 * @returns user data
 */
export async function fetchUserData(accessToken: string): Promise<UserData> {
    const response = await getData('v1/users/me', accessToken);
    const body = await response.json();
    return body as UserData;
}

/**
 * Inform server that client want logout.
 * This behavior makes server refresh accessToken
 * @param accessToken
 */
export async function logout(accessToken: string): Promise<void> {
    const response = await getData('auth/logout', accessToken);
    const { status } = response;
    const body = await response.json();

    if (body !== '' || status !== 204)
        throw new FetchError('Invalid logout attemption');
}
