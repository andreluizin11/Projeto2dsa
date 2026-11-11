"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function agendar(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("consultas").insert({
    paciente_id: Number(formData.get("paciente_id")),
    medico_id: Number(formData.get("medico_id")),
    data_hora: String(formData.get("data_hora")),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/");
}
