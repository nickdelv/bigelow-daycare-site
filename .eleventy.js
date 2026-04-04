module.exports = function (eleventyConfig) {
  eleventyConfig.addGlobalData("currentYear", () => new Date().getFullYear());

  // Output pages as /about.html instead of /about/index.html so that
  // relative nav hrefs (about.html, enrollment.html, etc.) resolve correctly.
  // Pages with explicit permalink front matter (robots.html, 404.html) override this.
  eleventyConfig.addGlobalData("permalink", "{{ page.filePathStem }}.html");

  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/assets");

  eleventyConfig.addFilter(
    "isoDate",
    (date) => new Date(date).toISOString().split("T")[0]
  );

  return {
    dir: {
      input: "src",
      output: "public",
      includes: "_includes",
      data: "_data",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
