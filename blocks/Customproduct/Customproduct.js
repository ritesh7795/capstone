import { fetchPlaceholders } from '/scripts/aem.js';
const retrievePlaceHolders = async () => {
    const placeholderValues = await fetchPlaceholders('');
    let url = new URL(window.location.href);
    let params = new URLSearchParams(url.search);
    let paramValue = params.get('id'); // Replace 'key' with the actual query parameter name
    let result = Object.entries(placeholderValues).map(([key, value]) => {
        return { key: key, value: value };
    });
    const selectedPlaceHolderValue = result.find(item => item?.key == paramValue) || ""
    const selectedPlaceHolderArray = selectedPlaceHolderValue?.value ? selectedPlaceHolderValue?.value.split(",") : []
    return selectedPlaceHolderArray
}
export default async function decorate(block) {
    const selectedPlaceHolderArray = await retrievePlaceHolders();
    document.getElementById("producttitle").textContent = selectedPlaceHolderArray[0];
    document.getElementById("productdescription").textContent = selectedPlaceHolderArray[1];
    document.getElementById("productdescription").classList.add("product-description");
}
