import React from 'react';
import { BookOpen, Sparkles, Play, Quote, Compass } from 'lucide-react';
import { INITIAL_GHIBLI_SCENES, MIYAZAKI_MA_QUOTES, SceneTheme } from '../types';
import { ArtisticSceneCanvas } from './ArtisticSceneCanvas';

interface GhibliMaPhilosophyProps {
  onEnterSceneExperience: (theme: SceneTheme) => void;
}

export const GhibliMaPhilosophy: React.FC<GhibliMaPhilosophyProps> = ({
  onEnterSceneExperience,
}) => {
  return (
    <div className="space-y-12 animate-fadeIn max-w-5xl mx-auto">
      {/* Lead Essay Header */}
      <section className="text-center max-w-3xl mx-auto pt-4">
        <div className="flex items-center justify-center gap-2 text-xs font-serif text-stone-500 mb-3">
          <span>美學論述</span>
          <span aria-hidden="true">·</span>
          <span>ESTHÉTIQUE DU VIDE</span>
          <span aria-hidden="true">·</span>
          <span>宮崎駿與吉卜力</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-serif text-stone-900 font-medium tracking-tight mb-4 text-balance">
          什麼是宮崎駿電影中的「間」？
        </h2>
        <p className="text-base md:text-lg text-stone-600 font-serif leading-relaxed">
          「拍手與拍手之間的空隙，就是『間』。」
          它不是故事停頓的空白，而是刻意安排的呼吸；正是在那些沒有台詞與動作的靜謐裡，世界展現了最深層的真實。
        </p>
      </section>

      {/* Roger Ebert Interview Highlight Block */}
      <section className="bg-[#F7F4EE] border border-stone-200/90 rounded-2xl p-6 md:p-10 shadow-xs relative">
        <Quote className="w-10 h-10 text-stone-300 absolute top-6 right-6 pointer-events-none" />
        <div className="max-w-3xl">
          <div className="text-xs font-serif uppercase tracking-widest text-stone-500 mb-3">
            2002 年 · 芝加哥 · 電影評論家 Roger Ebert 專訪宮崎駿
          </div>

          <div className="space-y-4 font-serif text-stone-800 leading-relaxed text-sm md:text-base">
            <p className="italic text-stone-600">
              <strong>羅傑·艾伯特問：</strong>「在好萊塢動畫中，畫面永遠塞滿了密集的動作與插科打諢；但您的電影裡卻總有悠長的靜止時刻——比如一個人久久看著水面、草葉被風吹動、或是熱茶冒著白煙。您為什麼要保留這些情節？」
            </p>

            <p>
              <strong>宮崎駿拍了一下手，停頓了三秒，然後又拍了一下手，說道：</strong>
            </p>

            <blockquote className="pl-4 border-l-2 border-stone-400 text-stone-900 font-medium text-base md:text-lg italic bg-white/50 p-4 rounded-r-lg my-3">
              「剛才那兩次拍手之間的空隙，在日語中我們稱之為『間』（Ma）。它是刻意被安放在那裡的。
              如果一部作品只有不間斷的動作而沒有呼吸的餘地，那就只是單純的喧囂。
              西方創作者往往恐懼沉默，急於用聲音將空白填滿；
              但如果你給予觀眾一瞬間的停頓，原本累積在心中的張力，就能延展進入更深廣的維度。
              如果一個人隨時都處在80度的緊繃狀態，神經遲早會麻木。」
            </blockquote>

            <p className="text-stone-600 text-xs md:text-sm">
              宮崎駿認為，現代生活的痛苦正是因為缺乏「間」。工作、手機訊息、快節奏的短影音掠奪了所有微小的空隙。
              重拾「間」的意識，就是主動在喧擾之中，為自己的感知劃出一片安靜的水域。
            </p>
          </div>
        </div>
      </section>

      {/* The 5 Iconic Ghibli Ma Moments */}
      <section className="space-y-6">
        <div className="border-b border-stone-200 pb-3">
          <div className="flex items-center gap-2 text-xs font-serif text-stone-500">
            <span>經典解析</span>
            <span aria-hidden="true">·</span>
            <span>CINEMATIC ARCHIVES</span>
          </div>
          <h3 className="text-2xl font-serif font-medium text-stone-900 mt-1">
            吉卜力五大「間時刻」巡禮
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {INITIAL_GHIBLI_SCENES.map((scene, idx) => (
            <div
              key={scene.id}
              className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between"
            >
              {/* Scene Visual Preview */}
              <div className="h-48 relative border-b border-stone-100 overflow-hidden">
                <ArtisticSceneCanvas theme={scene.theme} />
                <div className="absolute bottom-3 right-3">
                  <button
                    onClick={() => onEnterSceneExperience(scene.theme)}
                    className="px-3 py-1.5 bg-stone-900/80 hover:bg-stone-900 text-white text-xs font-medium rounded-lg backdrop-blur-xs transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    進入此間體驗
                  </button>
                </div>
              </div>

              {/* Scene Content & Analysis */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  {/* Clean unboxed metadata */}
                  <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
                    <span className="font-serif">《{scene.filmTitle}》</span>
                    <span aria-hidden="true">·</span>
                    <span>{scene.filmYear}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-stone-700">{scene.sceneName}</span>
                  </div>

                  <h4 className="text-xl font-serif font-semibold text-stone-900 mb-2">
                    {scene.sceneName}
                  </h4>

                  <p className="text-xs md:text-sm text-stone-600 font-serif leading-relaxed mb-4">
                    {scene.description}
                  </p>

                  <div className="bg-[#FAF7F0] p-4 rounded-lg border border-stone-200/70 text-xs text-stone-700 font-serif leading-relaxed mb-4">
                    <span className="font-semibold text-stone-900 block mb-1">
                      「間」的美學拆解：
                    </span>
                    {scene.maPhilosophy}
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 text-xs font-serif italic text-stone-500">
                  {scene.quoteSnippet}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contemplative Three Quotes */}
      <section className="bg-[#FBF9F5] border-t border-b border-stone-200 py-10 my-8">
        <h3 className="text-xl font-serif font-medium text-stone-900 text-center mb-8">
          宮崎駿談安靜與知覺
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MIYAZAKI_MA_QUOTES.map((item, i) => (
            <div
              key={i}
              className="p-5 bg-white border border-stone-200/80 rounded-xl shadow-xs flex flex-col justify-between"
            >
              <div className="text-sm font-serif text-stone-800 leading-relaxed mb-4">
                {item.quote}
              </div>
              <div>
                <div className="text-xs font-medium text-stone-700 font-serif mb-1">
                  {item.source}
                </div>
                <div className="text-xs text-stone-500 font-serif leading-normal">
                  {item.context}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Practical Guide: How to Practice 'Ma' in Modern Daily Life */}
      <section className="bg-white border border-stone-200 rounded-xl p-6 md:p-8">
        <h3 className="text-xl font-serif font-medium text-stone-900 mb-2">
          如何在現代忙碌中實踐「間」？
        </h3>
        <p className="text-xs md:text-sm text-stone-600 font-serif mb-6 leading-relaxed">
          你不需要去深山閉關，也不需要刻意打坐半小時。「間」就藏在日常的縫隙裡：
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-serif text-stone-700">
          <div className="p-4 rounded-lg bg-stone-50 border border-stone-200/70">
            <span className="font-semibold text-stone-900 block mb-1 text-sm">
              01. 泡茶與水沸之隙
            </span>
            熱水倒下後，不要抓起手機刷社群。站在水壺邊，看著水氣蒸發的兩分鐘，就是你的「間」。
          </div>

          <div className="p-4 rounded-lg bg-stone-50 border border-stone-200/70">
            <span className="font-semibold text-stone-900 block mb-1 text-sm">
              02. 交通工具上的凝視
            </span>
            在捷運或公車上，收起耳機，望著窗外倒退的街燈與樹木。不思考目的，只是任由景物掠過。
          </div>

          <div className="p-4 rounded-lg bg-stone-50 border border-stone-200/70">
            <span className="font-semibold text-stone-900 block mb-1 text-sm">
              03. 會議交替的六十秒
            </span>
            在點開下一個通話或信箱前，轉動椅子望向窗外，做三次深長的呼吸，讓大腦重設。
          </div>
        </div>
      </section>
    </div>
  );
};
