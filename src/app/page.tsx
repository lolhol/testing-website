"use client";

import { ChangeEvent, FormEvent, useRef, useState } from "react";

const defaultButtons: DefaultButton[] = [
  {
    specification: "crabby",
    textOnButton: "Testing Button",
  },
  {
    specification: "crab111",
    textOnButton: "Testing Button1",
  },
];

const textRenderList: TextRender[] = [
  {
    button: {
      specification: "prompt_gpt",
      textOnButton: "Prompt GPT",
    },
    clearTextTimeMS: 10000000,
  },
  {
    button: {
      specification: "prompt_groq",
      textOnButton: "Prompt Groq",
    },
    clearTextTimeMS: 10000,
  },
  {
    button: {
      specification: "prompt_groq",
      textOnButton: "poauhgrqqqqw",
    },
    clearTextTimeMS: 10000,
  },
];

interface DefaultButton {
  specification: string;
  textOnButton: string;
}

interface TextRender {
  button: DefaultButton;
  clearTextTimeMS: number;
}

export default function Home() {
  const [clicked, setClicked] = useState<Map<string, boolean>>(new Map());
  const [texts, setText] = useState<Map<string, string>>(new Map());
  const [clickedImageUpload, setClickedImageUpload] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function isValidFormat(output: string): boolean {
    const formatRegex = /Q1:'.+?',Q2:'.+?',Q3:'.+?',Q4:'.+?',Q5:'.+?'/;
    return formatRegex.test(output);
  }

  async function handleClickBaseText(buttonSpecification: string, iterations: number): Promise<void> {
    let correctFormatCount = 0;

    for (let i = 0; i < iterations; i++) {
      const res = await fetch("/api/testing/" + buttonSpecification, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: "John Doe" }),
      });

      const jsonRes = await res.json();
      const text: string = jsonRes.text;

      if (isValidFormat(text)) {
        correctFormatCount++;
      }

      const newTexts = new Map(texts);
      newTexts.set(buttonSpecification, text);
      setText(newTexts);

      setTimeout(() => {
        const updatedTexts = new Map(texts);
        updatedTexts.set(buttonSpecification, "");
        setText(updatedTexts);
      }, textRenderList.find(tr => tr.button.specification === buttonSpecification)?.clearTextTimeMS || 10000);
    }

    console.log(`Correct format count: ${correctFormatCount} out of ${iterations}`);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    const response = await fetch("/api/testing/upload", {
      method: "POST",
      body: formData,
    });
  }

  return (
    <main className="p-10 flex flex-col">
      <div className="w-full flex border-2 p-2 rounded-2xl h-1/2 flex-grow flex-row flex-wrap">
        {defaultButtons.map((defaultButton, index) => (
          <button
            key={index}
            className="w-40 h-20 border-2 border-black rounded-lg mx-5 my-5"
            onClick={async () => {
              await fetch("/api/testing/" + defaultButton.specification, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: "John Doe" }),
              });
              const newClicked = new Map(clicked);
              newClicked.set(defaultButton.textOnButton, true);
              setClicked(newClicked);
              setTimeout(() => {
                const resetClicked = new Map(clicked);
                resetClicked.set(defaultButton.textOnButton, false);
                setClicked(resetClicked);
              }, 300);
            }}
          >
            {clicked.get(defaultButton.textOnButton)
              ? "Clicked"
              : defaultButton.textOnButton}
          </button>
        ))}
      </div>

      <div className="w-full mt-10 flex flex-grow border-2 p-5 rounded-2xl flex-row justify-between flex-wrap">
        {textRenderList.map((textRender, index) => (
          <div
            key={index}
            className="flex flex-col border-2 p-2 rounded-xl border-black m-2"
          >
            <div className="border-2 min-w-[500px] min-h-96 p-2 rounded-lg">
              {texts.get(textRender.button.specification) !== ""
                ? texts.get(textRender.button.specification) ===
                  "TEXT_GENERATING_"
                  ? "Waiting for text to come back"
                  : texts.get(textRender.button.specification)
                : "Nothing here"}
            </div>
            <button
              className="p-1 h-10 w-40 border-2 border-black rounded-lg mt-3"
              onClick={async () => {
                const newClicked = new Map(clicked);
                newClicked.set(textRender.button.specification, true);
                setClicked(newClicked);

                setTimeout(() => {
                  const resetClicked = new Map(clicked);
                  resetClicked.set(textRender.button.specification, false);
                  setClicked(resetClicked);
                }, 300);

                const newT = new Map(texts);
                newT.set(textRender.button.specification, "TEXT_GENERATING_");
                setText(newT);

                await handleClickBaseText(textRender.button.specification, 5); // Run the test 5 times
              }}
            >
              {clicked.get(textRender.button.specification)
                ? "Clicked"
                : textRender.button.textOnButton}
            </button>
          </div>
        ))}
      </div>

      <div className="w-full mt-10 flex flex-grow border-2 p-5 rounded-2xl flex-row justify-between flex-wrap">
        <form onSubmit={handleSubmit}>
          <input type="file" onChange={handleFileChange} ref={fileInputRef} />
          <button
            type="submit"
            className="w-20 h-10 border-2 border-black rounded-lg"
            onClick={() => {
              setClickedImageUpload(true);

              setTimeout(() => {
                setClickedImageUpload(false);
              }, 300);

              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }}
          >
            {clickedImageUpload ? "Uploaded" : "Upload"}
          </button>
        </form>
      </div>
    </main>
  );
}

