import os
from PIL import Image, ImageDraw, ImageFont

def generate_icons():
    # Load base image to derive branding
    base = Image.open('public/hhgoa_front_base.png')
    
    # Let's crop a section of the top-left to get the tribal pattern and the green background
    # The card is 874 x 1240. The tribal pattern is on the left and top.
    # Let's take a 512x512 square from the top-left (x=0, y=0 to x=512, y=512)
    # This will have the top border and left border!
    crop = base.crop((0, 0, 512, 512))
    
    # Save 512x512
    crop.save('public/icon-512x512.png')
    
    # Save 192x192
    icon_192 = crop.resize((192, 192), Image.Resampling.LANCZOS)
    icon_192.save('public/icon-192x192.png')
    
    # Save apple-touch-icon (typically 180x180)
    apple = crop.resize((180, 180), Image.Resampling.LANCZOS)
    apple.save('public/apple-touch-icon.png')
    
    # Save favicon.ico (16x16, 32x32, 48x48)
    favicon_sizes = [(16,16), (32,32), (48,48)]
    crop.save('public/favicon.ico', format='ICO', sizes=favicon_sizes)
    
    print("Generated icons from hhgoa_front_base.png")

if __name__ == "__main__":
    generate_icons()
