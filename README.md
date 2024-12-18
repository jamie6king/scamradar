# ScamRadar

ScamRadar is a Chrome extension that sniffs Ebay car listing pages and cross references with various APIs to give the user a more broad picture of the car and seller.

## Running

1. Clone the project.
2. `cd` into the `api` folder.
3. Create a `.env` file with the needed variables as instructed in [this document](docs/Environmental%20Variables.md).
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
