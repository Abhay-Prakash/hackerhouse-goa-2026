import sys
from PIL import Image

def draw_box(img_path):
    img = Image.open(img_path).convert("RGB")
    width, height = img.size
    
    row_counts = [0] * height
    col_counts = [0] * width
    
    for y in range(height):
        for x in range(width):
            r, g, b = img.getpixel((x, y))
            if r > 220 and g > 220 and b > 220:
                row_counts[y] += 1
                col_counts[x] += 1
                
    white_rows = [y for y in range(height) if row_counts[y] > 50]
    white_cols = [x for x in range(width) if col_counts[x] > 50]
    
    if white_rows and white_cols:
        min_x, max_x = min(white_cols), max(white_cols)
        min_y, max_y = min(white_rows), max(white_rows)
        
        # Draw red box
        for x in range(min_x, max_x + 1):
            if min_y < height: img.putpixel((x, min_y), (255, 0, 0))
            if max_y < height: img.putpixel((x, max_y), (255, 0, 0))
        for y in range(min_y, max_y + 1):
            if min_x < width: img.putpixel((min_x, y), (255, 0, 0))
            if max_x < width: img.putpixel((max_x, y), (255, 0, 0))
            
        img.save('d:/AIML/Id_Card/hackerhousegoa/public/test_bounds.png')
        print("Saved test_bounds.png")
    else:
        print("Not found")

if __name__ == '__main__':
    draw_box('d:/AIML/Id_Card/hackerhousegoa/public/hhgoa_front_base.png')
