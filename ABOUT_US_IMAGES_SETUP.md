# About Us Page - Image Setup Instructions

## Images Required

You need to place 2 images of Srila Prabhupada in the following directory:

```
/var/www/donation-app/frontend/public/images/
```

## Image Names

1. **srila-prabhupada-1.jpg** - The first image (showing Srila Prabhupada smiling)
2. **srila-prabhupada-2.jpg** - The second image (showing Srila Prabhupada in meditation pose)

## Steps to Add Images

### Option 1: Using Command Line
```bash
# Navigate to the images directory
cd /var/www/donation-app/frontend/public/images/

# Copy your images here with the exact names:
# srila-prabhupada-1.jpg
# srila-prabhupada-2.jpg
```

### Option 2: Manual Copy
1. Save the two attached images from the conversation
2. Rename them to:
   - `srila-prabhupada-1.jpg` (first image)
   - `srila-prabhupada-2.jpg` (second image)
3. Copy them to: `/var/www/donation-app/frontend/public/images/`

## Verify Installation

After adding the images, you can verify they're in the right place:

```bash
ls -la /var/www/donation-app/frontend/public/images/
```

You should see both `srila-prabhupada-1.jpg` and `srila-prabhupada-2.jpg` listed.

## Access the About Us Page

Once the images are in place, visit:
```
http://your-domain/about
```

The About Us page will display with:
- Welcome section with introductory text
- Inspiration section with the story of Srila Prabhupada
- Both images of Srila Prabhupada
- "Join Our Cause" button

## Notes

- The images should be in JPG format
- Recommended dimensions: At least 800x800 pixels for best quality
- The page is fully responsive and will work on all devices
