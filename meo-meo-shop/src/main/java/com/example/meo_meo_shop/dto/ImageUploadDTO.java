package com.example.meo_meo_shop.dto;

import jakarta.validation.constraints.NotBlank;

public class ImageUploadDTO {
    @NotBlank(message = "Chuỗi base64 không được để trống")
    private String base64Image;
    private String fileName;

    public String getBase64Image() {
        return base64Image;
    }

    public void setBase64Image(String base64Image) {
        this.base64Image = base64Image;
    }
    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
}
