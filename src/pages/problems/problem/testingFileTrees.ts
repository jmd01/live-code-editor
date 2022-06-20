export const tree = [
  {
    id: "1",
    path: "util/encode.ts",
    contents:
      "export function encode(data: string): Uint8Array {\n\n return new Uint8Array(1)\n}",
  },
  {
    id: "2",
    path: "lib/foo.ts",
    contents:
      "import { encode } from '../util/encode.ts'\n\nexport function foo() {\n\n  return encode('foo')\n}",
  },
  {
    id: "3",
    path: "lib/bar.ts",
    contents:
      "import { encode } from '../util/encode.ts'\n\nexport function bar() {\n\n  return encode('bar')\n}",
  },
  {
    id: "4",
    path: "lib/index.ts",
    contents: "export * from './foo.ts'\n\nexport * from './bar.ts'",
  },
  {
    id: "5",
    path: "index.tsx",
    contents:
      "import React from 'react';\nimport ReactDOM from 'react-dom'\nimport App from \"./App.tsx\"\n\nimport { foo, bar } from './lib/index.ts'\n\n//console.log(foo());\n//console.log(bar());\n\nReactDOM.render(<App />, document.querySelector('#root')); \n",
  },
  {
    id: "6",
    path: "App.tsx",
    contents:
      "import React from 'react';\n\nconst App = () => {\n  return (\n    <div style={{ fontFamily: 'sans-serif', textAlign: 'center' }}>\n      <h1>Hello jsx book!</h1>\n      <h2>Start editing to create something magic!</h2>\n      <p>By the way, you can import (almost) ANY npm package using our magic bundler</p>\n    </div>\n  );\n};\nexport default App      \n",
  },
  {
    id: "7",
    path: "lib/declaration.d.ts",
    contents: "declare type Fooz = string | number[];\n\n",
  },
];
export const simpleTsTreeNoExtension = [
  {
    id: "1",
    path: "util/encode.ts",
    contents:
      "export function encode(data: string): Uint8Array {\n\n return new Uint8Array(1)\n}",
  },
  {
    id: "2",
    path: "lib/foo.ts",
    contents:
      "import { encode } from '../util/encode'\n\nexport function foo() {\n\n  return encode('foo')\n}",
  },
  {
    id: "3",
    path: "lib/bar.ts",
    contents:
      "import { encode } from '../util/encode'\n\nexport function bar() {\n\n  return encode('bar')\n}",
  },
  {
    id: "4",
    path: "lib/index.ts",
    contents: "export * from './foo'\n\nexport * from './bar'",
  },
  {
    id: "5",
    path: "index.ts",
    contents:
      "import { foo, bar } from './lib/index'\n\nimport * as React from 'react'\n\nconsole.log(foo());\n\nconsole.log(bar());\n\nconst fooz: Fooz",
  },
  {
    id: "6",
    path: "lib/declaration.d.ts",
    contents: "declare type Fooz = string | number[];\n\n",
  },
];

export const simpleTsTree = [
  {
    id: "1",
    path: "util/encode.ts",
    contents:
      "export function encode(data: string): Uint8Array {\n\n return new Uint8Array(1)\n}",
  },
  {
    id: "2",
    path: "lib/foo.ts",
    contents:
      "import { encode } from '../util/encode.ts'\n\nexport function foo() {\n\n  return encode('foo')\n}",
  },
  {
    id: "3",
    path: "lib/bar.ts",
    contents:
      "import { encode } from '../util/encode.ts'\n\nexport function bar() {\n\n  return encode('bar')\n}",
  },
  {
    id: "4",
    path: "lib/index.ts",
    contents: "export * from './foo.ts'\n\nexport * from './bar.ts'",
  },
  {
    id: "5",
    path: "index.ts",
    contents:
      "import { foo, bar } from './lib/index'\n\nconsole.log(foo());\n\nconsole.log(bar());",
  },
];

