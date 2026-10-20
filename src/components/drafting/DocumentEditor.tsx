import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  Bold,
  Italic,
  List,
  ListOrdered,
  UnderlineIcon,
} from "lucide-react";
import { useEffect } from "react";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const tools = [
  {
    name: "Tebal",
    icon: Bold,
    active: "bold",
    run: (e: ReturnType<typeof useEditor>) => e?.chain().focus().toggleBold().run(),
  },
  {
    name: "Miring",
    icon: Italic,
    active: "italic",
    run: (e: ReturnType<typeof useEditor>) => e?.chain().focus().toggleItalic().run(),
  },
  {
    name: "Garis bawah",
    icon: UnderlineIcon,
    active: "underline",
    run: (e: ReturnType<typeof useEditor>) => e?.chain().focus().toggleUnderline().run(),
  },
  {
    name: "Rata kiri",
    icon: AlignLeft,
    active: "left",
    run: (e: ReturnType<typeof useEditor>) => e?.chain().focus().setTextAlign("left").run(),
  },
  {
    name: "Rata tengah",
    icon: AlignCenter,
    active: "center",
    run: (e: ReturnType<typeof useEditor>) => e?.chain().focus().setTextAlign("center").run(),
  },
  {
    name: "Rata penuh",
    icon: AlignJustify,
    active: "justify",
    run: (e: ReturnType<typeof useEditor>) => e?.chain().focus().setTextAlign("justify").run(),
  },
  {
    name: "Daftar poin",
    icon: List,
    active: "bulletList",
    run: (e: ReturnType<typeof useEditor>) => e?.chain().focus().toggleBulletList().run(),
  },
  {
    name: "Daftar nomor",
    icon: ListOrdered,
    active: "orderedList",
    run: (e: ReturnType<typeof useEditor>) => e?.chain().focus().toggleOrderedList().run(),
  },
];

export function DocumentEditor({
  content,
  onChange,
}: {
  content: string;
  onChange: (html: string, text: string) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Underline, TextAlign.configure({ types: ["heading", "paragraph"] })],
    content: content
      .split("\n")
      .map((line) => `<p>${line || "<br>"}</p>`)
      .join(""),
    editorProps: { attributes: { class: "min-h-[640px] focus:outline-none" } },
    onUpdate: ({ editor: current }) =>
      onChange(current.getHTML(), current.getText({ blockSeparator: "\n" })),
  });
  useEffect(() => () => editor?.destroy(), [editor]);
  return (
    <TooltipProvider>
      <div className="overflow-hidden rounded-lg border bg-card">
        <div className="flex flex-wrap items-center gap-1 border-b bg-muted/40 p-2">
          {tools.map((tool) => (
            <Tooltip key={tool.name}>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  pressed={Boolean(editor?.isActive(tool.active))}
                  onPressedChange={() => {
                    if (editor) tool.run(editor);
                  }}
                  aria-label={tool.name}
                >
                  <tool.icon />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>{tool.name}</TooltipContent>
            </Tooltip>
          ))}
        </div>
        <div className="max-h-[700px] overflow-auto bg-muted/30 p-3 sm:p-6">
          <div
            className="mx-auto min-h-[740px] max-w-[794px] bg-card px-8 py-10 text-[12pt] leading-[1.5] shadow-sm sm:pl-[3cm] sm:pr-[2cm]"
            style={{ fontFamily: '"Times New Roman", serif' }}
          >
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
