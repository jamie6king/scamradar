# Companies House API Guide

1. Register for the Companies House API account [here](https://find-and-update.company-information.service.gov.uk/).
2. Once your account is created and valid, you can navigate [here](https://developer.company-information.service.gov.uk/manage-applications/add) to create a new 'application'.
3. Click on "View all applications" and click on the application you just made.
4. Click on "Create new key", and give it a name, description and select "REST" and "Create key".
5. Copy the string next to the "API key" in the table.
6. Open up Postman.
7. Create a new `GET` request with this as the URL: `https://api.company-information.service.gov.uk/company/<company_number>`, replacing the `<company_number>` with the wanted company number.
8. Click on the 'authorization' tab and change the 'Auth Type' to 'API Key'.
9. In the right-hand pane, set the following values:
    - Set the 'key' to `Authorization`.
    - Set the value to your Companies House API key.
    - Set the 'add to' to 'Header'.
10. Click send.
11. The body of the response is the information about the company.
