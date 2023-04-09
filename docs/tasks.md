## TODO:

- add tier to jwt token. Introduce tiers to logic. critical priority. Consider segregation on db level.
  - add __*pre-select*__ typeorm hook. (Problem - no hooks available in lib. **Find a solution**). high priority. Need for validation tier value presence on every query.
  - Consider nestjs interceptors or pipes to handle preselect by mutating the incoming req to have the tier field. Extract user tier from jwt token.
