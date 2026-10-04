import { getProjectRoomName } from '../client/src/utils/projectRooms.js';

const gandipetProject = {
  id: 'proj_5_gandipet_kiran',
  slug: 'gandipet-modern-retro-2bhk',
  title: 'The Panelled Muse'
};

const gallery = [
  "/images/projects/gandipet_kiran_2bhk/kiran_gallery_2.webp",
  "/images/projects/gandipet_kiran_2bhk/kiran_gallery_4.webp",
  "/images/projects/gandipet_kiran_2bhk/kiran_gallery_5.webp",
  "/images/projects/gandipet_kiran_2bhk/kiran_gallery_7.webp",
  "/images/projects/gandipet_kiran_2bhk/kiran_gallery_9.webp",
  "/images/projects/gandipet_kiran_2bhk/kiran_gallery_12.webp",
  "/images/projects/gandipet_kiran_2bhk/kiran_gallery_14.webp",
  "/images/projects/gandipet_kiran_2bhk/kiran_gallery_15.webp",
  "/images/projects/gandipet_kiran_2bhk/kiran_gallery_16.webp",
  "/images/projects/gandipet_kiran_2bhk/kiran_gallery_17.webp",
  "/images/projects/gandipet_kiran_2bhk/kiran_gallery_18.webp",
  "/images/projects/gandipet_kiran_2bhk/kiran_gallery_21.webp",
  "/images/projects/gandipet_kiran_2bhk/kiran_gallery_24.webp"
];

console.log('Testing all 13 room names:');
gallery.forEach((url, i) => {
  const name = getProjectRoomName(gandipetProject, url, i);
  console.log(`[Card ${i + 1}] ${url.split('/').pop()} => "${name}"`);
});
