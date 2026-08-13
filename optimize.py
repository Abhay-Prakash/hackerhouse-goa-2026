from PIL import Image

def optimize():
    input_path = 'public/hhgoa_front_base.png'
    output_path = 'public/hhgoa_front_base.webp'
    img = Image.open(input_path).convert("RGBA")
    # Save as WebP with High Quality
    img.save(output_path, "WEBP", quality=80)
    print(f"Optimized {input_path} to {output_path}")

if __name__ == "__main__":
    optimize()
