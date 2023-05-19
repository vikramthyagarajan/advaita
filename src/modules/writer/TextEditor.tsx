import React, { memo, useEffect, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

export type TextEditorProps = {
  body: string;
  setBody: (body: string) => void;
};

const TextEditor = ({ body, setBody }: TextEditorProps) => {
  const useDarkMode = false;
  const editorRef = useRef<any>();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (editorRef.current) {
        const body = editorRef.current.getContent();
        setBody(body);
      }
    }, 10000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };
  return (
    <>
      <Editor
        apiKey="dtz5hb0uvcrxyjn1ktyk4l2oo87e156l7ipguyrin7nymrkr"
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue={body}
        init={{
          height: "100%",
          // menubar: false,
          plugins: [
            "preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen",
            "image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist",
            "lists wordcount help charmap quickbars emoticons",
          ],
          editimage_cors_hosts: ["picsum.photos"],
          menubar: "file edit view insert format tools table help",
          toolbar:
            "undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl",
          link_list: [
            { title: "My page 1", value: "https://www.tiny.cloud" },
            { title: "My page 2", value: "http://www.moxiecode.com" },
          ],
          image_list: [
            { title: "My page 1", value: "https://www.tiny.cloud" },
            { title: "My page 2", value: "http://www.moxiecode.com" },
          ],
          image_class_list: [
            { title: "None", value: "" },
            { title: "Some class", value: "class-name" },
          ],
          templates: [
            {
              title: "New Table",
              description: "creates a new table",
              content:
                '<div class="mceTmpl"><table width="98%%"  border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th><th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>',
            },
            {
              title: "Starting my story",
              description: "A cure for writers block",
              content: "Once upon a time...",
            },
            {
              title: "New list with dates",
              description: "New List with dates",
              content:
                '<div class="mceTmpl"><span class="cdate">cdate</span><br><span class="mdate">mdate</span><h2>My List</h2><ul><li></li><li></li></ul></div>',
            },
          ],
          template_cdate_format: "[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]",
          template_mdate_format: "[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]",
          image_caption: true,
          quickbars_selection_toolbar:
            "bold italic | quicklink h2 h3 blockquote quickimage quicktable",
          noneditable_class: "mceNonEditable",
          toolbar_mode: "sliding",
          contextmenu: "link image table",
          skin: useDarkMode ? "oxide-dark" : "oxide",
          content_css: useDarkMode ? "dark" : "default",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:16px }",
        }}
      />
    </>
  );
};

export default memo(TextEditor);
