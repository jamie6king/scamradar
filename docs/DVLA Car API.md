# DVLA Car API Guide

1. Register for the DVLA Vehicle Enquiry Service API [here](https://register-for-ves.driver-vehicle-licensing.api.gov.uk/).
2. You should receive an email containing the "open data API key".
3. Open up Postman.
4. Create a new `POST` request with this as the URL: `https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles`.
5. In the right-hand pane, set the following values:
    - Set the 'key' to `x-api-key`.
    - Set the value to your DVLA API key.
    - Set the 'add to' to 'Header'.
6. Click on the 'body' tab and set it to 'raw', with the final dropdown set to 'JSON'.
7. Add the following as the body, replacing the parts in the angled braackets with the instructions:

```
{
    "registrationNumber": "<the registration number you want to search for>"
}
```

8. Click send.
9. The body of the response is the information about the vehicle.
