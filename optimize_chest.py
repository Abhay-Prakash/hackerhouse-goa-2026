from PIL import Image

def optimize_chest():
    for name in ['treasureboxclose', 'treasureboxopen']:
        input_path = f'public/{name}.png'
        output_path = f'public/{name}.webp'
        try:
            img = Image.open(input_path).convert("RGBA")
            img.save(output_path, "WEBP", quality=80)
            print(f"Optimized {input_path} to {output_path}")
        except Exception as e:
            print(f"Failed to optimize {input_path}: {e}")

if __name__ == "__main__":
    optimize_chest()
