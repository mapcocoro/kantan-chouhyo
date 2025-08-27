"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import './styles.css';

// Minimal working structure
export default function DocumentMaker(){
  return (
    <div className="min-h-screen bg-slate-50">
      {/* ナビ（必要なら後で差し替え） */}
      <nav className="sticky top-0 z-30 bg-white/75 backdrop-blur border-b">
        <div className="mx-auto max-w-[1280px] px-4 lg:px-6 py-2 flex gap-3 text-sm">
          <span className="font-medium text-slate-700">かんたん帳票</span>
        </div>
      </nav>

      {/* 本体レイアウト（12カラム） */}
      <main className="mx-auto max-w-[1280px] px-4 lg:px-6 py-6 grid grid-cols-12 gap-6">
        {/* 入力フォーム領域：既存のフォーム JSX をこの中へ戻す */}
        <section className="col-span-12 lg:col-span-7 xl:col-span-8 space-y-5">
          {/* --- ここに既存のフォーム JSX をそのまま貼り戻してください --- */}
          <div className="rounded-xl border bg-white shadow-sm p-4">
            <p className="text-slate-600">フォーム部分 - 後で戻します</p>
          </div>
        </section>

        {/* プレビュー領域：既存のプレビュー JSX をこの中へ戻す */}
        <aside className="col-span-12 lg:col-span-5 xl:col-span-4 lg:sticky lg:top-20 min-w-[520px] max-w-[640px]">
          {/* --- ここに既存のプレビュー JSX をそのまま貼り戻してください --- */}
          <div className="rounded-xl border bg-white shadow-sm p-4">
            <p className="text-slate-600">プレビュー部分 - 後で戻します</p>
          </div>
        </aside>
      </main>
    </div>
  );
}