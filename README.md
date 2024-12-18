# ScamRadar

ScamRadar is a Chrome extension that sniffs Ebay car listing pages and cross references with various APIs to give the user a more broad picture of the car and seller.

Created by [Abdirahman](https://github.com/aaden04), [Calum](https://github.com/calummathen), [Jamie K](https://github.com/jamie6king), [Jamie P](https://github.com/Jamiepod1), [Joshua](https://github.com/joshuablackmore) and [Khalid](https://github.com/khal2023).

## Running

1. Clone the project.
2. `cd` into the `api` folder.
3. Create a `.env` file with the needed variables as instructed in [this document](DOCUMENTATION.md).
4. Install the server's dependancies with `npm install --omit=dev`
    - Leave out the `--omit=dev` if you want to develop ScamRadar.
5. Open Chrome.
6. Navigate to `chrome://extensions`.
7. Toggle the "Developer Mode" in the top-right.
8. Click on "Load unpacked" and navigate to the `frontend/chrome-extension` folder.
9. The program is now running.

### Usage

The extension works by looking at various elements on an Ebay car listing page, before sending it to the backend to process, before sending it back to the frontend to display to the user.

1. Navigate to a Ebay car listing.
2. Click on the extension.
3. Input the car's number plate and press "submit".
4. The extension will display all of the information about the car, and whether or not it matches the API calls _(DVLA, DVSA, etc.)_.

## Technologies Used

-   The API is using [ExpressJS](https://expressjs.com/) for routing and [Mongoose](https://mongoosejs.com/) for connecting to a [MongoDB](https://www.mongodb.com/) database.
    -   It is tested using [Jest](https://jestjs.io/) with the [Jest Fetch Mock](https://github.com/jefflau/jest-fetch-mock) and [Supertest](https://github.com/ladjs/supertest) additions for network testing, and [Mock Require](https://github.com/boblauer/mock-require) for mocking require statements.
        -   Coverage is enabled by default, ensuring everyone is kept up-to-date with how much of the code is being tested.
    -   It is linted using various plugins of [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) to ensure consistant code formatting.
-   The extension is written using [Manifest V3](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3) and standard Chrome communication methods.
-   The whole project uses [Github Actions](https://github.com/features/actions) in order to run tests and checks linting on every pull request and commit in `main`.
