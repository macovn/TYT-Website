'use client';

import { useEditor, EditorContent, Node } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import Link from '@tiptap/extension-link';
import { 
  Bold, 
  Italic, 
  Heading1, 
  Heading2, 
  List, 
  ListOrdered, 
  Image as ImageIcon, 
  Youtube as YoutubeIcon, 
  Link as LinkIcon,
  Undo,
  Redo,
  Code,
  FileText
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useState, forwardRef, useImperativeHandle } from 'react';

interface EditorProps {
  content: string;
  onChange: (html: string) => void;
}

export interface EditorRef {
  insertYoutubeVideo: (url: string) => void;
}

const PdfBlock = Node.create({
  name: 'pdfBlock',
  group: 'block',
  selectable: true,
  draggable: true,
  atom: true,
  addAttributes() {
    return {
      src: { default: null },
      filename: { default: 'Tài liệu PDF' },
    }
  },
  parseHTML() {
    return [
      {
        tag: 'div[data-pdf-block]',
        getAttrs: element => ({
          src: element.getAttribute('data-src'),
          filename: element.getAttribute('data-filename'),
        }),
      },
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      { 
        'data-pdf-block': '',
        'data-src': HTMLAttributes.src,
        'data-filename': HTMLAttributes.filename,
        class: 'pdf-block-node my-8',
        style: 'width: 100%; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; background: #ffffff; box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);'
      },
      ['div', { 
        class: 'pdf-header',
        style: 'background: #f9fafb; padding: 12px 16px; border-bottom: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: space-between;'
      },
        ['div', { style: 'display: flex; align-items: center; gap: 8px;' },
          ['span', { style: 'font-size: 18px;' }, '📄'],
          ['span', { style: 'font-size: 14px; font-weight: 700; color: #374151;' }, HTMLAttributes.filename]
        ],
        ['div', { style: 'display: flex; gap: 12px; align-items: center;' },
          ['a', { href: HTMLAttributes.src, target: '_blank', style: 'font-size: 12px; font-weight: 700; color: #2563eb; text-decoration: none;' }, 'Xem file'],
          ['a', { href: HTMLAttributes.src, download: HTMLAttributes.filename, style: 'font-size: 12px; font-weight: 700; color: #059669; text-decoration: none;' }, 'Tải về']
        ]
      ],
      ['iframe', { 
        src: `${HTMLAttributes.src}#view=FitH&toolbar=0&navpanes=0`,
        width: '100%',
        height: '600',
        style: 'border: none; width: 100%; height: 600px; display: block;',
        referrerpolicy: 'no-referrer',
        title: HTMLAttributes.filename,
        allow: 'fullscreen'
      }]
    ]
  },
});

const MenuBar = ({ editor }: { editor: any }) => {
  const [isUploading, setIsUploading] = useState(false);

  if (!editor) {
    return null;
  }

  const addYoutubeVideo = () => {
    const url = prompt('Nhập URL video YouTube:');
    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: 640,
        height: 480,
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      console.log("SUPABASE URL (Editor Upload):", process.env.NEXT_PUBLIC_SUPABASE_URL);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `post-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      if (data?.publicUrl) {
        editor.chain().focus().setImage({ src: data.publicUrl }).run();
      }
    } catch (error: any) {
      alert('Lỗi upload ảnh: ' + error.message + '\nLưu ý: Bạn cần tạo bucket "media" trong Supabase Storage và bật quyền Public.');
    } finally {
      setIsUploading(false);
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Vui lòng chọn file định dạng PDF.');
      return;
    }

    setIsUploading(true);
    try {
      const fileName = `${Math.random()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const filePath = `documents/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      if (data?.publicUrl) {
        editor.chain().focus().insertContent({
          type: 'pdfBlock',
          attrs: {
            src: data.publicUrl,
            filename: file.name
          }
        }).run();
      }
    } catch (error: any) {
      alert('Lỗi upload PDF: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="border-b border-gray-200 p-2 flex flex-wrap gap-1 bg-gray-50 sticky top-0 z-10">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-200 text-[var(--primary)]' : 'text-gray-600'}`}
        title="Đậm"
      >
        <Bold size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-200 text-[var(--primary)]' : 'text-gray-600'}`}
        title="Nghiêng"
      >
        <Italic size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 text-[var(--primary)]' : 'text-gray-600'}`}
        title="Tiêu đề 1"
      >
        <Heading1 size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 text-[var(--primary)]' : 'text-gray-600'}`}
        title="Tiêu đề 2"
      >
        <Heading2 size={18} />
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-200 text-[var(--primary)]' : 'text-gray-600'}`}
        title="Danh sách dấu chấm"
      >
        <List size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-200 text-[var(--primary)]' : 'text-gray-600'}`}
        title="Danh sách số"
      >
        <ListOrdered size={18} />
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
      <label className="p-2 rounded hover:bg-gray-200 text-gray-600 cursor-pointer relative" title="Chèn ảnh">
        <ImageIcon size={18} />
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageUpload} 
          className="absolute inset-0 opacity-0 cursor-pointer"
          disabled={isUploading}
        />
        {isUploading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
            <div className="w-3 h-3 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </label>
      <label className="p-2 rounded hover:bg-gray-200 text-gray-600 cursor-pointer relative" title="Chèn PDF">
        <FileText size={18} />
        <input 
          type="file" 
          accept=".pdf" 
          onChange={handlePdfUpload} 
          className="absolute inset-0 opacity-0 cursor-pointer"
          disabled={isUploading}
        />
        {isUploading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
            <div className="w-3 h-3 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </label>
      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
      <button
        type="button"
        onClick={addYoutubeVideo}
        className="p-2 rounded hover:bg-gray-200 text-gray-600"
        title="Chèn Video YouTube"
      >
        <YoutubeIcon size={18} />
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        className="p-2 rounded hover:bg-gray-200 text-gray-600"
        title="Hoàn tác"
      >
        <Undo size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        className="p-2 rounded hover:bg-gray-200 text-gray-600"
        title="Làm lại"
      >
        <Redo size={18} />
      </button>
    </div>
  );
};

const Editor = forwardRef<EditorRef, EditorProps>(({ content, onChange }, ref) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      PdfBlock,
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-xl max-w-full h-auto my-4',
        },
      }),
      Youtube.configure({
        HTMLAttributes: {
          class: 'rounded-xl aspect-video w-full my-4',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[var(--primary)] underline',
        },
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[300px] p-4 max-w-none',
      },
    },
  });

  useImperativeHandle(ref, () => ({
    insertYoutubeVideo: (url: string) => {
      if (editor) {
        editor.commands.setYoutubeVideo({
          src: url,
          width: 640,
          height: 480,
        });
      }
    }
  }));

  // Update content if it changes from outside (e.g. form reset)
  if (editor && editor.getHTML() !== content && content === '') {
    editor.commands.setContent('');
  }

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white focus-within:border-[var(--primary)] transition-all flex flex-col">
      <MenuBar editor={editor} />
      <div className="overflow-y-auto max-h-[500px] min-h-[300px] bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
});

Editor.displayName = 'Editor';

export default Editor;
