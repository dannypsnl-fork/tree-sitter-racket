module.exports = grammar({
  name: "racket",

  rules: {
    source_file: ($) => seq($.language, repeat($._top_level_form)),
    language: ($) => seq("#lang", field("language", $.identifier)),
    _top_level_form: ($) => choice($._expression, $.define),
    define: ($) =>
      seq(
        $._OPEN,
        "define",
        choice(
          seq(
            $._OPEN,
            field("name", $.identifier),
            field("parameters", repeat($.identifier)),
            $._CLOSE,
            $.body
          ),
          seq(field("name", $.identifier), $._expression)
        ),
        $._CLOSE
      ),
    body: ($) => seq(repeat($._statement), $._statement),
    _statement: ($) => choice($.define, $._expression),
    _expression: ($) =>
      choice($.lambda, $.let, $.identifier, $.number, $.function_call),
    function_call: ($) =>
      seq($._OPEN, $._expression, repeat($._expression), $._CLOSE),
    let: ($) =>
      seq(
        $._OPEN,
        choice("let", "let*", "letrec"),
        $._OPEN,
        repeat(seq($._OPEN, $.binding, $._CLOSE)),
        $._CLOSE,
        $.body,
        $._CLOSE
      ),
    binding: ($) => seq($.identifier, $._expression),
    lambda: ($) =>
      seq(
        $._OPEN,
        "lambda",
        $._OPEN,
        field("parameters", repeat($.identifier)),
        $._CLOSE,
        $.body,
        $._CLOSE
      ),
    // datum
    number: ($) => /[0-9]+/,
    identifier: ($) => /[a-zA-Z0-9\+\-\.\*\/<=>!?:$%_&~^\*]+/,
    // parenthesis
    _OPEN: ($) => choice("(", "[", "{"),
    _CLOSE: ($) => choice(")", "]", "}"),
  },
});
