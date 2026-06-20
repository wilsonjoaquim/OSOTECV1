import { useState, useRef } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const PRESET = import.meta.env.VITE_CLOUDINARY_PRESET;

export default function ImageUploader({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef();

  const upload = async (file) => {
    if (!file) return;

    // Validar tipo e tamanho
    if (!file.type.startsWith("image/")) {
      alert("Apenas imagens são permitidas");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Imagem demasiado grande. Máximo 5MB.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", PRESET);
      formData.append("folder", "osotec/products");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();

      if (data.secure_url) {
        onChange(data.secure_url);
      } else {
        alert("Erro no upload. Verifica as configurações do Cloudinary.");
      }
    } catch (err) {
      alert("Erro ao fazer upload da imagem");
    } finally {
      setUploading(false);
    }
  };

  const handleFile = (e) => upload(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  };

  const handlePaste = (e) => {
    const file = Array.from(e.clipboardData.files).find(f => f.type.startsWith("image/"));
    if (file) upload(file);
  };

  return (
    <div>
      {value ? (
        /* Preview */
        <div className="relative group rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-50 h-48">
          <img
            src={value}
            alt="Produto"
            className="w-full h-full object-contain p-3"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              onClick={() => inputRef.current.click()}
              className="bg-white text-slate-700 font-bold px-4 py-2 rounded-xl text-xs hover:bg-blue-50 transition-colors flex items-center gap-1.5"
            >
              <Upload size={13} /> Substituir
            </button>
            <button
              onClick={() => onChange("")}
              className="bg-red-500 text-white font-bold px-3 py-2 rounded-xl text-xs hover:bg-red-600 transition-colors"
            >
              <X size={13} />
            </button>
          </div>
        </div>
      ) : (
        /* Upload Zone */
        <div
          onClick={() => inputRef.current.click()}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onPaste={handlePaste}
          className={`h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${
            dragOver
              ? "border-blue-500 bg-blue-50"
              : "border-slate-200 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 size={32} className="text-blue-500 animate-spin" />
              <p className="text-sm font-semibold text-blue-500">A fazer upload...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 text-center px-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${dragOver ? "bg-blue-100" : "bg-slate-100"}`}>
                <ImageIcon size={22} className={dragOver ? "text-blue-500" : "text-slate-400"} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-600">Clica ou arrasta a imagem</p>
                <p className="text-xs text-slate-400 mt-0.5">PNG, JPG, WEBP até 5MB</p>
                <p className="text-xs text-blue-400 mt-1">Podes também fazer Ctrl+V para colar</p>
              </div>
            </div>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}