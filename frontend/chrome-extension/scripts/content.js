const listingCategory =
    document.querySelector("li > a.seo-breadcrumb-text > span")?.textContent ??
    null;

if (listingCategory == "Motors") {
    const advert_title = document.querySelector(
        ".x-item-title__mainTitle span"
    ).textContent;
    let isAuction = false;
    // Sniff for price dependant on the kind of listing eg. Auction, Classified, or Buy it now
    function getPrice() {
        let price;

        const classifiedPrice = document.querySelector(
            ".x-offer-price .x-price-primary .ux-textspans"
        );
        if (classifiedPrice) {
            price = classifiedPrice.textContent.trim();
        }

        const auctionPrice = document.querySelector(
            ".x-bid-price .x-price-primary .ux-textspans"
        );
        if (auctionPrice) {
            price = auctionPrice.textContent.trim();
            isAuction = true;
        }

        const buyItNowPrice = document.querySelector(
            ".x-bin-price .x-price-primary .ux-textspans"
        );
        if (buyItNowPrice) {
            price = buyItNowPrice.textContent.trim();
        }

        return price || null;
    }

    const price = getPrice();

    // Find business Info if the business seller element exists
    let businessSellerInfo = null;
    let businessNumber = null;

    const businessSellerElement = document.querySelector(
        ".vim.d-business-seller"
    );

    if (businessSellerElement) {
        const addressItems = businessSellerElement.querySelectorAll(
            ".ux-section__item span"
        );
        const address = Array.from(addressItems)
            .slice(0, 10)
            .map((item) => item.textContent.trim())
            .join(", ");
        const selfCertification = businessSellerElement
            .querySelector(
                ".ux-section--selfCertification .ux-section__item span"
            )
            ?.textContent.trim();

        let companyNumber = document.querySelector(
            "#s0-1-26-7-17-1-93\\[1\\]-2-3-tabpanel-0 > div > div > div > div.vim.d-business-seller > div > div.ux-section.ux-section--crnInformation > div > div > ul > li > span"
        );

        if (companyNumber) {
            businessNumber = companyNumber.textContent;
        } else {
            console.log("No company number found!");
        }

        businessSellerInfo = {
            address,
            selfCertification,
        };
    } else {
        console.log("Business seller information not found.");
    }

    // Find sellers Ebay name, seller type, feedback score and number
    let sellerInfo = null;
    const sellerCard = document.querySelector(".x-sellercard-atf__info");

    if (sellerCard) {
        const sellerName = sellerCard
            .querySelector(".x-sellercard-atf__info__about-seller a span")
            .textContent.trim();

        const feedbackCount = sellerCard
            .querySelector(
                ".x-sellercard-atf__about-seller span.ux-textspans--SECONDARY"
            )
            .textContent.trim();

        const sellerTypeElement = sellerCard.querySelector(
            ".x-sellercard-atf__about-seller .tooltip span.ux-textspans--SECONDARY"
        );
        const sellerType = sellerTypeElement
            ? sellerTypeElement.textContent.trim()
            : "Not specified";

        const feedbackPercentageElement = sellerCard.querySelector(
            ".x-sellercard-atf__data-item a span.ux-textspans--PSEUDOLINK"
        );
        const feedbackPercentage = feedbackPercentageElement
            ? feedbackPercentageElement.textContent.trim()
            : "Not specified";

        sellerInfo = {
            sellerName: sellerName,
            sellerType: sellerType,
            feedbackCount: feedbackCount,
            feedbackPercentage: feedbackPercentage,
        };
    }

    // Find vehicle Data from item Specifcs
    const vehicleData = {};
    const container = document.querySelector("#viTabs_0_is");

    if (container) {
        const rows = container.querySelectorAll(".ux-layout-section-evo__row");
        rows.forEach((row) => {
            const cols = row.querySelectorAll(".ux-layout-section-evo__col");

            cols.forEach((col) => {
                const label = col.querySelector(
                    ".ux-labels-values__labels-content span"
                );
                const value = col.querySelector(
                    ".ux-labels-values__values-content span"
                );

                if (label && value) {
                    vehicleData[label.textContent.trim()] =
                        value.textContent.trim();
                }
            });
        });
    } else {
        console.error("Container not found!");
    }

    const images = document?.querySelectorAll(
        ".ux-image-carousel.zoom.img-transition-medium div"
    );

    const imageUrls = Array.from(images)
        .map((div) => {
            const img = div.querySelector("img");
            if (img && img.hasAttribute("srcset")) {
                const srcset = img.getAttribute("srcset");
                const srcsetArray = srcset
                    .split(", ")
                    .map((item) => item.split(" ")[0]);
                return srcsetArray[srcsetArray.length - 1];
            } else if (img && img.hasAttribute("data-srcset")) {
                const dataSrcset = img.getAttribute("data-srcset");
                const dataSrcsetArray = dataSrcset
                    .split(", ")
                    .map((item) => item.split(" ")[0]);
                return dataSrcsetArray[dataSrcsetArray.length - 1];
            }
            return null;
        })
        .filter(Boolean);

    chrome.runtime.sendMessage({ type: "imageUrls", imageUrls: imageUrls });

    // console.log(imageUrls)

    const scrapedData = {
        title: advert_title,
        price: price,
        isAuction: isAuction,
        businessInfo: businessSellerInfo,
        businessNumber: businessNumber,
        sellerInfo: sellerInfo,
        vehicleData: vehicleData,
    };

    if (sellerInfo.sellerType === "Business") {
        const companyAddressData = scrapedData.businessInfo.address.split(", ");
        const companyName = companyAddressData[0];
        let companyPostcode;
        const regex =
            /([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})/;
        for (element of companyAddressData) {
            if (regex.test(element)) {
                companyPostcode = element;
                break;
            }
        }
        const mapQueryData = {
            companyName: companyName,
            companyPostcode: companyPostcode,
        };
        chrome.runtime.sendMessage({
            type: "mapQueryData",
            mapQueryData: mapQueryData,
        });
        chrome.runtime.sendMessage({
            type: "businessNumberData",
            businessNumber: businessNumber,
        });
    }

    chrome.runtime.sendMessage({
        type: "scrapedData",
        scrapedData: scrapedData,
    });
} else {
    chrome.runtime.sendMessage({ type: "wrongCategory", category: "" });
}

// const p = document.createElement("p");
// p.style.color = "red";
// p.style.fontSize = "36px";
// p.style.fontWeight = "bold";
// p.textContent = "SCAMMER";

// advert_title.insertAdjacentElement("afterend", p);
