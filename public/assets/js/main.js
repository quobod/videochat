import { log } from "./clientutils.js";

if (window) {
  const nav = navigator;
  const platform = nav.platform;
  const lang = nav.language;
  const langs = nav.languages;
  const userAgent = nav.userAgent;
  const vendor = nav.vendor;

  log(`Platform:\t${platform}`);
  log(`Languages:\t${langs}`);
  log(`Language:\t${lang}`);
  log(`UAgent:\t${userAgent}`);
  log(`Vendor:\t${vendor}`);
}

const main = () => {
  log(`\n\tmain script\n`);
};

main();

addEventListener("beforeunload", (event) => {
  log(`\n\tBefore unload\n`);
});
