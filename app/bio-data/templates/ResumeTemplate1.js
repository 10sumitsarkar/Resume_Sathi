import React from "react";
import BiodataTemplate from "./BiodataTemplate";

export default function ResumeTemplate1(props) {
  return <BiodataTemplate {...props} variant={1} />;
}

ResumeTemplate1.layoutStyle = "single-column";
