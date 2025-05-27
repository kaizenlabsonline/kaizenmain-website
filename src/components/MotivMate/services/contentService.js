import { affirmations } from '../data/affirmations';
import { images } from '../data/images';

const MAX_RECENT_AFFIRMATIONS = 20;
const MAX_RECENT_IMAGES = 10;

const getRecentItems = () => {
  try {
    const recentAffirmationsJSON = localStorage.getItem('recentMotivMateAffirmations');
    const recentImagesJSON = localStorage.getItem('recentMotivMateImages');
    
    const recentAffirmations = recentAffirmationsJSON ? JSON.parse(recentAffirmationsJSON) : [];
    const recentImages = recentImagesJSON ? JSON.parse(recentImagesJSON) : [];

    return { 
      affirmations: Array.isArray(recentAffirmations) ? recentAffirmations : [], 
      images: Array.isArray(recentImages) ? recentImages : [] 
    };
  } catch (e) {
    console.warn('Could not parse recent items from localStorage:', e);
    localStorage.removeItem('recentMotivMateAffirmations');
    localStorage.removeItem('recentMotivMateImages');
    return { affirmations: [], images: [] };
  }
};

const saveRecentItem = (type, itemKey) => {
  try {
    let items = getRecentItems()[type];
    items = [itemKey, ...items.filter(i => i !== itemKey)];
    items = items.slice(0, type === 'affirmations' ? MAX_RECENT_AFFIRMATIONS : MAX_RECENT_IMAGES);
    
    if (type === 'affirmations') {
      localStorage.setItem('recentMotivMateAffirmations', JSON.stringify(items));
    } else {
      localStorage.setItem('recentMotivMateImages', JSON.stringify(items));
    }
  } catch (e) {
    console.warn('Could not save recent item to localStorage:', e);
  }
};


const getRandomElement = (
  arr, 
  recentlyUsedKeys = []
) => {
  if (!arr || arr.length === 0) return undefined;

  const availableItems = arr.filter(item => {
    const key = typeof item === 'string' ? item : item.url;
    return !recentlyUsedKeys.includes(key);
  });

  if (availableItems.length > 0) {
    return availableItems[Math.floor(Math.random() * availableItems.length)];
  } else {
    return arr[Math.floor(Math.random() * arr.length)];
  }
};

export const getLocalAffirmationAndImage = () => {
  if (!affirmations || affirmations.length === 0 || !images || images.length === 0) {
    console.error("Local data for affirmations or images is missing or empty.");
    return { 
      text: "Even when data is shy, your strength shines bright. You are amazing.",
      imageUrl: "https://picsum.photos/seed/dataerror/600/400"
    };
  }

  const recentItems = getRecentItems();

  const selectedAffirmationText = getRandomElement(affirmations, recentItems.affirmations);
  const selectedImageData = getRandomElement(images, recentItems.images);

  if (!selectedAffirmationText || !selectedImageData) {
     console.warn("Could not select new affirmation or image using recency logic, falling back to purely random.");
     const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
     const randomImage = images[Math.floor(Math.random() * images.length)];
     
     saveRecentItem('affirmations', randomAffirmation);
     saveRecentItem('images', randomImage.url);

     return { text: randomAffirmation, imageUrl: randomImage.url };
  }
  
  saveRecentItem('affirmations', selectedAffirmationText);
  saveRecentItem('images', selectedImageData.url);

  return {
    text: selectedAffirmationText,
    imageUrl: selectedImageData.url,
  };
};