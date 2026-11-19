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

function PessoaIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  );
}

function CalendarioIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

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

  if (error) return <p className="wrap">Erro ao buscar consultas: {error.message}</p>;

  const pacientes = (pac ?? []) as Paciente[];
  const medicos = (med ?? []) as Medico[];
  const consultas = (data ?? []) as unknown as Consulta[];

  const agendadas = consultas.filter((c) => c.status === "agendada").length;
  const realizadas = consultas.filter((c) => c.status === "realizada").length;

  return (
    <>
      <div className="topbar">
        <div className="wrap brand">
          <span className="brand-dot">C</span>
          Clínica do 2°DS-A
        </div>
      </div>

      <main className="wrap">
        <nav className="crumbs" aria-label="Você está em">
          <span>Página inicial</span>
          <span>›</span>
          <span>Consultas</span>
          <span>›</span>
          <span>Agendar</span>
        </nav>

        <h1 className="title">Agendar consulta</h1>
        <p className="lead">
          Escolha o médico, o paciente e o horário. A consulta fica salva na nuvem.
        </p>

        <div className="chips">
          <span className="chip">Pacientes cadastrados: {pacientes.length}</span>
          <span className="chip">Médicos: {medicos.length}</span>
          <span className="chip">Atendimento: na clínica</span>
        </div>

        <section className="card summary">
          <div className="stat main">
            <small>Consultas agendadas</small>
            <strong>{agendadas}</strong>
          </div>
          <div className="stat">
            <small>Consultas realizadas</small>
            <strong>{realizadas}</strong>
          </div>
          <a href="#medicos" className="btn">Agendar</a>
        </section>

        <section id="medicos" className="card section">
          <h2>Escolha o médico</h2>
          <p className="sub">Preencha o paciente e o horário no cartão do médico.</p>

          <div className="grid">
            {medicos.map((m) => (
              <div key={m.id} className="tile">
                <span className="icon"><PessoaIcon /></span>
                <div>
                  <h3>{m.nome}</h3>
                  <p>{m.especialidade}</p>
                </div>
                <form action={agendar}>
                  <input type="hidden" name="medico_id" value={m.id} />
                  <label className="field">
                    Paciente
                    <select name="paciente_id" required className="input">
                      {pacientes.map((p) => (
                        <option key={p.id} value={p.id}>{p.nome}</option>
                      ))}
                    </select>
                  </label>
                  <label className="field">
                    Data e hora
                    <input type="datetime-local" name="data_hora" required min="2026-01-01T00:00" max="2100-12-31T23:59" className="input" />
                  </label>
                  <button className="btn btn-soft">Agendar com este médico</button>
                </form>
              </div>
            ))}
          </div>
        </section>

        <section className="card section">
          <h2>Consultas</h2>
          <p className="sub">Todas as consultas, em ordem de data.</p>

          {consultas.length === 0 ? (
            <p className="empty">
              Nenhuma consulta agendada. Escolha um médico acima para marcar a primeira.
            </p>
          ) : (
            <ul className="grid">
              {consultas.map((c) => (
                <li key={c.id} className="tile">
                  <div className="tile-top">
                    <span className="icon"><CalendarioIcon /></span>
                    <span className={`status ${c.status}`}>{c.status}</span>
                  </div>
                  <div>
                    <h3>{c.pacientes?.nome}</h3>
                    <p>
                      com {c.medicos?.nome}
                      {c.medicos?.especialidade ? ` · ${c.medicos.especialidade}` : ""}
                    </p>
                  </div>
                  <p className="when">
                    {new Date(c.data_hora).toLocaleString("pt-BR", {
                      timeZone: "America/Sao_Paulo",
                    })}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="footer-space" />
      </main>
    </>
  );
}