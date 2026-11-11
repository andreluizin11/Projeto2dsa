"use client";

import { useState } from "react";

type Product = { id: number; name: string; detail: string; price: number; color: string; shape: "vase" | "bowl" | "mug" };

const products: Product[] = [
  { id: 1, name: "Vaso Maré", detail: "Esmalte azul-cobalto, 28 cm", price: 189, color: "#2F4BFF", shape: "vase" },
  { id: 2, name: "Tigela Sal", detail: "Esmalte branco fosco, 600 ml", price: 94, color: "#D9DEDB", shape: "bowl" },
  { id: 3, name: "Caneca Brasa", detail: "Esmalte ferrugem, 320 ml", price: 62, color: "#B5452B", shape: "mug" },
  { id: 4, name: "Vaso Musgo", detail: "Esmalte verde-oliva, 18 cm", price: 139, color: "#5E6B3A", shape: "vase" },
];

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function Piece({ shape, color }: { shape: Product["shape"]; color: string }) {
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
      {shape === "vase" && <path d="M48 18h24v14c0 8 18 16 18 40 0 22-14 32-30 32S30 94 30 72c0-24 18-32 18-40z" fill={color} />}
      {shape === "bowl" && <path d="M14 48h92c0 30-20 52-46 52S14 78 14 48z" fill={color} />}
      {shape === "mug" && (
        <>
          <rect x="28" y="30" width="56" height="66" rx="8" fill={color} />
          <path d="M84 44h8a14 14 0 0 1 0 28h-8" fill="none" stroke={color} strokeWidth="9" />
        </>
      )}
    </svg>
  );
}

export default function Home() {
  const [cart, setCart] = useState<number[]>([]);
  const total = cart.reduce((sum, id) => sum + (products.find((p) => p.id === id)?.price ?? 0), 0);

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <a href="#" className="text-2xl font-semibold tracking-tight [font-family:var(--font-display)]">Esmalte</a>
        <nav className="hidden gap-8 text-sm md:flex" aria-label="Principal">
          <a href="#produtos" className="hover:underline">Peças</a>
          <a href="#entrega" className="hover:underline">Entrega</a>
          <a href="#ateliê" className="hover:underline">Ateliê</a>
        </nav>
        <button className="rounded-full border border-[#17262B] px-4 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4BFF]">
          Sacola ({cart.length}){total > 0 && ` · ${brl(total)}`}
        </button>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 pb-20 pt-10 md:grid-cols-2">
          <div>
            <h1 className="text-5xl font-semibold leading-[1.02] tracking-tight [font-family:var(--font-display)] md:text-7xl">
              Cerâmica que leva a marca da mão que a fez.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-[#3D4F54]">
              Cada peça sai de uma fornada de, no máximo, vinte unidades. Quando acaba, só na próxima.
            </p>
            <a href="#produtos" className="mt-8 inline-block rounded-full bg-[#2F4BFF] px-7 py-3.5 font-medium text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#17262B]">
              Ver peças da fornada
            </a>
          </div>
          <div className="relative aspect-square rounded-[2rem] bg-[#2F4BFF]">
            <div className="absolute inset-[12%] rounded-full bg-[#EDF0EE]" />
            <div className="absolute inset-[26%]"><Piece shape="vase" color="#17262B" /></div>
          </div>
        </section>

        <section id="produtos" className="mx-auto max-w-6xl px-6 pb-20">
          <h2 className="text-3xl font-semibold tracking-tight [font-family:var(--font-display)]">Fornada de outubro</h2>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => (
              <li key={p.id}>
                <div className="aspect-[4/5] rounded-2xl bg-white p-10"><Piece shape={p.shape} color={p.color} /></div>
                <div className="mt-3 flex items-baseline justify-between gap-2">
                  <h3 className="font-semibold">{p.name}</h3>
                  <span>{brl(p.price)}</span>
                </div>
                <p className="text-sm text-[#3D4F54]">{p.detail}</p>
                <button
                  onClick={() => setCart((c) => [...c, p.id])}
                  className="mt-3 w-full rounded-full border border-[#17262B] py-2 text-sm hover:bg-[#17262B] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4BFF]"
                >
                  Adicionar à sacola
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section id="entrega" className="bg-[#17262B] text-[#EDF0EE]">
          <div className="mx-auto grid max-w-6xl gap-8 px-6 py-14 md:grid-cols-3">
            <p><strong className="block text-lg">Frete grátis</strong>Em compras acima de R$ 250 para todo o Brasil.</p>
            <p><strong className="block text-lg">Embalagem reforçada</strong>Cada peça vai envolta em papel kraft e fibra de coco.</p>
            <p><strong className="block text-lg">Troca em 7 dias</strong>Chegou com defeito? Trocamos sem custo.</p>
          </div>
        </section>
      </main>

      <footer id="ateliê" className="mx-auto max-w-6xl px-6 py-10 text-sm text-[#3D4F54]">
        © 2026 Esmalte · Ateliê em São Paulo, SP
      </footer>
    </div>
  );
}