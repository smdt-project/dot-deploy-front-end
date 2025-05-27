import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import { FaCss3, FaJava, FaJs, FaPython, FaReact } from "react-icons/fa";
import {
	SiGo,
	SiHtml5,
	SiKotlin,
	SiPhp,
	SiRuby,
	SiRust,
	SiSwift,
	SiTypescript,
} from "react-icons/si";
import { TbBrandCSharp } from "react-icons/tb"

export const supportedLng = [
  {
    title: "index",
    icon: <SiHtml5 className=" text-red-500" size={12} />,
    extension: "html",
    lngName: "html",
    mode: html(),
    id: -4
  },
  {
    title: "script",
    icon: <FaJs className=" text-yellow-500" size={12} />,
    extension: "js",
    lngName: "js",
    mode: javascript(),
    id: 102
  },
  {
    title: "style",
    icon: <FaCss3 className=" text-cyan-400" size={12} />,
    extension: "css",
    lngName: "css",
    mode: css(),
	id: -4,
  },
  {
    title: "component",
    icon: <FaReact className=" text-cyan-500" size={12} />,
    extension: "jsx",
    lngName: "react",
    mode: javascript({ jsx: true }),
	id: -4,
  },
  {
    title: "main",
    icon: <FaJava className=" text-red-700" size={15} />,
    extension: "java",
    lngName: "java",
    mode: javascript(),
	id: 91
  },
  {
    title: "app",
    icon: <FaPython className=" text-blue-500" size={14} />,
    extension: "py",
    lngName: "python",
    mode: javascript(),
	id: 71
  },
  {
    title: "main",
    icon: <SiGo className=" text-blue-600" size={16} />,
    extension: "go",
    lngName: "go",
    mode: javascript(),
	id: 107,
  },
  {
    title: "index",
    icon: <TbBrandCSharp className=" text-purple-600" size={14} />,
    extension: "cs",
    lngName: "csharp",
    mode: javascript(),
	id: 51,
  },
  {
    title: "index",
    icon: <SiPhp className=" text-indigo-600" size={16} />,
    extension: "php",
    lngName: "php",
    mode: javascript(),
	id: 98
  },
  {
    title: "app",
    icon: <SiSwift className=" text-orange-500" size={12} />,
    extension: "swift",
    lngName: "swift",
    mode: javascript(),
	id: 83
  },
  {
    title: "app",
    icon: <SiKotlin className=" text-purple-400" size={12} />,
    extension: "kt",
    lngName: "kotlin",
    mode: javascript(),
	id: 111,
  },
  {
    title: "index",
    icon: <SiRuby className=" text-red-600" size={13} />,
    extension: "rb",
    lngName: "ruby",
    mode: javascript(),
	id: 72
  },
  {
    title: "index",
    icon: <SiRust className=" text-orange-700" size={15} />,
    extension: "rs",
    lngName: "rust",
    mode: javascript(),
	id: 108
  },
  {
    title: "index",
    icon: <SiTypescript className=" text-blue-500" size={12} />,
    extension: "ts",
    lngName: "typescript",
    mode: javascript(),
	id: 101
  },
  {
    title: "other",
    icon: (
      <img
        src="/dot.svg"
        className=" border-[1px] border-color-5 bg-color-5 rounded-full min-w-3  w-3 min-h-3 h-3"
      />
    ),
    extension: "dot",
    lngName: "other",
    mode: javascript(),
	id: -4,
  }
];
