import sys
from PIL import Image

def make_hole_transparent(img_path):
    img = Image.open(img_path).convert("RGBA")
    width, height = img.size
    
    # Scale from web coordinates (874x1240) to original (1728x2454)
    scale_x = width / 874.0
    scale_y = height / 1240.0
    
    # Web bounds
    web_left = 272
    web_top = 378
    web_width = 360
    web_height = 360
    
    # Original bounds
    orig_left = int(web_left * scale_x)
    orig_top = int(web_top * scale_y)
    orig_right = int((web_left + web_width) * scale_x)
    orig_bottom = int((web_top + web_height) * scale_y)
    
    pixels = img.load()
    
    for y in range(orig_top, orig_bottom):
        for x in range(orig_left, orig_right):
            r, g, b, a = pixels[x, y]
            # If the pixel is very light (white polaroid background), make it transparent
            if r > 230 and g > 230 and b > 230:
                pixels[x, y] = (r, g, b, 0)
                
    img.save(img_path)
    print("Successfully made the inner polaroid square transparent!")

if __name__ == '__main__':
    make_hole_transparent('d:/AIML/Id_Card/hackerhousegoa/public/hhgoa_front_base.png')
