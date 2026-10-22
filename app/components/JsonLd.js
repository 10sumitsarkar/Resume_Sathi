const JSON_LD_ESCAPES = {
  "<": "\\u003c",
  ">": "\\u003e",
  "&": "\\u0026",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029",
};

export default function JsonLd({ data }) {
  const serializedData = JSON.stringify(data).replace(
    /[<>&\u2028\u2029]/g,
    (character) => JSON_LD_ESCAPES[character],
  );

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializedData }}
    />
  );
}
