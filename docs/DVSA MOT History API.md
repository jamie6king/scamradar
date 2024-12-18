# DVSA MOT History API Guide

1. Register for the MOT History API [here](https://documentation.history.mot.api.gov.uk/mot-history-api/register).
2. You should receive an email containing the following information:
    - `Client ID`
    - `Client Secret`
    - `API Key`
    - `Scope URL`
    - `Token URL`
3. Open up Postman.
4. Create a new `POST` request with the `Token URL` as the URL.
5. Click on the 'body' tab and set it to `x-www-url-encoded`.
6. In the table, create the following rows:
    - Key: `scope`, Value: your `Scope URL`.
    - Key: `client_id`, Value: your `Client ID`.
    - Key: `client_secret`, Value: your `Client Secret`.
    - Key: `grant_type`, Value `client_credentials`.
7. Click send.
8. In the body of the response, there should be a long `access_token`, which is valid for 1 hour.
9. Create a new `GET` request with the url set to: `https://history.mot.api.gov.uk/v1/trade/vehicles/registration/<number_plate>`, replacing the `<number_plate>` with the wanted number plate.
10. Click on the 'authorization' tab and change the 'Auth Type' to 'Bearer Token'.
11. Set the 'token' field to the token given in step 8.
12. Click on the 'headers' tab.
13. Create a new row in the table with the Key as: `x-api-key`, and the Value as: your `API Key`.
14. Click send.
15. The body of the response is information on the car with the full MOT history.
