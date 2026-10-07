import { pageHero, button, callButton } from "../layout.mjs";

// Cloudflare Pages serves /404.html for unknown paths.
export const page = {
  path: "/404.html",
  output: "404.html",
  noindex: true,
  title: "Page not found",
  description: "The page you were looking for could not be found.",
  body: () => `
${pageHero({
  eyebrow: "404",
  title: "We couldn't find that page.",
  text: "The page may have moved. Use the links below to get where you need to go.",
  actions: `${button("/", "Go to home page")}${callButton()}`
})}`
};
