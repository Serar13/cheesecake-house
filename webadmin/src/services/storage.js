import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

// Upload an image File to storage under <folder>/<timestamp-name> and return its
// public download URL. Used by the image input so admins can either upload a
// file or paste an existing URL.
export async function uploadImage(folder, file) {
  const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const storageRef = ref(storage, `${folder}/${safeName}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}
