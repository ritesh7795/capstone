import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  [...block.children].forEach((row,index) => {
    row.classList.add(`section${index+1}`)
    });
  
}
