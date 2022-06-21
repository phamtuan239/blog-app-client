import Embed from "@editorjs/embed";
import Table from "editorjs-table";
import ParagraphAlignment from "editorjs-paragraph-with-alignment";
import List from "@editorjs/list";
import Warning from "@editorjs/warning";
import Code from "@editorjs/code";
import LinkTool from "@editorjs/link";
import Raw from "@editorjs/raw";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import CheckList from "@editorjs/checklist";
import Delimiter from "@editorjs/delimiter";
import InlineCode from "@editorjs/inline-code";
import SimpleImage from "@editorjs/simple-image";
import ImageGallery from "@rodrigoodhin/editorjs-image-gallery";
import Hyperlink from "editorjs-hyperlink";
import Paragraph from "@editorjs/paragraph";
import Style from "editorjs-style";
import Personality from "@editorjs/personality";
import AttachesTool from "@editorjs/attaches";
import LinkAutocomplete from "@editorjs/link-autocomplete";
import ChangeCase from "editorjs-change-case";
import Tooltip from "editorjs-tooltip";
import AlignmentTuneTool from "editorjs-text-alignment-blocktune";
import CodeBox from "@bomdi/codebox";
import ImageTool from "@editorjs/image";
import axios from "axios";
import { Alert } from "react-bootstrap";

const access_token = localStorage.getItem("access_token");

export const EDITOR_JS_TOOLS = {
  embed: Embed,
  header: Header,
  table: Table,
  list: List,
  warning: Warning,
  link: LinkTool,
  quote: Quote,
  marker: Marker,
  checklist: CheckList,
  delimiter: Delimiter,
  inlineCode: InlineCode,
  hyperlink: Hyperlink,
  changeCase: ChangeCase,
  simpleImage: SimpleImage,
  image: {
    class: ImageTool,
    config: {
      uploader: {
        async uploadByFile(file) {
          if (file.size > 2000000) {
            Alert("File size is bigger than 2MB");
            return;
          }
          const dataForm = new FormData();
          dataForm.append("upload", file);
          const { data } = await axios.post(
            `${process.env.REACT_APP_HTTP_API_LINK_URL}/api/upload-file`,
            dataForm,
            {
              headers: {
                authorization: access_token,
              },
            }
          );
          return {
            success: 1,
            file: {
              url: data,
            },
          };
        },
        async uploadByUrl(url) {
          const { data } = await axios.post(
            `${process.env.REACT_APP_HTTP_API_LINK_URL}/api/fetch-url`,
            {
              url,
            }
          );
          return {
            success: 1,
            file: {
              url: data,
            },
          };
        },
      },
    },
  },
  imageGallery: ImageGallery,
  codeBox: CodeBox,
  raw: Raw,
  code: Code,
};
