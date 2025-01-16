import { createOptimizedPicture } from '../../scripts/aem.js';
import { fetchPlaceholders } from '/scripts/aem.js';
const retrievePlaceHolders=async ()=>{
    const placeholderValues = await fetchPlaceholders('');
    let url = new URL(window.location.href);

    // Get all query parameters as a URLSearchParams object
    let params = new URLSearchParams(url.search);
    
    // Get the value of a specific query parameter
    let paramValue = params.get('id'); // Replace 'key' with the actual query parameter name
    
    let result = Object.entries(placeholderValues).map(([key, value]) => {
        return { key: key, value: value };
      });
      // Output the value of 'key'
       const selectedPlaceHolderValue=result.find(item=>item?.key==paramValue)||""
      const selectedPlaceHolderArray= selectedPlaceHolderValue?.value?selectedPlaceHolderValue?.value.split(",") :[]
      return selectedPlaceHolderArray
}
export default async function decorate(block) {
   const selectedPlaceHolderArray=await retrievePlaceHolders();
   document.getElementById("producttitle").textContent=selectedPlaceHolderArray[0];
   document.getElementById("productdescription").textContent=selectedPlaceHolderArray[1];
   document.getElementById("productdescription").classList.add("product-description");


  /* change to ul, li */

  // fetch placeholders from the 'en' folder
  }
