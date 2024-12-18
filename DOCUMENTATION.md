# Documentation

## Planning

-   We created a [user story](docs/Structure%20Wireframe.png) and an [overall structure diagram](docs/Overview%20Structure.png) in order to work out what our extension is actually going to do.
-   We created a [wireframe extension mockup](docs/Extension%20Wireframe.png) in order to try and work out what was on the extension.
-   We created a [database structure wireframe](docs/Database%20Structure.png) and a [list of APIs](docs/API%20Overview.png) in order to work out the logic in the backend and what we might need.

## APIs

-   [DVLA Car API](docs/DVLA%20Car%20API.md)
-   [DVSA MOT History API](docs/DVSA%20MOT%20History%20API.md)
-   [Google Cloud API](docs/Google%20Cloud%20API.md)
-   [SerpAPI API](docs/SerpAPI%20API.md)

## Environmental Variables

You need to create a `.env` file in the `api` folder, and populate with the following fields:

-   `MONGODB_URL="mongodb://0.0.0.0/scamradar"`
-   `NODE_ENV="development"`

### DVLA

Setup the DVSA API as defined in steps 1-2 in [the documentation](docs/DVSA%20MOT%20History%20API.md), and append these lines to the `.env` file _(replacing the parts in the angled brackets with the instructions)_:

-   `DVLA_URL="<your DVLA API key provided to you>"`
-   `DVLA_URL="https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles"`

### DVSA

Setup the DVSA API as defined in steps 1-2 in [the documentation](docs/DVSA%20MOT%20History%20API.md), and append these lines to the `.env` file _(replacing the parts in the angled brackets with the instructions)_:

-   `DVSA_API_KEY="<your DVSA API key provided to you>"`
-   `DVSA_CLIENT_ID="<your DVSA Client ID provided to you>"`
-   `DVSA_CLIENT_SECRET="<your DVSA Secret provided to you>"`
-   `DVSA_TOKEN_URL="<your DVSA / Microsoft Token URL provided to you>"`

### Companies House

### Google Cloud Vision API

Setup the Google Cloud API as defined in steps 1.8 in [the documentation](docs/Google%20Cloud%20API.md), and append these lines to the `.env` file _(replacing the parts in the angled brackets with the instructions)_:

-   `GOOGLE_VISION_URL="https://vision.googleapis.com/v1/images:annotate"`
-   `GOOGLE_VISION_API_KEY="<your Google Cloud API key>"`

### SerpAPI API

Setup the SerPAPI API as defined in steps 1-2 in [the documentation](docs/SerpAPI%20API.md), and append these lines to the `.env` file _(replacing the parts in the angled brackets with the instructions)_:

-   `SERPAPI_API_KEY="<your SerpAPI API key>"`
