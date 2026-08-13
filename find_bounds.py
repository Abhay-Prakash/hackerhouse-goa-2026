import sys
from PIL import Image

def get_info(img_path):
    img = Image.open(img_path)
    print(f"Size: {img.size}")

if __name__ == '__main__':
    get_info('d:/AIML/Id_Card/hackerhousegoa/public/hhgoa_front_base.png')
