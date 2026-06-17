import { useState } from "react";
import { uploadImage } from "../services/storage";

// Lets an admin either paste an image URL or upload a file to Firebase Storage.
// Always reports the final URL string up via onChange.
export default function ImageInput({ folder, value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setErr(null);
    try {
      const url = await uploadImage(folder, file);
      onChange(url);
    } catch (error) {
      console.error("Image upload failed:", error);
      setErr("Încărcarea a eșuat. Lipește un URL în loc.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="image-input">
      <input
        type="text"
        placeholder="https://… sau /images/produs.png"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
      <label className="btn btn-ghost file-btn">
        {uploading ? "Se încarcă…" : "⬆ Încarcă"}
        <input type="file" accept="image/*" hidden onChange={handleFile} disabled={uploading} />
      </label>
      {value && <img className="image-preview" src={value} alt="preview" />}
      {err && <small className="field-error">{err}</small>}
    </div>
  );
}
