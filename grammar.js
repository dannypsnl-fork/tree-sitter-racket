module.exports = grammar({
  name: "racket",

  rules: {
    source_file: ($) => seq($.language, repeat($._top_level_form)),
    language: ($) => seq("#lang", field("language", $.identifier)),
    _top_level_form: ($) => choice($._expression, $.define),
    define: ($) =>
      seq(
        "(",
        "define",
        choice(
          seq(
            "(",
            field("name", $.identifier),
            field("parameters", repeat($.identifier)),
            ")",
            $.body
          ),
          seq(field("name", $.identifier), $._expression)
        ),
        ")"
      ),
    body: ($) => seq(repeat($._statement), $._statement),
    _statement: ($) => choice($.define, $._expression),
    _expression: ($) =>
      choice($.lambda, $.identifier, $.number, $.function_call),
    function_call: ($) => seq("(", $._expression, repeat($._expression), ")"),
    lambda: ($) =>
      seq(
        "(",
        "lambda",
        "(",
        field("parameters", repeat($.identifier)),
        ")",
        $.body,
        ")"
      ),
    number: ($) => /[0-9]+/,
    identifier: ($) => /[a-zA-Z0-9\+\-\.\*\/<=>!?:$%_&~^\*]+/,
  },
});
