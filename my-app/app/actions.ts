"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function agendar(formData: FormData) {
  const dataHora = String(formData.get("data_hora"));
  const ano = Number(dataHora.slice(0, 4));

  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(dataHora) || ano < 2026 || ano > 2100) {
    throw new Error("Data inválida. Confira se o ano tem 4 dígitos.");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("consultas").insert({
    paciente_id: Number(formData.get("paciente_id")),
    medico_id: Number(formData.get("medico_id")),
    data_hora: `${dataHora}:00-03:00`,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/");
}

export async function excluir(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) throw new Error("Consulta inválida.");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("consultas")
    .delete()
    .eq("id", id)
    .select("id");
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) {
    throw new Error("Não foi possível excluir. Falta a policy de DELETE no Supabase.");
  }
  revalidatePath("/");
}