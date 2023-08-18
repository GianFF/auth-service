# Testing 

### API tests

This suite is designed to integrate all elements in the application while hitting the API endpoints.
It checks the integration between all elements is working as expected.

Services doing external requests will be supplied by their mock instances, thus that no request will be made to the outside application. 
An in memory mongo DB will be used instead of the productive one.

<img width="461" alt="Code Coverage" src="https://github.com/GianFF/auth-service/assets/11510367/792ac257-458d-41a3-8dea-314296bdf180">


### Integration tests

[This suite lives in Postman](https://edymberg.postman.co/workspace/Team-Workspace~c4e09567-6ae9-4192-829b-cc25a198e607/api/1bf1f431-82ee-42ff-9f93-faf99c62d8ac) ask for invitation.   
It's designed to run all tests using the real API and DB, but also all the real components hierarchy.   
It would be run on each commit by a Github Action using docker-compose to start the application and hit the API.

These are examples of Postman tests and the Github Action output:

<img width="572" alt="Postman tests output" src="https://github.com/GianFF/auth-service/assets/11510367/53a799e8-de83-4542-bb96-6c26456044be">


<img width="534" alt="Linter" src="https://github.com/GianFF/auth-service/assets/11510367/17adf935-e723-4ee5-8228-b448383860f7">

<img width="1311" alt="Postman tests" src="https://github.com/GianFF/auth-service/assets/11510367/c40ef72c-1c3b-4620-8be0-0e5b511f9fbc">
