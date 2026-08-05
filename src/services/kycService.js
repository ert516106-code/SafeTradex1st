import { supabase } from "../lib/supabase";

export async function uploadKycFile(userId, file, label) {
  const ext = file.name.split(".").pop();
  const path = `${userId}/${label}-${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from("kyc-documents")
    .upload(path, file, { upsert: true });

  if (error) throw new Error(error.message);

  // Private bucket — store the raw storage path, not a public URL.
  // Signed URLs are generated on read, by whoever is authorized to view it.
  return path;
}

export async function submitKyc({
  userId,
  fullName,
  documentType,
  idNumber,
  idFrontFile,
  idBackFile,
  handheldFile,
}) {
  const [idFrontPath, idBackPath, handheldPath] = await Promise.all([
    uploadKycFile(userId, idFrontFile, "id-front"),
    uploadKycFile(userId, idBackFile, "id-back"),
    uploadKycFile(userId, handheldFile, "handheld"),
  ]);

  const { data, error } = await supabase
    .from("kyc_submissions")
    .insert({
      user_id: userId,
      full_name: fullName,
      document_type: documentType,
      id_number: idNumber,
      id_front_url: idFrontPath,
      id_back_url: idBackPath,
      handheld_photo_url: handheldPath,
      status: "pending",
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getMyKycStatus(userId) {
  const { data, error } = await supabase
    .from("kyc_submissions")
    .select("*")
    .eq("user_id", userId)
    .order("submitted_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}
