module.exports = grammar({
  name: "racket",

  rules: {
    source_file: ($) => $.language,
    language: ($) => seq("#lang", $.identifier),
    identifier: ($) => /[a-z]+/,
  },
});
