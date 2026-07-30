import { useRef, useState } from "react";

type Props = {
  onUpload: (file: File) => void;
  disabled?: boolean;
};

export default function UploadStep({ onUpload, disabled = false }: Props) {
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onUpload(file);
    }
  };

  return (
    <div className="upload-step">
      <label className="upload-box" htmlFor="slide-upload">
        <span className="upload-icon">📄</span>
        <div>
          <p className="upload-title">Kéo thả hoặc chọn file PDF / PPT</p>
          <p className="upload-hint">PDF, PPTX, TXT · tối đa 50MB</p>
        </div>
      </label>
      <input
        ref={fileInputRef}
        id="slide-upload"
        type="file"
        accept=".pdf,.pptx,.ppt,.txt"
        onChange={handleFileChange}
        disabled={disabled}
        hidden
      />
      {fileName && <p className="file-name">Đã chọn: {fileName}</p>}
    </div>
  );
}
