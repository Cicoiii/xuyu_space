import { uploadFile } from '@capital/common';
import type React from 'react';

export function openImageFile(): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      resolve(input.files?.[0] ?? null);
    };
    input.click();
  });
}

export async function uploadTopicImage(file: File): Promise<string> {
  const fileInfo = await uploadFile(file, {
    usage: 'chat',
  });

  return fileInfo.url;
}

export function getClipboardImageFile(
  event: React.ClipboardEvent
): File | null {
  const items = Array.from(event.clipboardData?.items ?? []);
  const imageItem = items.find((item) => item.type.startsWith('image/'));

  return imageItem?.getAsFile() ?? null;
}

export function extractContentImages(content = ''): {
  text: string;
  images: string[];
} {
  const images: string[] = [];
  const text = content
    .replace(/\[img(?:\s+[^\]]*)?\]([\s\S]*?)\[\/img\]/gi, (_, url) => {
      const imageUrl = String(url).trim();
      if (imageUrl) {
        images.push(imageUrl);
      }

      return '';
    })
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return {
    text,
    images,
  };
}
