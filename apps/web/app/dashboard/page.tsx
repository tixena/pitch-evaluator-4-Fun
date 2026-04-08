"use client";


import {
  ArrowUpRight,
  CircleDot,
  QrCode,
  // Share2,
  Sparkles,
  Trophy,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { useSignOut } from "@/hooks/auth";
import { useEvents, usePitches, useRanking, usePitchQr } from "@/hooks/dashboard";
//helper
import { exportEvent, exportPitch } from "@/lib/dashboard-api";

// const stats = [
//   { label: "Pitches activos", value: "12", accent: "text-white" },
//   { label: "Votos recibidos", value: "347", accent: "text-lime-300" },
//   { label: "Puntuacion media", value: "4.2", accent: "text-cyan-400" },
//   { label: "Evaluadores", value: "89", accent: "text-fuchsia-400" },
// ] as const;

// const ranking = [
//   {
//     position: "01",
//     name: "EcoTrack AI",
//     innovation: "4.8",
//     viability: "4.5",
//     impact: "4.9",
//     presentation: "4.8",
//     total: "4.70",
//   },
//   {
//     position: "02",
//     name: "FieldLynx",
//     innovation: "4.3",
//     viability: "4.6",
//     impact: "4.2",
//     presentation: "4.4",
//     total: "4.36",
//   },
//   {
//     position: "03",
//     name: "MediConnect",
//     innovation: "4.1",
//     viability: "4.0",
//     impact: "4.5",
//     presentation: "3.9",
//     total: "4.13",
//   },
//   {
//     position: "04",
//     name: "AgriVolt",
//     innovation: "3.8",
//     viability: "4.2",
//     impact: "3.7",
//     presentation: "4.1",
//     total: "3.95",
//   },
//   {
//     position: "05",
//     name: "SafeRoute",
//     innovation: "3.6",
//     viability: "3.9",
//     impact: "4.0",
//     presentation: "3.8",
//     total: "3.78",
//   },
// ] as const;

const summaryBlocks = [
  {
    tone: "positive",
    title: "Lo que destaca",
    body: "El publico valoro mucho el enfoque practico de usar IA para procesos ambientales y tiempo real. Varios comentarios dicen que la solucion se siente lista para piloto.",
  },
  {
    tone: "warning",
    title: "A mejorar",
    body: "Falto claridad en el modelo de negocio. Algunos evaluadores piden ejemplos mas concretos sobre escalabilidad y costos de implementacion.",
  },
] as const;



function FakeQr() {
  const cells = [
    1, 1, 1, 0, 1, 1, 1,
    1, 0, 1, 0, 1, 0, 1,
    1, 1, 1, 0, 1, 1, 1,
    0, 0, 0, 0, 0, 0, 0,
    1, 1, 0, 1, 0, 1, 1,
    1, 0, 1, 1, 1, 0, 1,
    1, 1, 1, 0, 1, 1, 1,
  ];

  return (
    <div className="rounded-2xl bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, index) => (
          <div
            key={index}
            className={cell ? "h-3 w-3 rounded-[2px] bg-[#0a0a0f]" : "h-3 w-3"}
          />
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { mutate: logout, isPending } = useSignOut();

  //query
  const {data: events = [] } = useEvents();
  const selectedEventId = events[0]?.id;//selecciona el primer evento automaticamente

  const {data: pitches = [] } = usePitches(selectedEventId);//trae pitches del eventos
  const selectedPitchId = pitches[0]?.id;

  const { data: rankingData = [] } = useRanking(selectedEventId);
  const { data: qrData } = usePitchQr(selectedPitchId);

  async function handlerExportEvent() {
    if(!selectedEventId) return;

    const blob = await exportEvent(selectedEventId);//pide el archivo
    const url = URL.createObjectURL(blob);//convierte el archivo en una url
    const link = document.createElement("a");//crear el link
    link.href = url;//apunta al archivo
    link.download = "event-results.csv";//nombre del archivo
    link.click();//simula un click, se descarga
    URL.revokeObjectURL(url)//limpiar memoria
  }

  async function handlerExportPitch() {
    if (!selectedPitchId) return;

    const blob = await exportPitch(selectedPitchId);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "pitch-results.csv";
    link.click();
    URL.revokeObjectURL(url)
  }

  //arreglo de objetos, representa una tarjeta de estadística en pantalla
  const stats = [
    {
      label: "Pitches activos",
      value: String(pitches.length),
      accent: "text-white",
    },
    {
      label: "Votos recibidos",
      value: String(
        rankingData.reduce(
          (sum: number, item: { votesCount: number }) => sum + item.votesCount,//suma todos los votos
          0,
        ),
      ),
      accent: "text-lime-300",
    },
    {
      label: "Puntuacion media",
      value:
        rankingData.length > 0
          ? (
              rankingData.reduce(
                (sum: number, item: { scoreAvg: number }) => sum + item.scoreAvg,
                0,
              ) / rankingData.length
            ).toFixed(1)//deja un decimal
          : "0.0",
      accent: "text-cyan-400",
    },
    {
      label: "Evaluadores",
      value: "N/D",//no disponible
      accent: "text-fuchsia-400",
    },
  ];
  
  return (
    <main className="min-h-svh bg-[#0a0a0f] text-white">
      <div className="mx-auto flex min-h-svh w-full max-w-[1440px] flex-col gap-4 px-4 py-4 md:px-8 md:py-6">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ccff00] text-xs font-black text-black">
              P
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold tracking-tight">pitch4fun</span>
              <span className="text-sm text-[#555566]">/</span>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#8888aa]">
                {events[0]?.name ?? "Sin eventos"}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ff2d78] bg-[#1a0a0a] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#ff6ea7]">
              <CircleDot className="size-3 fill-current" />
              En vivo
            </div>

            <div className="inline-flex items-center gap-2 rounded-lg border border-[#2a2a3a] bg-[#22222f] px-4 py-2 text-sm text-[#d8d8e6]">
              <Trophy className="size-4 text-[#9ea0bf]" />
              Proyectar
            </div>

            <Button
              variant="outline"
              className="border-[#2a2a3a] bg-[#14141d] text-white hover:bg-[#1d1d29] hover:text-white"
              onClick={() => logout()}
              disabled={isPending}
            >
              {isPending ? "Cerrando..." : "Cerrar sesion"}
            </Button>
          </div>
        </header>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="flex min-w-0 flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {/*recorre cada elemento de cada arreglo */}
              {stats.map((stat) => ( 
                <article
                  key={stat.label}
                  className="rounded-xl border border-[#2a2a3a] bg-[#1a1a25] px-4 py-4"
                >
                  <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#6f7088]">
                    {stat.label} {/*mostrar nombre*/}
                  </p>
                  <p className={`mt-3 text-3xl font-semibold tracking-tight ${stat.accent}`}>
                    {stat.value}{/*mostrar valor*/}
                  </p>
                </article>
              ))}
            </div>

            <section className="min-w-0 overflow-hidden rounded-xl border border-[#2a2a3a] bg-[#1a1a25]">
              <div className="flex items-center justify-between border-b border-[#262636] px-4 py-3">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#7f8099]">
                    Ranking en vivo
                  </p>
                  <p className="mt-1 text-sm text-[#a7a8be]">
                    Tabla proyectable para moderacion y jurado.
                  </p>
                </div>
                <div className="rounded-full bg-[#223100] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ccff00]">
                  Actualizado
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="border-b border-[#262636] text-[10px] uppercase tracking-[0.22em] text-[#66677f]">
                      <th className="px-4 py-3 font-medium">#</th>
                      <th className="px-4 py-3 font-medium">Proyecto</th>
                      <th className="px-4 py-3 font-medium">Inn</th>
                      <th className="px-4 py-3 font-medium">Via</th>
                      <th className="px-4 py-3 font-medium">Imp</th>
                      <th className="px-4 py-3 font-medium">Pres</th>
                      <th className="px-4 py-3 font-medium text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankingData.map((item, index) => (
                      <tr
                        key={item.name}
                        className="border-b border-[#20202d] text-sm text-[#d7d8e5] last:border-b-0"
                      >
                        <td className="px-4 py-4 font-mono text-xs text-[#8c8da4]">
                          {String(index + 1).padStart(2, "0")} {/*muestra el numero de posicion */}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <span
                              className={`h-2 w-2 rounded-full ${
                                index === 0 ? "bg-[#ccff00]" : "bg-[#53546a]"//resaltar ganador
                              }`} 
                            />
                            <span className={index === 0 ? "font-semibold text-[#f8ffcf]" : ""}>
                              {item.name} {/*nombre del proyecto */}
                            </span>
                          </div>
                        </td>{/*muestra las puntuaciones en cada categoria */}
                        <td className="px-4 py-4 text-[#9da0bc]">{item.innovationAvg}</td>
                        <td className="px-4 py-4 text-[#9da0bc]">{item.viabilityAvg}</td>
                        <td className="px-4 py-4 text-[#9da0bc]">{item.impactAvg}</td>
                        <td className="px-4 py-4 text-[#9da0bc]">{item.presentationAvg}</td>
                        <td className="px-4 py-4 text-right font-semibold text-[#ccff00]">
                          {item.scoreAvg} {/*puntaje final */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <aside className="flex flex-col gap-4">
            <section className="rounded-xl border border-[#2a2a3a] bg-[#1a1a25] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#7f8099]">
                    Codigo de acceso
                  </p>
                  <h2 className="mt-2 text-xl font-semibold tracking-tight">{qrData?.name ?? pitches[0]?.name ?? "Sin pitch seleccionado"}</h2>
                </div>
                <QrCode className="size-5 text-[#ccff00]" />
              </div>

              <div className="mt-5 flex justify-center">
                <FakeQr />
              </div>

              <p className="mt-4 text-center text-xs text-[#7f8099]">
                escanea para abrir el formulario de voto
              </p>

              <div className="mt-4 rounded-lg bg-[#202726] px-4 py-3">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-2xl font-semibold text-[#ccff00]">29</p>
                    <p className="text-xs text-[#97a093]">votos recibidos</p>
                  </div>
                  {/*boton descarga los datos del pitch */}
                  <Button className="bg-[#ccff00] text-black hover:bg-[#e0ff66]"
                    onClick={handlerExportPitch}
                    disabled={!selectedPitchId}//si desactiva si no hay pitch seleccionado
                  >
                    Export pitch
                  </Button>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2 text-[#7f8099]">
                <button className="rounded-lg border border-[#2a2a3a] p-2 transition hover:bg-[#212130]"
                  onClick={handlerExportEvent}
                >
                  <ArrowUpRight className="size-4" />
                </button>
                <button className="rounded-lg border border-[#2a2a3a] p-2 transition hover:bg-[#212130]">
                  <ArrowUpRight className="size-4" />
                </button>
              </div>
            </section>

            <section className="flex flex-1 flex-col rounded-xl border border-[#2a2a3a] bg-[#1a1a25] p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-[#d06bff]" />
                  <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#a88cc8]">
                    Resumen IA
                  </p>
                </div>
                <span className="rounded-full bg-[#2b1836] px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] text-[#d06bff]">
                  Beta
                </span>
              </div>

              <div className="mt-4 flex flex-col gap-4">
                {summaryBlocks.map((block) => (
                  <article
                    key={block.title}
                    className="rounded-xl border border-[#252538] bg-[#151520] p-4"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          block.tone === "positive" ? "bg-[#ccff00]" : "bg-[#ff4c83]"
                        }`}
                      />
                      <h3 className="text-sm font-semibold text-white">{block.title}</h3>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[#aeb0c4]">{block.body}</p>
                  </article>
                ))}
              </div>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}
