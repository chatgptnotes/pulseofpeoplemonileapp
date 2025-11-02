#!/usr/bin/env python3
"""Generate placeholder App Store screenshots"""

from PIL import Image, ImageDraw, ImageFont
import os

# Output directory
output_dir = "/Users/apple/Music/Cherri_pic_voiceagent/app-store-screenshots"
os.makedirs(output_dir, exist_ok=True)

# Screenshot specifications
screenshots = {
    "iphone_6_5": {
        "size": (1290, 2796),
        "screens": [
            {"title": "Dashboard", "subtitle": "Monitor campaign\nperformance in real-time"},
            {"title": "Analytics", "subtitle": "Data-driven insights\nfor your campaign"},
            {"title": "Voter Database", "subtitle": "Organize and segment\nvoter information"},
        ]
    },
    "ipad_13": {
        "size": (2048, 2732),
        "screens": [
            {"title": "Dashboard", "subtitle": "Monitor campaign\nperformance in real-time"},
            {"title": "Analytics", "subtitle": "Data-driven insights\nfor your campaign"},
            {"title": "Voter Database", "subtitle": "Organize and segment\nvoter information"},
        ]
    }
}

# App colors (from your app)
HEADER_COLOR = (30, 64, 175)  # #1E40AF
BACKGROUND_COLOR = (249, 250, 251)  # #F9FAFB
TEXT_COLOR = (17, 24, 39)  # #111827
ACCENT_COLOR = (59, 130, 246)  # #3B82F6

def create_screenshot(size, title, subtitle, filename):
    """Create a single screenshot"""
    width, height = size

    # Create image with background
    img = Image.new('RGB', size, BACKGROUND_COLOR)
    draw = ImageDraw.Draw(img)

    # Draw header (top ~15% of screen)
    header_height = int(height * 0.15)
    draw.rectangle([(0, 0), (width, header_height)], fill=HEADER_COLOR)

    # Try to use system font, fallback to default
    try:
        title_font_size = int(width * 0.08)
        subtitle_font_size = int(width * 0.045)

        # Try different font paths
        font_paths = [
            "/System/Library/Fonts/Helvetica.ttc",
            "/System/Library/Fonts/SFNSDisplay.ttf",
            "/Library/Fonts/Arial.ttf",
        ]

        title_font = None
        for font_path in font_paths:
            try:
                title_font = ImageFont.truetype(font_path, title_font_size)
                subtitle_font = ImageFont.truetype(font_path, subtitle_font_size)
                break
            except:
                continue

        if title_font is None:
            title_font = ImageFont.load_default()
            subtitle_font = ImageFont.load_default()

    except Exception as e:
        print(f"Font loading error: {e}")
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()

    # Draw app name in header
    app_name = "Pulse of People"

    # Get text bounding box for centering
    try:
        bbox = draw.textbbox((0, 0), app_name, font=title_font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
    except:
        text_width = len(app_name) * 20
        text_height = 30

    x = (width - text_width) // 2
    y = int(header_height * 0.3)

    draw.text((x, y), app_name, fill=(255, 255, 255), font=title_font)

    # Draw main content area
    content_y = header_height + int(height * 0.1)

    # Draw title
    try:
        bbox = draw.textbbox((0, 0), title, font=title_font)
        text_width = bbox[2] - bbox[0]
    except:
        text_width = len(title) * 30

    x = (width - text_width) // 2
    draw.text((x, content_y), title, fill=TEXT_COLOR, font=title_font)

    # Draw subtitle
    subtitle_y = content_y + int(height * 0.08)

    # Draw subtitle lines
    lines = subtitle.split('\n')
    for i, line in enumerate(lines):
        try:
            bbox = draw.textbbox((0, 0), line, font=subtitle_font)
            text_width = bbox[2] - bbox[0]
        except:
            text_width = len(line) * 15

        x = (width - text_width) // 2
        y = subtitle_y + (i * int(height * 0.05))
        draw.text((x, y), line, fill=(107, 114, 128), font=subtitle_font)

    # Draw a simple card mockup in the center
    card_width = int(width * 0.8)
    card_height = int(height * 0.25)
    card_x = (width - card_width) // 2
    card_y = int(height * 0.45)

    # Draw card shadow
    shadow_offset = 10
    draw.rectangle(
        [(card_x + shadow_offset, card_y + shadow_offset),
         (card_x + card_width + shadow_offset, card_y + card_height + shadow_offset)],
        fill=(0, 0, 0, 30)
    )

    # Draw card
    draw.rounded_rectangle(
        [(card_x, card_y), (card_x + card_width, card_y + card_height)],
        radius=20,
        fill=(255, 255, 255)
    )

    # Draw accent line on card
    draw.rounded_rectangle(
        [(card_x + 20, card_y + 20), (card_x + card_width - 20, card_y + 30)],
        radius=5,
        fill=ACCENT_COLOR
    )

    # Save
    img.save(filename, 'PNG', quality=95)
    print(f"Created: {filename}")

# Generate all screenshots
for device, config in screenshots.items():
    for i, screen in enumerate(config["screens"], 1):
        filename = os.path.join(output_dir, f"{device}_{i}_{screen['title'].lower().replace(' ', '_')}.png")
        create_screenshot(
            config["size"],
            screen["title"],
            screen["subtitle"],
            filename
        )

print(f"\n✅ All screenshots created in: {output_dir}")
print("\nScreenshots created:")
print("- iPhone 6.5\": 3 screenshots (1290 x 2796)")
print("- iPad 13\": 3 screenshots (2048 x 2732)")
print("\nUpload these to App Store Connect!")
