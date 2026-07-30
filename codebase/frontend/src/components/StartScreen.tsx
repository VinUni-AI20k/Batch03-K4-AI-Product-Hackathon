import { useRef, useState } from 'react';

function formatSize(bytes: number) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

interface StartScreenProps {
  hidden: boolean;
  onStart: (file: File | null) => void;
}

export function StartScreen({ hidden, onStart }: StartScreenProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadProgressVisible, setUploadProgressVisible] = useState(false);
  const [startBtnReady, setStartBtnReady] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setSelectedFile(file);
    setUploadProgressVisible(true);
    setUploadProgress(0);
    setStartBtnReady(false);

    let pct = 0;
    const timer = setInterval(() => {
      pct += Math.random() * 22 + 8;
      if (pct >= 100) {
        pct = 100;
        clearInterval(timer);
        setStartBtnReady(true);
      }
      setUploadProgress(pct);
    }, 180);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) processFile(f);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) processFile(f);
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setUploadProgressVisible(false);
    setUploadProgress(0);
    setStartBtnReady(false);
  };

  return (
    <div id="startScreen" className={hidden ? 'hidden' : ''}>
      <div className="start-card">
        <div className="start-brand">
          <span className="logo">◆</span>
          <span className="name">OpenMAIC</span>
        </div>
        <h1 className="start-title">Tải lên slide bài học</h1>
        <p className="start-sub">
          Chọn file slide (PowerPoint, PDF hoặc hình ảnh) để AI Teacher chuyển thành bài giảng tương tác kèm giọng đọc, sơ đồ tư duy và bài tập.
        </p>

        <div id="dropzone" onDragOver={handleDragOver} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()}>
          <div className="dz-icon">📤</div>
          <div className="dz-title">Kéo thả file vào đây, hoặc bấm để chọn</div>
          <div className="dz-sub">Tối đa 50MB</div>
          <div className="dz-formats">
            <span className="dz-tag">.pptx</span>
            <span className="dz-tag">.pdf</span>
            <span className="dz-tag">.png / .jpg</span>
          </div>
        </div>
        <input
          type="file"
          id="fileInput"
          ref={fileInputRef}
          accept=".pptx,.ppt,.pdf,.png,.jpg,.jpeg"
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />

        {selectedFile && (
          <div id="fileCard" className="show">
            <div className="fc-icon">📄</div>
            <div className="fc-info">
              <div className="fc-name" id="fcName">
                {selectedFile.name}
              </div>
              <div className="fc-size" id="fcSize">
                {formatSize(selectedFile.size)}
              </div>
            </div>
            <button className="fc-remove" onClick={removeFile}>
              ✕
            </button>
          </div>
        )}

        {uploadProgressVisible && (
          <div id="uploadProgress" className="show">
            <div id="uploadProgressFill" style={{ width: `${uploadProgress}%` }}></div>
          </div>
        )}

        <button
          className={`start-btn ${startBtnReady ? 'ready' : ''}`}
          id="startBtn"
          onClick={() => startBtnReady && onStart(selectedFile)}
          style={{ pointerEvents: startBtnReady ? 'auto' : 'none' }}
        >
          Bắt đầu học →
        </button>

        <div className="start-skip">
          <a onClick={() => onStart(null)}>Dùng slide mẫu, bỏ qua tải lên</a>
        </div>
      </div>
    </div>
  );
}
