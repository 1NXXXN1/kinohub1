'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type FilmData = {
  nameRu?: string;
  nameOriginal?: string;
  year?: number;
  description?: string;
};

export default async function Watch({ params }: any) {
  const id = params.id;

  return (
    <div className="p-4">
      <h1 className="text-lg font-semibold mb-3">
        Фильм ({id})
      </h1>

      <iframe
        src={`https://api.linktodo.ws/embed/kp/${id}?host=kinobd.net`}
        width="100%"
        height="500"
        allowFullScreen
      />
    </div>
  );
}

