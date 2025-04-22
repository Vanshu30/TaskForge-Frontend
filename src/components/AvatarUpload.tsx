
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload } from "lucide-react";

interface AvatarUploadProps {
  onChange: (dataUrl: string) => void;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ onChange }) => {
  const [showCamera, setShowCamera] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Upload
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Open file input dialog
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  // Camera actions
  const handleOpenCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert("Unable to access camera");
      setShowCamera(false);
    }
  };

  const handleTakePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/png");
    setPreview(dataUrl);
    onChange(dataUrl);
  };

  const handleCloseCamera = () => {
    setShowCamera(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" onClick={openFileDialog}>
          <Upload className="mr-1" /> Upload
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={handleOpenCamera}>
          <Camera className="mr-1" /> Camera
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
        />
      </div>
      {showCamera && (
        <div className="flex flex-col items-center mt-2 border rounded-md p-3">
          <video
            ref={videoRef}
            autoPlay
            className="w-48 h-36 rounded object-cover bg-black"
            style={{ display: showCamera ? "block" : "none" }}
          ></video>
          <div className="flex mt-2 gap-2">
            <Button size="sm" type="button" onClick={handleTakePhoto}>
              Take Photo
            </Button>
            <Button size="sm" variant="outline" type="button" onClick={handleCloseCamera}>
              Close
            </Button>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
      {preview && (
        <div className="mt-2 flex flex-col items-center">
          <img
            src={preview}
            alt="Avatar Preview"
            className="rounded-full w-20 h-20 object-cover border"
          />
        </div>
      )}
    </div>
  );
};

export default AvatarUpload;
