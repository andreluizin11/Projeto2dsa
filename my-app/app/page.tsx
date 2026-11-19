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

const field =
  "w-full rounded-2xl border border-line bg-white/80 px-4 py-3 text-ink shadow-sm";

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

  if (error) return <p className="p-8">Erro ao buscar consultas: {error.message}</p>;

  const pacientes = (pac ?? []) as Paciente[];
  const medicos = (med ?? []) as Medico[];
  const consultas = (data ?? []) as unknown as Consulta[];

  return (
    <div className="mx-auto max-w-6xl px-5 pb-16">
      {/* navbar flutuante */}
      <header className="glass sticky top-4 z-10 mt-4 flex items-center justify-between rounded-full py-2.5 pl-3 pr-3">
        <div className="flex items-center gap-3">
          <span className="btn-grad grid size-10 place-items-center rounded-full font-serif text-lg text-white">
            C
          </span>
          <div className="leading-tight">
            <p className="font-serif text-lg font-semibold">Clínica do 2°DS-A</p>
            <p className="text-xs text-muted">Agenda de consultas</p>
          </div>
        </div>
        <a href="#agendar" className="btn-grad rounded-full px-5 py-2.5 text-sm font-semibold text-white">
          Agendar consulta
        </a>
      </header>

      <main className="mt-14 grid items-start gap-12 lg:grid-cols-2">
        {/* coluna esquerda: título + formulário */}
        <section id="agendar">
          <h1 className="font-serif text-5xl font-semibold leading-[1.05] sm:text-6xl">
            Clínica do 2°DS-A
          </h1>
          <p className="mt-3 font-serif text-2xl text-muted">Agenda de consultas em nuvem</p>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
            Escolha o paciente, o médico e o horário. A consulta aparece na lista ao lado.
          </p>

          <form action={agendar} className="glass mt-8 grid gap-4 rounded-3xl p-5">
            <label className="grid gap-1.5 text-sm font-medium">
              Paciente
              <select name="paciente_id" required className={field}>
                {pacientes.map((p) => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-1.5 text-sm font-medium">
              Médico
              <select name="medico_id" required className={field}>
                {medicos.map((m) => (
                  <option key={m.id} value={m.id}>{m.nome} ({m.especialidade})</option>
                ))}
              </select>
            </label>
            <label className="grid gap-1.5 text-sm font-medium">
              Data e hora
              <input type="datetime-local" name="data_hora" required className={field} />
            </label>
            <button className="btn-grad mt-1 rounded-full px-6 py-3.5 font-semibold text-white">
              Agendar consulta
            </button>
          </form>

          <div className="mt-5 flex flex-wrap gap-2.5 text-sm">
            <span className="glass rounded-full px-4 py-2">{pacientes.length} pacientes</span>
            <span className="glass rounded-full px-4 py-2">{medicos.length} médicos</span>
          </div>
        </section>

        {/* coluna direita: painel rosa com a lista */}
        <section className="glass relative rounded-[2.5rem] p-3">
          <div className="min-h-[28rem] rounded-[2rem] bg-blush p-6 pb-24">
            <h2 className="font-serif text-2xl font-semibold">Próximas consultas</h2>
            <ul className="mt-5 space-y-3">
              {consultas.length === 0 && (
                <li className="rounded-2xl bg-white/70 p-4 text-muted">
                  Nenhuma consulta agendada. Use o formulário para marcar a primeira.
                </li>
              )}
              {consultas.map((c) => (
                <li key={c.id} className="rounded-2xl bg-white/80 p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-semibold">{c.pacientes?.nome}</p>
                    <span className="rounded-full bg-paper px-3 py-1 text-xs font-medium text-wine">
                      {c.status}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-muted">
                    com {c.medicos?.nome}
                    {c.medicos?.especialidade ? ` · ${c.medicos.especialidade}` : ""}
                  </p>
                  <p className="mt-2 text-sm font-medium text-wine">
                    {new Date(c.data_hora).toLocaleString("pt-BR", {
                      timeZone: "America/Sao_Paulo",
                    })}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* cartão flutuante com o total */}
          <div className="glass absolute bottom-0 left-0 flex items-center gap-4 rounded-3xl px-5 py-4">
            <span className="btn-grad grid size-11 place-items-center rounded-2xl text-white" aria-hidden>
              ♥
            </span>
            <div>
              <p className="font-serif text-3xl font-semibold leading-none">{consultas.length}</p>
              <p className="mt-1 text-sm text-muted">consultas agendadas</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}