import React from "react";

interface ErrorTextProps {
  errorText: string;
  classname?: string;
}

export default function ErrorText({ errorText, classname }: ErrorTextProps) {
  return (
    <p className={`text-center text-destructive ${classname}`}>{errorText}</p>
  );
}
