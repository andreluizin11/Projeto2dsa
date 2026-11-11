import { createClient } from "@/utils/supabase/server";
import { agendar } from "./actions";

type Paciente = { id: number; nome: string };
type Medico = { id: number; nome: string; especialidade: string };
type Consulta = {
  id: number;
  data_hora: string;
  status: string;
  pacientes: { nome: string } | null;
  medicos: { nome: string; especialidade: string } | null;
};

export default async function Home() {
  const supabase = await createClient();

  const { data: pac } = await supabase.from("pacientes").select("id, nome");
  const { data: med } = await supabase
    .from("medicos")
    .select("id, nome, especialidade");
  const { data, error } = await supabase
    .from("consultas")
    .select("id, data_hora, status, pacientes(nome), medicos(nome, especialidade)")
    .order("data_hora");

  if (error) return <p>Erro ao buscar consultas: {error.message}</p>;

  const pacientes = (pac ?? []) as Paciente[];
  const medicos = (med ?? []) as Medico[];
  const consultas = (data ?? []) as unknown as Consulta[];

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-bold">Clínica Cloud</h1>
      <p className="text-slate-500">Agenda de consultas em nuvem</p>

      <form action={agendar} className="mt-6 grid gap-3 rounded-xl border p-4">
        <select name="paciente_id" required className="rounded border p-2">
          {pacientes.map((p) => (
            <option key={p.id} value={p.id}>{p.nome}</option>
          ))}
        </select>
        <select name="medico_id" required className="rounded border p-2">
          {medicos.map((m) => (
            <option key={m.id} value={m.id}>{m.nome} ({m.especialidade})</option>
          ))}
        </select>
        <input type="datetime-local" name="data_hora" required
          className="rounded border p-2" />
        <button className="rounded bg-indigo-600 p-2 text-white">Agendar</button>
      </form>

      <ul className="mt-6 space-y-2">
        {consultas.map((c) => (
          <li key={c.id} className="rounded-lg border p-3">
            <strong>{c.pacientes?.nome}</strong> com {c.medicos?.nome} —{" "}
            {new Date(c.data_hora).toLocaleString("pt-BR", {
              timeZone: "America/Sao_Paulo",
            })}{" "}
            <em>({c.status})</em>
          </li>
        ))}
      </ul>
    </main>
  );
}
