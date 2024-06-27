import os
from PIL import Image
import glob


def convert_bmp_to_png(input_file_path, output_base_dir):
    # 解析輸入檔名
    file_name = os.path.basename(input_file_path)
    base_name, _ = os.path.splitext(file_name)

    # 取得日期前面的部分作為資料夾名
    parts = base_name.split("-")
    folder_name = "-".join(parts[:-2])  # 日期前面的部分
    time_part = parts[-2] + "-" + parts[-1]  # 日期部分作為新檔名

    # 建立目標資料夾
    output_dir = os.path.join(output_base_dir, folder_name)
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    new_file_name = time_part + ".png"

    # 讀取BMP檔並轉換為PNG
    img = Image.open(input_file_path)
    new_file_path = os.path.join(output_dir, new_file_name)
    img.save(new_file_path, "PNG")
    return new_file_path


# 單檔測試範例
# input_file_path = "images_raw/DVR#1-cam01-20210301-060057.bmp"
# output_base_dir = "image_example"
# convert_bmp_to_png(input_file_path, output_base_dir)


def batch_convert_bmp_to_png(input_dir, output_base_dir):
    # 找到所有 BMP 檔案
    bmp_files = glob.glob(os.path.join(input_dir, "*.bmp"))

    # 使用 map 批次處理
    list(map(lambda bmp_file: convert_bmp_to_png(bmp_file, output_base_dir), bmp_files))


# 批次處理
input_dir = "images_raw"
output_base_dir = "image_example"
batch_convert_bmp_to_png(input_dir, output_base_dir)
