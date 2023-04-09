## Authorization and authentication details

Auth is implemented with two tokens:
- Access token - short-life(hours), should be used with every request, that need an authorization.
- Refresh token - long-life(days), should be used only once for refreshing the authentication session. After refreshing - old token couple is banned.

Session is created every time user sign-in(or create an account). After the user sign out, the token is banned and persist in black-list till the expiration date.

There is a possibility to get all existing sessions of the user with `auth/existing-sessions` endpoint.

Application awaits the authorization to be in Headers part of http request and to be in the following manner:
`Authorization: Bearer fake.token.string`
