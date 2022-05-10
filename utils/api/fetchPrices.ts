const request =
    "https://api.coingecko.com/api/v3/simple/price?ids=solana%2Cbitcoin%2Cterra-luna%2Cethereum%2Capecoin%2Cnear%2Cavalanche-2%2Cmsol&vs_currencies=usd";

async function fetchPrices() {
    const res = await fetch(request);
    return await res.json();
}

export default fetchPrices;
