## QueryParser

Magic layer, pipe, made for parsing the query string into the object  readable by orm.

Available query params for bulk get endpoints:
```
responseFields - used for querying only specified fields. If nothig is specified then All fields will be present.
relations - used for adding the relations of the entity. Accepts nested relations. Example: `role,lots,bids,bids.user`. 
sort - used for sorting the result set. Example: `-id,login`. Primary sort by id Desc, secondary sort by login Asc.
filter - user for filtering the result set. Example: `role.id==4`. Supports multiple operators listed below.
        EQUAL = '==',
        NOT_EQUAL = '!==',
        IN = '->', // vertical line is used to separate values ("|")
        GT = '>',
        GTE = '>=',
        LT = '<',
        LTE = '<='
```
- Note: any of this query params accepts comma-separated multiple values.

### Functions

- Sorting
- Pagination
- Filtering
- Selecting fields(TBD for relations)
- Querying relations and nested relations

### Options

- Fields - permitted fields for query, sort and filtering
- Relations - permitted relations for join

### Related component
- **OnlyOwnResourceInterceptor**
    Automatically adds userId from request to filter
