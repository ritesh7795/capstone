import { fetchPlaceholders } from '../../scripts/aem.js';

const retrievePlaceHolders = async () => {
  const placeholderValues = await fetchPlaceholders('');
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const paramValue = params.get('id'); // Replace 'key' with the actual query parameter name
  const result = Object.entries(placeholderValues).map(([key, value]) => ({ key, value }));
  const selectedPlaceHolderValue = result.find((item) => item?.key === paramValue) || '';
  const selectedPlaceHolderArray = selectedPlaceHolderValue?.value ? selectedPlaceHolderValue?.value.split(',') : [];
  return selectedPlaceHolderArray;
};
export default async function decorate() {
  const selectedPlaceHolderArray = await retrievePlaceHolders();
  const [title, description] = selectedPlaceHolderArray;
  document.getElementById('producttitle').textContent = title;
  document.getElementById('productdescription').textContent = description;
  document.getElementById('productdescription').classList.add('product-description');
}
