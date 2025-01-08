"use client";
import { IKUpload } from "imagekitio-next";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";

const FileUpload = ({
  onSuccess,
}: {
  onSuccess: (response: IKUploadResponse) => void;
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<String | null>(null);

  const onError = (err: { message: string }) => {
    setError(err.message);
    setIsUploading(false);
  };

  const handleSuccess = (res: IKUploadResponse) => {
    setError(null);
    setIsUploading(false);
    onSuccess(res);
  };

  const handleUploading = () => {
    setIsUploading(true);
    setError(null);
  };

  return (
    <div className="space-y-2">
      <IKUpload
        fileName="test-upload.png"
        onError={onError}
        onSuccess={handleSuccess}
        onUploadStart={handleUploading}
        validateFile={(file: File) => {
          const validType = ["image/jpeg", "image/png", "image/webp"];
          if (!validType.includes(file.type)) {
            setError("Invalid file type. Please upload a valid image file.");
          }

          if (file.size > 1024 * 1024 * 5) {
            setError("File size should be less than 5MB");
          }

          return true;
        }}
      />
      {isUploading && <Progress value={33} />}
      {error && <div className="text-red-500 text-sm font-medium">{error}</div>}
    </div>
  );
};

export default FileUpload;
