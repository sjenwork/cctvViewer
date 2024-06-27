<h1 style='text-align:center'> CCTV Viewer </h1>
<p style='text-align:center; margin:0px 100px'>
這個工具是提供給中科專案使用，檢視CCTV影像，並且可以對影像進行評分，最後可以進行熱力圖的顯示。
</p>

## How to use

1. 下載 main.html 檔案，並且開啟。
2. 將要上傳的圖片拖曳至上傳區，程式會自動執行，並將影像顯示在中。
3. 成功上傳後，會在下方的區塊顯示照片
4. 操作說明：
   1. 簡報模式
      - 可以使用方向鍵 `←` `→` 來切換圖片
      - 也可以點擊照片的左右區域來切換圖片
      - 可以使用 `1` `2` `3` `4` 來對圖片進行評分
      - 評分完的圖片會在左上角顯示評分
      - 完成之後點擊下載分級檔案，可以下載 txt/json 檔案，裡面包含了所有圖片的評分
      - 可以切換至熱力圖模式，來顯示熱力圖
      - 可以切換至表格模式，來顯示所有`圖片` 與 `評分` (*未完成*)
   2. 表格模式
      - 用來檢視依據日期排列的所有 `圖片` 與 `評分`  (*未完成*) 
   3. 熱力圖模式
      - 用來顯示所有圖片的評分熱力圖
      - 若已經有評分檔案，可以上傳評分檔案，程式會自動顯示熱力圖，並在簡報模式中顯示評分 
## Demo Image
  - 請參考 image_eample 資料夾

## Others
  - image_preprocess.py 檔案是用來處理原始 bmp 檔案，將其轉換成 jpg 檔案。
  - requirement
    - python 3.7
     - pip install pillow
  - input_dir 填入原始檔案的資料夾，原始檔案的檔名格式為 DVR#1-cam01-20210301-060057.bmp
  - output_base_dir 填入轉換後的檔案資料夾，轉換後的檔案的檔名格式為 20210301-060057.jpg
  - 參考程式碼
  ```python
     input_dir = "images_raw"
     output_base_dir = "image_example"
     batch_convert_bmp_to_png(input_dir, output_base_dir)
  ```
## Demo
  - 暫無