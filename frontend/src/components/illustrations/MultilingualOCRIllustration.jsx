import React from 'react';

export default function MultilingualOCRIllustration() {
  const languages = [
    {
      code: 'EN',
      lang: 'ENGLISH',
      handwritten: 'Binary Tree: Height balance factor BF = H(left) - H(right)',
      digital: 'Balance Factor: $BF = h(L) - h(R) \\in \\{-1, 0, 1\\}$',
      status: 'VERIFIED 99.1%',
    },
    {
      code: 'HI',
      lang: 'HINDI (हिन्दी)',
      handwritten: 'ऑपरेटिंग सिस्टम में डेडलॉक की चार प्रमुख स्थितियां होती हैं...',
      digital: 'कॉफमैन शर्तें: 1. पारस्परिक अपवर्जन 2. रोकें और प्रतीक्षा करें',
      status: 'VERIFIED 97.8%',
    },
    {
      code: 'AS',
      lang: 'ASSAMESE (অসমীয়া)',
      handwritten: 'ডাটা ষ্ট্ৰাকচাৰৰ বাইনাৰী চাৰ্চ ট্ৰীৰ ইন-অৰ্ডাৰ ভ্ৰমণে সদায় ক্ৰমবদ্ধ ক্ৰম দিয়ে...',
      digital: 'ইন-অৰ্ডাৰ ট্ৰাভাৰ্চেল: ascending sorted sequence নিশ্চিত কৰে।',
      status: 'VERIFIED 97.4%',
    },
  ];

  return (
    <div className="border border-black bg-white p-6 font-mono text-xs select-none">
      <div className="flex items-center justify-between border-b border-black pb-3 mb-6 text-[10px] text-zinc-500 uppercase tracking-widest">
        <span>FIG 02.0 // MULTILINGUAL OCR RECOGNITION MATRIX</span>
        <span className="text-black font-bold">SCRIPTS: DEVANAGARI / BENGALI-ASSAMESE / LATIN</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-black border border-black bg-zinc-50">
        {languages.map((l) => (
          <div key={l.code} className="p-5 space-y-4 hover:bg-white transition-colors">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
              <span className="text-xs font-black uppercase text-black">{l.lang}</span>
              <span className="text-[9px] px-1.5 py-0.5 bg-black text-white font-bold">{l.code}</span>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] text-zinc-400 uppercase tracking-wider block font-bold">
                [ RAW INPUT SAMPLE ]
              </span>
              <p className="text-xs font-sans text-zinc-700 italic border-l-2 border-zinc-300 pl-2">
                "{l.handwritten}"
              </p>
            </div>

            <div className="space-y-1 pt-1">
              <span className="text-[9px] text-swiss-red uppercase tracking-wider block font-bold">
                [ TRANSCRIBED SPEC ]
              </span>
              <p className="text-xs font-sans text-black font-bold border-l-2 border-black pl-2">
                {l.digital}
              </p>
            </div>

            <div className="pt-2 border-t border-zinc-200 flex items-center justify-between text-[10px]">
              <span className="text-zinc-500 uppercase">CONFIDENCE:</span>
              <span className="font-bold text-emerald-600">{l.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
