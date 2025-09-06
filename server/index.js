import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, UNSAFE_withComponentProps, Outlet, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, Meta, Links, ScrollRestoration, Scripts } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    let timeoutId = setTimeout(
      () => abort(),
      streamTimeout + 1e3
    );
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough({
            final(callback) {
              clearTimeout(timeoutId);
              timeoutId = void 0;
              callback();
            }
          });
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          pipe(body);
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
}];
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = UNSAFE_withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
function getStatus(letter, index, word) {
  if (!letter) return "empty";
  if (word[index] === letter) return "correct";
  if (word.includes(letter)) return "present";
  return "absent";
}
function getClass(status) {
  if (status === "correct") return "bg-green-500 text-white border-none";
  if (status === "present") return "bg-yellow-400 text-white border-none";
  if (status === "absent") return "bg-gray-400 text-white border-none";
  return "bg-gray-200 border";
}
const Tile = ({ letter, index, isFinal, word }) => {
  const status = isFinal ? getStatus(letter, index, word) : "empty";
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: false,
      animate: {
        rotateX: isFinal ? [0, 90, 0] : 0
      },
      transition: { duration: 0.5, delay: index * 0.2 },
      className: `w-16 h-16 flex items-center justify-center rounded font-bold text-xl uppercase border ${getClass(
        status
      )}`,
      children: letter
    }
  );
};
const WORD_LENGTH$1 = 5;
const Row = ({ guess, isFinal, word }) => {
  const letters = Array.from({ length: WORD_LENGTH$1 }).map(
    (_, i) => guess[i] || ""
  );
  return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-5 gap-2", children: letters.map((letter, i) => /* @__PURE__ */ jsx(Tile, { letter, index: i, isFinal, word }, i)) });
};
const Board = ({ guesses, currentGuess, word, maxTries }) => {
  return /* @__PURE__ */ jsx("div", { className: "grid grid-rows-6 gap-2", children: Array.from({ length: maxTries }).map((_, rowIdx) => {
    const guess = guesses[rowIdx] || (rowIdx === guesses.length ? currentGuess : "");
    return /* @__PURE__ */ jsx(
      Row,
      {
        guess,
        isFinal: rowIdx < guesses.length,
        word
      },
      rowIdx
    );
  }) });
};
const keyboardLayout = [
  "QWERTYUIOP".split(""),
  "ASDFGHJKL".split(""),
  ["Enter", ..."ZXCVBNM".split(""), "⌫"]
];
function getKeyClass(status) {
  if (status === "correct") return "bg-green-500 text-white";
  if (status === "present") return "bg-yellow-400 text-white";
  if (status === "absent") return "bg-gray-400 text-white";
  return "bg-gray-300";
}
const Keyboard = ({ keyStatuses, onKeyPress }) => {
  return /* @__PURE__ */ jsx("div", { className: "mt-8 space-y-2", children: keyboardLayout.map((row, rowIdx) => /* @__PURE__ */ jsx("div", { className: "flex justify-center gap-2", children: row.map((key) => /* @__PURE__ */ jsx(
    "button",
    {
      onClick: () => onKeyPress(key),
      className: `px-5 py-5 rounded font-bold uppercase hover:opacity-80 active:scale-95 transition ${getKeyClass(
        keyStatuses[key]
      )}`,
      children: key
    },
    key
  )) }, rowIdx)) });
};
const WORD_LENGTH = 5;
const MAX_TRIES = 6;
function getBetterStatus(current, next) {
  const rank = {
    correct: 3,
    present: 2,
    absent: 1
  };
  if (!current) return next;
  return rank[next] > rank[current] ? next : current;
}
const Wordle = () => {
  const [word, setWord] = useState("REACT");
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [keyStatuses, setKeyStatuses] = useState({});
  async function validateWord(word2) {
    try {
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word2.toLowerCase()}`
      );
      return res.ok;
    } catch {
      return false;
    }
  }
  useEffect(() => {
    async function fetchWord() {
      try {
        const res = await fetch(
          "https://random-word-api.herokuapp.com/word?length=5"
        );
        const data = await res.json();
        setWord(data[0].toUpperCase());
      } catch (err) {
        console.error("Failed to fetch word, using fallback REACT", err);
      }
    }
    fetchWord();
  }, []);
  useEffect(() => {
    function handleKeyDown(e) {
      if (isGameOver) return;
      if (e.key === "Enter") handleKeyPress("Enter");
      else if (e.key === "Backspace") handleKeyPress("⌫");
      else {
        const letter = e.key.toUpperCase();
        if (/^[A-Z]$/.test(letter)) handleKeyPress(letter);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentGuess, guesses, isGameOver]);
  async function handleKeyPress(key) {
    if (isGameOver) return;
    if (key === "Enter") {
      if (currentGuess.length !== WORD_LENGTH) return;
      if (guesses.length >= MAX_TRIES) {
        setMessage("No more tries!");
        setIsGameOver(true);
        return;
      }
      const isValid = await validateWord(currentGuess);
      if (!isValid) {
        setMessage("Not a valid word!");
        return;
      }
      setMessage("");
      const newGuesses = [...guesses, currentGuess];
      setGuesses(newGuesses);
      updateKeyStatuses(currentGuess);
      setCurrentGuess("");
      if (currentGuess === word) {
        setMessage("🎉 You guessed it!");
        setIsGameOver(true);
      } else if (newGuesses.length === MAX_TRIES) {
        setMessage(`Game over! The word was ${word}`);
        setIsGameOver(true);
      }
    } else if (key === "⌫") {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (/^[A-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(currentGuess + key);
    }
  }
  function updateKeyStatuses(guess) {
    const newStatuses = { ...keyStatuses };
    guess.split("").forEach((letter, i) => {
      if (word[i] === letter) {
        newStatuses[letter] = getBetterStatus(
          newStatuses[letter],
          "correct"
        );
      } else if (word.includes(letter)) {
        newStatuses[letter] = getBetterStatus(
          newStatuses[letter],
          "present"
        );
      } else {
        newStatuses[letter] = getBetterStatus(
          newStatuses[letter],
          "absent"
        );
      }
    });
    setKeyStatuses(newStatuses);
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center p-6", children: [
    /* @__PURE__ */ jsx(
      Board,
      {
        guesses,
        currentGuess,
        word,
        maxTries: MAX_TRIES
      }
    ),
    /* @__PURE__ */ jsx(Keyboard, { keyStatuses, onKeyPress: handleKeyPress }),
    message && /* @__PURE__ */ jsx("p", { className: "mt-6 text-lg font-semibold", children: message })
  ] });
};
const AppHeader = () => {
  return /* @__PURE__ */ jsxs("nav", { className: "relative bg-gray-800/50 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10", children: [
    /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-2 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "relative flex h-16 items-center justify-between", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-0 flex items-center sm:hidden", children: /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          className: "relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500",
          children: [
            /* @__PURE__ */ jsx("span", { className: "absolute -inset-0.5" }),
            /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Open main menu" }),
            /* @__PURE__ */ jsx(
              "svg",
              {
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "1.5",
                "data-slot": "icon",
                "aria-hidden": "true",
                className: "size-6 in-aria-expanded:hidden",
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    d: "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5",
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round"
                  }
                )
              }
            ),
            /* @__PURE__ */ jsx(
              "svg",
              {
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "1.5",
                "data-slot": "icon",
                "aria-hidden": "true",
                className: "size-6 not-in-aria-expanded:hidden",
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    d: "M6 18 18 6M6 6l12 12",
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round"
                  }
                )
              }
            )
          ]
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-1 items-center justify-center sm:items-stretch sm:justify-start", children: [
        /* @__PURE__ */ jsx("div", { className: "flex shrink-0 items-center", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: "https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500",
            alt: "Your Company",
            className: "h-8 w-auto"
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "hidden sm:ml-6 sm:block", children: /* @__PURE__ */ jsxs("div", { className: "flex space-x-4", children: [
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "#",
              "aria-current": "page",
              className: "rounded-md bg-gray-950/50 px-3 py-2 text-sm font-medium text-white",
              children: "Dashboard"
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "#",
              className: "rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white",
              children: "Team"
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "#",
              className: "rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white",
              children: "Projects"
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "#",
              className: "rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white",
              children: "Calendar"
            }
          )
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            className: "relative rounded-full p-1 text-gray-400 hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500",
            children: [
              /* @__PURE__ */ jsx("span", { className: "absolute -inset-1.5" }),
              /* @__PURE__ */ jsx("span", { className: "sr-only", children: "View notifications" }),
              /* @__PURE__ */ jsx(
                "svg",
                {
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "1.5",
                  "data-slot": "icon",
                  "aria-hidden": "true",
                  className: "size-6",
                  children: /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0",
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round"
                    }
                  )
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "relative ml-3 group", children: [
          /* @__PURE__ */ jsxs("button", { className: "relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500", children: [
            /* @__PURE__ */ jsx("span", { className: "absolute -inset-1.5" }),
            /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Open user menu" }),
            /* @__PURE__ */ jsx(
              "img",
              {
                src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                alt: "",
                className: "size-8 rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "hidden group-hover:block absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1 outline -outline-offset-1 outline-white/10 transition transition-discrete", children: [
            /* @__PURE__ */ jsx(
              "a",
              {
                href: "#",
                className: "block px-4 py-2 text-sm text-gray-300 focus:bg-white/5 focus:outline-hidden",
                children: "Your profile"
              }
            ),
            /* @__PURE__ */ jsx(
              "a",
              {
                href: "#",
                className: "block px-4 py-2 text-sm text-gray-300 focus:bg-white/5 focus:outline-hidden",
                children: "Settings"
              }
            ),
            /* @__PURE__ */ jsx(
              "a",
              {
                href: "#",
                className: "block px-4 py-2 text-sm text-gray-300 focus:bg-white/5 focus:outline-hidden",
                children: "Sign out"
              }
            )
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { id: "mobile-menu", hidden: true, className: "block sm:hidden", children: /* @__PURE__ */ jsxs("div", { className: "space-y-1 px-2 pt-2 pb-3", children: [
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "#",
          "aria-current": "page",
          className: "block rounded-md bg-gray-950/50 px-3 py-2 text-base font-medium text-white",
          children: "Dashboard"
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "#",
          className: "block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white",
          children: "Team"
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "#",
          className: "block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white",
          children: "Projects"
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "#",
          className: "block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white",
          children: "Calendar"
        }
      )
    ] }) })
  ] });
};
function meta({}) {
  return [{
    title: "Event Digi"
  }, {
    name: "description",
    content: "Welcome to Event Digi!"
  }];
}
const home = UNSAFE_withComponentProps(function Home() {
  return /* @__PURE__ */ jsxs("div", {
    className: "min-h-screen bg-gray-100",
    children: [/* @__PURE__ */ jsx(AppHeader, {}), /* @__PURE__ */ jsx(Wordle, {})]
  });
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-BWBOP0Ds.js", "imports": ["/assets/chunk-PVWAREVJ-BGDX7Rsd.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-CN-Y1Ck-.js", "imports": ["/assets/chunk-PVWAREVJ-BGDX7Rsd.js"], "css": ["/assets/root-BUBXXkwq.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home": { "id": "routes/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/home-D2GWmAhk.js", "imports": ["/assets/chunk-PVWAREVJ-BGDX7Rsd.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-e9172f82.js", "version": "e9172f82", "sri": void 0 };
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "unstable_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = ["/"];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/home": {
    id: "routes/home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