export const tree1 = [
  {
    id: "1",
    path: "util/encode.css",
    contents: `

        export function encode(data: string): Uint8Array {

            return new Uint8Array(1)
        }
    `,
  },
  {
    id: "2",
    path: "lib/foo.js",
    contents: `

      import { encode } from '../util/encode.ts'

      export function foo() {

         return encode('foo')
      }
  `,
  },
  {
    id: "3",
    path: "lib/bar.html",
    contents: `

      import { encode } from '../util/encode.ts'

      export function bar() {

         return encode('bar')
      }
  `,
  },
  {
    id: "4",
    path: "lib/.index",
    contents: `

      export * from './foo.ts'

      export * from './bar.ts'
  `,
  },
  {
    id: "5",
    path: "fooz/barz/index.ts",
    contents: `

      export * from './foo.ts'

      export * from './bar.ts'
  `,
  },
  {
    id: "6",
    path: "fooz/foooooz.ts",
    contents: `

      export * from './foo.ts'

      export * from './bar.ts'
  `,
  },
  {
    id: "7",
    path: "index.ts",
    contents: `
      //import * as React from "react"
      import { foo, bar } from './lib/index.ts'

      console.log(foo());

      console.log(bar());
  `,
  },
  {
    id: "8",
    path: "foo/bar",
    isEmptyDir: true,
    contents: ``,
  },
  {
    id: "9",
    path: "x/x.ts",
    contents: ``,
  },
  {
    id: "10",
    path: "x/y/y.ts",
    contents: ``,
  },
  {
    id: "11",
    path: "x/y/z/z.ts",
    contents: ``,
  },
  {
    id: "12",
    path: "xx/x/x.ts",
    contents: ``,
  },
  {
    id: "13",
    path: "xx/x/y/y.ts",
    contents: ``,
  },
  {
    id: "14",
    path: "xx/x/y/z/z.ts",
    contents: ``,
  },
];

export const tree2 = [
  {
    id: "1",
    path: "util/encode.ts",
    contents:
      "\n\n        export function encode(data: string): Uint8Array {\n            \n            return new Uint8Array(1)\n        } \n    ",
  },
  {
    id: "2",
    path: "lib/foo.ts",
    contents:
      "\n\n      import { encode } from '../util/encode.ts'\n\n      export function foo() {\n\n         return encode('foo')\n      }\n  ",
  },
  {
    id: "3",
    path: "lib/bar.ts",
    contents:
      "\n\n      import { encode } from '../util/encode.ts'\n\n      export function bar() {\n\n         return encode('bar')\n      }\n  ",
  },
  {
    id: "4",
    path: "lib/index.ts",
    contents:
      "\n\n      export * from './foo.ts'\n\n      export * from './bar.ts'\n  ",
  },
  {
    id: "5",
    path: "fooz/barz/index.ts",
    contents:
      "\n\n      export * from './foo.ts'\n\n      export * from './bar.ts'\n  ",
  },
  {
    id: "6",
    path: "fooz/foooooz.ts",
    contents:
      "\n\n      export * from './foo.ts'\n\n      export * from './bar.ts'\n  ",
  },
  {
    id: "7",
    path: "index.ts",
    contents:
      "\n      //import * as React from \"react\"\n      import { foo, bar } from './lib/index.ts'\n\n      console.log(foo());\n\n      console.log(bar());\n  ",
  },
  {
    id: "8",
    path: "foo/bar",
    isEmptyDir: true,
    contents: "",
  },
  // {
  //   id: "9",
  //   path: "x/x.ts",
  //   contents: "",
  // },
  // {
  //   id: "10",
  //   path: "x/y/y.ts",
  //   contents: "",
  // },
  // {
  //   id: "11",
  //   path: "x/y/z/z.ts",
  //   contents: "",
  // },
  {
    id: "12",
    path: "x/y/x/x.ts",
    contents: "",
  },
  // {
  //   id: "13",
  //   path: "x/y/x/y/y.ts",
  //   contents: "",
  // },
  // {
  //   id: "14",
  //   path: "x/y/x/y/z/z.ts",
  //   contents: "",
  // },
];
