import os
import re

schools_dir = 'admission/schools'

school_channels = {
    'lasu': 'https://whatsapp.com/channel/0029VbAryZU60eBZibqNYu0N',
    'ui': 'https://whatsapp.com/channel/0029VbApRRo30LKJcV3UNj2M',
    'oau': 'https://whatsapp.com/channel/0029VbAfy2mIN9iuQOBiZ41T',
    'unilag': 'https://whatsapp.com/channel/0029VbA5AY4I1rcbqvQE0J31',
    'oou': 'https://whatsapp.com/channel/0029VbB4tDhCXC3BIaNKy635',
    'unilorin': 'https://whatsapp.com/channel/0029Vb5ZFhcB4hdZCwDj0U2N',
    'uniport': 'https://whatsapp.com/channel/0029Vb5obYTK0IBf0q5al437',
    'uniben': 'https://whatsapp.com/channel/0029VbATZs28F2pDTQWAqY1x',
    'delsu': 'https://whatsapp.com/channel/0029VbAr06N4NVih70Bzm30P',
    'fuoye': 'https://whatsapp.com/channel/0029VbAXFbVHgZWhJlxbzz3l',
    'uniosun': 'https://whatsapp.com/channel/0029Vb5C7EE8vd1WGYRQfG1b',
    'futa': 'https://whatsapp.com/channel/0029Vb5k1dr3wtbAOzzfNq45',
    'fuhsi': 'https://whatsapp.com/channel/0029Vb6M5RMC1FuGCQfnPf1p',
    'dou': 'https://whatsapp.com/channel/0029VbBg7qS3AzNTTwG6L80d',
    'abu': 'https://whatsapp.com/channel/0029Vb6RzZXJuyAKUH0YUC3k',
    'unn': 'https://whatsapp.com/channel/0029VbAkzM9A2pL8tUzNV72m',
    'unizik': 'https://whatsapp.com/channel/0029VbAOV3SCnA7o1ccft639',
    'kwasu': 'https://whatsapp.com/channel/0029Vb5WeS9BPzjafElsFW0e',
    'unical': 'https://whatsapp.com/channel/0029VbBBTkgDzgT2xRHcpb2A',
    'yabatech': 'https://whatsapp.com/channel/0029Vb6n1qqL2AU0rRd5pI2D',
    'dufuhs': 'https://whatsapp.com/channel/0029VbAzsc8GehEQFhVLIJ3x',
    'ebsu': 'https://whatsapp.com/channel/0029Vb61i6hK0IBhNmrByH1t',
    'lasued': 'https://whatsapp.com/channel/0029Vb65Mdt1dAwB7K3AB31W',
    'afit': 'https://whatsapp.com/channel/0029VbB35VN5q08UbtsW1F0l',
    'rsu': 'https://whatsapp.com/channel/0029VbBGQzVKbYMUqZAJPb1z',
    'adeleke': 'https://whatsapp.com/channel/0029VbB5LCt1Hsq3fBzuCE2l',
    'general': 'https://whatsapp.com/channel/0029VakYvdGBPzja0pE8OC3G'
}

html_files = sorted([f for f in os.listdir(schools_dir) if f.endswith('.html')])

for filename in html_files:
    filepath = os.path.join(schools_dir, filename)
    school_code = filename.replace('.html', '')
    
    channel_url = school_channels.get(school_code, school_channels['general'])
    school_name = school_code.upper() if school_code in school_channels else "OAE MAIN"
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if "<!-- WHATSAPP CHANNEL LINK -->" in content:
        print(f"Skipping {filename}, already processed.")
        continue

    whatsapp_block = f"""
            <!-- WHATSAPP CHANNEL LINK -->
            <div class="section-block" style="background: #e8f5e9; border: 1px solid #c8e6c9; border-radius: 8px; text-align: center; padding: 25px;">
                <h2 style="border-bottom: none; margin-bottom: 10px; color: #2e7d32; display: flex; justify-content: center; align-items: center; gap: 10px;">
                    <i class="fab fa-whatsapp" style="font-size: 1.8rem; color: #25D366;"></i> Official Updates Channel
                </h2>
                <p style="color: #555; margin-bottom: 20px; font-size: 1.05rem;">Tap to join the dedicated WhatsApp channel to get all updates and info concerning {school_name}.</p>
                <a href="{channel_url}" target="_blank" style="display: inline-block; background: #25D366; color: white; font-weight: bold; padding: 12px 25px; border-radius: 25px; text-decoration: none; font-size: 1.1rem; transition: 0.3s; box-shadow: 0 4px 6px rgba(37, 211, 102, 0.3);">
                    Join {school_name} Channel
                </a>
            </div>

            <div class="back-section"
"""
    
    # We will replace <div class="back-section" with our block (which includes the original string at the end)
    # But wait, we should find <div class="back-section"> or <div class="back-section" style="...">
    
    new_content = re.sub(r'<div class="back-section"', whatsapp_block.strip()[:-19], content)
    
    # The replacement approach:
    # re.sub replaces `<div class="back-section"` with `... </div> \n\n <div class="back-section"`
    
    whatsapp_html = f"""
            <!-- WHATSAPP CHANNEL LINK -->
            <div class="section-block" style="background: #e8f5e9; border: 1px solid #c8e6c9; border-radius: 8px; text-align: center; padding: 25px; box-shadow: 0 4px 15px rgba(37, 211, 102, 0.1);">
                <h2 style="border-bottom: none; margin-bottom: 10px; color: #2e7d32; display: flex; justify-content: center; align-items: center; gap: 10px;">
                    <i class="fab fa-whatsapp" style="font-size: 1.8rem; color: #25D366;"></i> Official Updates Channel
                </h2>
                <p style="color: #555; margin-bottom: 20px; font-size: 1.05rem;">Tap to join the dedicated WhatsApp channel to get all updates and info concerning {school_name}.</p>
                <a href="{channel_url}" target="_blank" style="display: inline-flex; align-items: center; gap: 8px; background: #25D366; color: white; font-weight: bold; padding: 12px 25px; border-radius: 25px; text-decoration: none; font-size: 1.1rem; transition: 0.3s; box-shadow: 0 4px 6px rgba(37, 211, 102, 0.3);">
                    Join {school_name} Channel <i class="fas fa-arrow-right"></i>
                </a>
            </div>

            <div class="back-section\""""
            
    new_content = content.replace('<div class="back-section"', whatsapp_html)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filename}")
    else:
        print(f"Failed to update {filename} (back-section not found?)")
