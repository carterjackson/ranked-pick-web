import React, { useContext, useCallback, useEffect } from 'react';

// TODO: Param and response type generation
type BodyParams = { [key: string]: any };
type ResponseObject = { [key: string]: any };
interface CurrentUser {
	id: number;
	email: string;
	displayName: string | null;
}

interface Context {
	currentUser: CurrentUser | null;
	apiGet: (route: string, params?: { [key: string]: string }) => Promise<ResponseObject>;
	apiPost: (route: string, params?: BodyParams) => Promise<ResponseObject>;
	apiPut: (route: string, params?: BodyParams) => Promise<ResponseObject>;
	apiDelete: (route: string, params?: BodyParams) => Promise<ResponseObject>;
	signin: (params: BodyParams) => Promise<Response>;
	signup: (params: BodyParams) => Promise<Response>;
	signout: (params: BodyParams) => Promise<void>;
}

let refreshingToken = false;
const ApiContext = React.createContext<Context | undefined>(undefined);
const defaultHeaders: { [key: string]: string } = {
	"Accept":"application/json",
	"Content-Type":"application/json",
};

export function ApiProvider({children}: {children: React.ReactNode}) {
	const [currentUser, setCurrentUser] = React.useState<CurrentUser | null>(null);
	const [accessToken, setAccessToken] = React.useState<string | null>(null);

	const refreshToken = useCallback(async () => {
		try {
			refreshingToken = true;
			const resp = await fetch('/api/auth/refresh', {
				method: 'POST',
				headers: defaultHeaders,
				credentials: "include",
			});
			const body = await resp.json();
			if (!resp.ok) {
				throw(body || 'Unknown error');
			}
			const token = body.access_token.token;
			setAccessToken(token);
			setCurrentUser({
				id: body.user.id as number,
				email: body.user.email as string,
				displayName: body.user.display_name as string | null,
			});
			return token;
		} catch (err) {
			console.error(err);
			throw(err);
		} finally {
			refreshingToken = false;
		}
	}, [accessToken]);

	const request = useCallback(async (method: string, path: string, bodyParams?: BodyParams, useAccessToken = true) => {
		try {
			let token = accessToken;
			if (useAccessToken && !accessToken) {
				token = await refreshToken();
			}

			const headers = defaultHeaders;
			if (useAccessToken && token) {
				headers['Authorization'] = 'Bearer ' + token;
			}
			const resp = await fetch('/api' + path, {
				method: method,
				headers: headers,
				body: bodyParams ? JSON.stringify(bodyParams) : null,
				credentials: "include",
			});
			// TODO: refresh token when needed
			const body = await resp.json();
			if (!resp.ok) {
				throw(body || 'Unknown error');
			}
			return body;
		} catch (err) {
			console.error(err);
			throw(err);
		}
	}, [accessToken, refreshToken]);

	useEffect(() => {
		if (!accessToken && !refreshingToken) {
			refreshToken();
		}
	}, [accessToken, refreshToken]);

	const apiGet = useCallback(async (route: string, params?: { [key: string]: string }) => {
		const path = params ? route + '?' + new URLSearchParams(params) : route;
		return request('GET', path);
	}, [request]);

	const apiPost = useCallback(async (path: string, params?: BodyParams) => {
		return request('POST', path, params);
	}, [request]);

	const apiDelete = useCallback(async (path: string, params?: BodyParams) => {
		return request('DELETE', path, params);
	}, [request]);

	const apiPut = useCallback(async (path: string, params?: BodyParams) => {
		return request('PUT', path, params);
	}, [request]);

	const signin = useCallback(async (params: BodyParams) => {
		const resp = await request('POST', '/auth/signin', params, false);
		setAccessToken(resp.access_token.token);
		setCurrentUser({
			id: resp.user.id as number,
			email: resp.user.email as string,
			displayName: resp.user.display_name as string | null,
		});

		return resp;
	}, [request]);

	const signup = useCallback(async (params: BodyParams) => {
		const resp = await request('POST', '/auth/signup', params, false);
		setAccessToken(resp.access_token.token);
		setCurrentUser({
			id: resp.user.id as number,
			email: resp.user.email as string,
			displayName: resp.user.display_name as string | null,
		});
		return resp;
	}, [request]);

	const signout = useCallback(async () => {
		await request('POST', '/auth/signout', {}, false);
		setCurrentUser(null);
		setAccessToken(null);
	}, [request]);

	return (
		<ApiContext.Provider value={{ currentUser, apiGet, apiPost, apiDelete, apiPut, signin, signup, signout }}>
			{children}
		</ApiContext.Provider>
	);
}

export function useApi() {
	const context = useContext(ApiContext);
	if (!context) {
		throw new Error('useApi must be used within ApiProvider');
	}
	return context;
}