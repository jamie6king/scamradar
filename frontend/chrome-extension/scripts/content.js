const advert_title = document.querySelector(".x-item-title__mainTitle span").textContent;
let isAuction = false
// Sniff for price dependant on the kind of listing eg. Auction, Classified, or Buy it now
function getPrice() {
    let price;

    const classifiedPrice = document.querySelector('.x-offer-price .x-price-primary .ux-textspans');
    if (classifiedPrice) {
        price = classifiedPrice.textContent.trim();
    }

    const auctionPrice = document.querySelector('.x-bid-price .x-price-primary .ux-textspans');
    if (auctionPrice) {
        price = auctionPrice.textContent.trim();
        isAuction = true
    }

    const buyItNowPrice = document.querySelector('.x-bin-price .x-price-primary .ux-textspans');
    if (buyItNowPrice) {
        price = buyItNowPrice.textContent.trim();
    }

    return price || null;
}

const price = getPrice()


// Find business Info if the business seller element exists
let businessSellerInfo = null;

const businessSellerElement = document.querySelector('.vim.d-business-seller');

if (businessSellerElement) {
    // const sellerName = businessSellerElement.querySelector('.ux-section__item span')?.textContent.trim();
    const addressItems = businessSellerElement.querySelectorAll('.ux-section__item span');
    const address = Array.from(addressItems).slice(0, 6).map(item => item.textContent.trim()).join(', ');
    const selfCertification = businessSellerElement.querySelector('.ux-section--selfCertification .ux-section__item span')?.textContent.trim();

    businessSellerInfo = {
        // sellerName,
        address,
        selfCertification
    };

} else {
    console.log('Business seller information not found.');
}

// Find sellers Ebay name, seller type, feedback score and number
const sellerCard = document.querySelector('.x-sellercard-atf__info');
const sellerName = sellerCard.querySelector('.x-sellercard-atf__info__about-seller a span').textContent.trim();

const feedbackCount = sellerCard.querySelector('.x-sellercard-atf__about-seller span.ux-textspans--SECONDARY').textContent.trim();

const sellerTypeElement = sellerCard.querySelector('.x-sellercard-atf__about-seller .tooltip span.ux-textspans--SECONDARY');
const sellerType = sellerTypeElement ? sellerTypeElement.textContent.trim() : 'Not specified';

const feedbackPercentageElement = sellerCard.querySelector('.x-sellercard-atf__data-item a span.ux-textspans--PSEUDOLINK');
const feedbackPercentage = feedbackPercentageElement ? feedbackPercentageElement.textContent.trim() : 'Not specified';

const sellerInfo = {
    sellerName: sellerName,
    sellerType: sellerType,
    feedbackCount: feedbackCount,
    feedbackPercentage: feedbackPercentage
}

// Find vehicle Data from item Specifcs
const vehicleData = {};
const container = document.querySelector('#viTabs_0_is');

if (container) {
  const rows = container.querySelectorAll('.ux-layout-section-evo__row');
  rows.forEach(row => {

    const cols = row.querySelectorAll('.ux-layout-section-evo__col');

    cols.forEach(col => {
      const label = col.querySelector('.ux-labels-values__labels-content span');
      const value = col.querySelector('.ux-labels-values__values-content span');

      if (label && value) {
        vehicleData[label.textContent.trim()] = value.textContent.trim();
      }
    });
  });

} else {
  console.error('Container not found!');
}

const scrapedData = {
    title: advert_title,
    price: price,
    isAuction: isAuction,
    businessInfo: businessSellerInfo,
    sellerInfo: sellerInfo,
    vehicleData: vehicleData
}

chrome.runtime.sendMessage({ type: "scrapedData", scrapedData: scrapedData });


// const p = document.createElement("p");
// p.style.color = "red";
// p.style.fontSize = "36px";
// p.style.fontWeight = "bold";
// p.textContent = "SCAMMER";

// advert_title.insertAdjacentElement("afterend", p);
