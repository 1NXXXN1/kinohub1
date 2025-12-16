
'use client';
import Image from 'next/image';
import { useState } from 'react';

export default function Poster({ src, alt, width=300, height=450, className='' }) {
  const [err,setErr]=useState(false);
  if(!src||err){
    return <div style={{width,height}} className={`flex items-center justify-center bg-gray-800 text-gray-300 text-sm ${className}`}>нет постера</div>
  }
  return <Image src={src} alt={alt} width={width} height={height} className={className} onError={()=>setErr(true)} />
}
