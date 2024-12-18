# SerpAPI API Guide

1. Register for SerpAPI [here](https://serpapi.com/users/sign_up).
2. On the "Your Account" page, there should be a long "Private API Key".
3. Open up Postman.
4. Create a new `GET` request with this as the URL: `https://serpapi.com/search`.
5. Click on the 'params' tab and add the following rows to the table:
    - Key: `engine`, Value: `google_maps`.
    - Key: `q`, Value: what you want to search for.
6. Click on the 'authorization' tab and change the 'Auth Type' to 'API Key'.
7. In the right-hand pane, set the following values:
    - Set the 'key' to `api_key`.
    - Set the value to your private SerpAPI API key.
    - Set the 'add to' to 'Query Params'.
8. Click on the 'headers' tab.
9. Ceate a new row in the table with the Key as: `data_type`, and the Value as: `place_results`.
10. Click send.
11. The body of the response is all the information about the supplied business.
