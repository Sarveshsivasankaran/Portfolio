import os
from rembg import remove
from PIL import Image

input_path = r'd:\Program files\Portfolio\public\characters\sarvesh-projects.png'
output_path = r'd:\Program files\Portfolio\public\characters\sarvesh-projects.png'

print("Opening image...")
inp = Image.open(input_path)
print("Removing background...")
out = remove(inp)
print("Saving image...")
out.save(output_path)
print("Done!")
