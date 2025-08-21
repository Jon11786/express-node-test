Brief explanation
* Code is modular and uses a simple sqlite db.
* Split out register and user to different routes file so it would be easier to add user authentication middleware to the user call and not the register call
* Uses functional tests with supertest to test the endpoints
* Followed TDD and created failing tests first before implementing the functionality followed by refactoring
* Did not return the users password in any response from the api for security reasons
* After running npm run dev you can find api docs at /docs for example http://localhost:3000/docs if hosted from port 3000

Changes I would make with more time or for production
* Would want some kind of oauth2 or JWT authentication token for the user endpoint
* For a production system I would implement database migrations table with schema changes run as migrations
* For production you would want to use a more robust database wether it is SQL or NoSQL
* Only has functional tests, would add unit tests for more complex logic
* Would add rate limiting and more security features to user creation as it is a public endpoint
* Would use OpenAPI to document the API endpoints
* Have winston only logging to console but in a production application would want to log to an external service for observability