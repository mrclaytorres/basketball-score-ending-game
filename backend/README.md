## How to Use the API

#### /api/upcoming-games
Get All Upcoming Games (Default: Next 7 Days, Sorted by Date Ascending, Page 1)  
`GET http://localhost:8000/api/upcoming-games`  

Get Lakers (LAL) upcoming games  
`GET http://localhost:8000/upcoming-games?team_abbreviation=LAL`

Sort by Date (Newest First)  
`GET http://localhost:8000/api/upcoming-games?sort_order=desc`

Paginate (Page 2, 5 Games per Page)  
`GET http://localhost:8000/api/upcoming-games?page=2&limit=5`

Filter by Team & Sort Descending  
`GET http://localhost:8000/api/upcoming-games?team_abbreviation=LAL&sort_order=desc`

Combine Filters, Sorting, and Pagination  
`GET http://localhost:8000/api/upcoming-games?start_date=2025-03-10&end_date=2025-03-15&team_abbreviation=LAL&sort_order=desc&page=1&limit=5`