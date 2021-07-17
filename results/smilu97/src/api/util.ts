import { pilotServer } from '../static';

export class FetchError extends Error {}

const { host } = pilotServer;

/**
 * Join all separated paths into single combined path
 * 
 * e.g.)
 * ```js
 * const path = joinPaths(['http://localhost:5000', 'foo','bar']);
 * // path should be 'http://localhost:5000/foo/bar'
 * ```
 * 
 * @param paths list of paths
 * @param sep separator
 * @returns combined single path
 */
export function joinPaths(paths: string[], sep = '/'): string {
    let result = '';
    for (let i = 0; i < paths.length; i += 1) {
        result += paths[i];
        if (i !== paths.length - 1)
            result += sep;
    }
    return result;
}

/**
 * Inject access token data into header object in format
 * @param headers target header object
 * @param accessToken
 */
export function injectAccessToken(headers: object, accessToken: string): void {
    headers['Authorization'] = 'Bearer ' + accessToken;
}

/**
 * Fetch data by GET method
 * @param subPath
 * @returns response
 */
export async function getData(subPath: string, accessToken = ''): Promise<Response> {
    const path = joinPaths([host, subPath]);
    const headers = {};

    if (accessToken)
        injectAccessToken(headers, accessToken);

    const fetchOptions = {
        method: 'GET',
        headers,
    };
    return fetch(path, fetchOptions);
}

/**
 * Fetch data by POST method
 * @param subPath
 * @param body content of body to send
 * @returns response
 */
export async function postData(subPath: string, body: any, accessToken = ''): Promise<Response> {
    const path = joinPaths([host, subPath]);
    const strBody = JSON.stringify(body);
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    if (accessToken)
        injectAccessToken(headers, accessToken);

    const fetchOptions = {
        method: 'POST',
        body: strBody,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    };
    return fetch(path, fetchOptions);
}
