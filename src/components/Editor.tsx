'use client';

import { useEditor, EditorContent } from '@tiptap/react';
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
  Code
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';

interface EditorProps {
  content: string;
  onChange: (html: string) => void;
}

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
        .from('images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      if (data?.publicUrl) {
        editor.chain().focus().setImage({ src: data.publicUrl }).run();
      }
    } catch (error: any) {
      alert('Lỗi upload ảnh: ' + error.message + '\nLưu ý: Bạn cần tạo bucket "images" trong Supabase Storage và bật quyền Public.');
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

export default function RichTextEditor({ content, onChange }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
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
}
