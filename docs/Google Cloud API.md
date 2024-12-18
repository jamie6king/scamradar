# Google Cloud API Guide

> NOTE: This guide might not be very accurate. I have already setup an account, so I cannot go through the default process again.

1. Register for Google Cloud [here](https://console.cloud.google.com/).
2. Click on the button in the top-left next to the "Google Cloud" logo and create a new project called "ScamRadar".
3. Search for "Cloud Vision API" and enable it.
4. Click on the three lines -> "APIs & Services" -> "Credentials".
5. Click on "Create Credentials" at the top of the screen and click "API key".
6. In the "API Keys" list, click on the newly-created API Key.
7. Under "API Restrictions", click on "Restrict key" and select "Cloud Vision API" from the dropdown.
8. On the right-hand side is the API key.
9. Open up Postman.
10. Create a new `POST` request with the URL set to: `https://vision.googleapis.com/v1/images:annotate`.
11. Click on the 'authorization' tab and change the 'Auth Type' to 'API Key'.
12. In the right-hand pane, set the following values:
    - Set the 'key' to `X-Goog-Api-Key`.
    - Set the value to your Google Cloud API Key.
    - Set the 'add to' to 'Header'.
13. Click on the 'body' tab and set it to 'raw', with the final dropdown set to 'JSON'.
14. Add the following as the body, replacing the parts in the angled braackets with the instructions:

```
{
  "requests": [
    {
      "image": {
        "source": {
          "imageUri": "<the image you want to search for>"
        }
      },
      "features": [
        {
          "type": "WEB_DETECTION",
          "maxResults": 10
        }
      ]
    }
  ]
}
```

15. Click send.
16. The body of the response are all the images that look similar.
