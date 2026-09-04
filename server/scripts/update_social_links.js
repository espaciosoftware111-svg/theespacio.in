import { pool } from '../config/supabase.js';

const updatedSocialItems = [
  {
    href: "https://www.instagram.com/theespacio.in",
    icon: "instagram",
    name: "Instagram",
    color: "#E4405F",
    label: "Instagram",
    beamColor: "rgba(228, 64, 95, 0.4)"
  },
  {
    href: "https://www.facebook.com/share/1YCa9RnM8a/",
    icon: "facebook",
    name: "Facebook",
    color: "#1877F2",
    label: "Facebook",
    beamColor: "rgba(24, 119, 242, 0.4)"
  },
  {
    href: "https://youtube.com/@theespacio?si=GMm6fUQ8t0W6MfRL",
    icon: "youtube",
    name: "YouTube",
    color: "#FF0000",
    label: "YouTube",
    beamColor: "rgba(255, 0, 0, 0.4)"
  },
  {
    href: "https://wa.me/919505151116",
    icon: "whatsapp",
    name: "WhatsApp",
    color: "#25D366",
    label: "WhatsApp",
    beamColor: "rgba(37, 211, 102, 0.4)"
  }
];

async function run() {
  const jsonStr = JSON.stringify(updatedSocialItems);

  // 1. Update individual key 'footer_social_items'
  await pool.query(
    `UPDATE settings 
     SET value = $1::jsonb, data = $1::jsonb, updated_at = NOW() 
     WHERE key = 'footer_social_items'`,
    [jsonStr]
  );
  console.log('Updated footer_social_items key');

  // 2. Update within master 'site_settings'
  await pool.query(
    `UPDATE settings 
     SET value = jsonb_set(COALESCE(value, '{}'::jsonb), '{footer_social_items}', $1::jsonb, true),
         data = jsonb_set(COALESCE(data, '{}'::jsonb), '{footer_social_items}', $1::jsonb, true),
         updated_at = NOW()
     WHERE key = 'site_settings'`,
    [jsonStr]
  );
  console.log('Updated site_settings master key');

  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
