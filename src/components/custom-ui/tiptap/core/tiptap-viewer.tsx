'use client';

import styles from './tiptap-editor.module.css';
import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import FontFamily from '@tiptap/extension-font-family';
import { TextStyleKit } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { CustomImage, YouTubeVideo } from '../extended';
import Link from '@tiptap/extension-link';
import { cn } from '@/lib/utils';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import { useContentStoreSelector } from '../plugin';

type Props = {
  className?: string;
  keyId: string;
  content?: string;
};

export const TiptapViewer = ({ className, keyId, content: propsContent }: Props) => {
  const { content } = useContentStoreSelector(keyId);
  const finalContent = propsContent ?? content;
  const editor = useEditor({
    extensions: [
      Color,
      Highlight.configure({ multicolor: true }),
      StarterKit,
      Underline,
      FontFamily,
      TextStyleKit,
      CustomImage,
      YouTubeVideo,
      TextAlign.configure({
        types: ['paragraph', 'heading'],
        alignments: ['left', 'right', 'center'],
      }),
      Link.configure({
        openOnClick: true,
        autolink: true,
        HTMLAttributes: {
          class: 'font-bold hover:text-orange-600 hover:underline',
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: finalContent,
    editable: false,
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== finalContent) {
      editor.commands.setContent(finalContent);
    }
  }, [finalContent, editor]);

  if (!editor) return null;

  return (
    <EditorContent
      editor={editor}
      className={cn('min-h-[400px] p-6', '[&_.resize-cursor]:cursor-col-resize', styles.tiptapGlobalStyles, className)}
    />
  );
};

export default TiptapViewer;
