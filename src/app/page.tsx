"use client";

import { ChangeEvent, FormEvent, useRef, useState } from "react";

/*
?
*/

const defaultButtons: DefaultButton[] = [
  {
    specification: "crab",
    textOnButton: "Testing Button",
  },
  {
    specification: "crab111",
    textOnButton: "Testing Button1",
  },
  {
    specification: "crab",
    textOnButton: "Testing Button",
  },
];

// MAKE SURE TO PUT THE ACTUAL TEXT U WANT TO RENDER IN .text PROPERTY OF THE RESPONSE
const textRenderList: TextRender[] = [
  {
    button: {
      specification: "craby",
      textOnButton: "Testing text button",
    },
    clearTextTimeMS: 3000,
  },
  {
    button: {
      specification: "craby1",
      textOnButton: "Testing text button",
    },
    clearTextTimeMS: 3000,
  },
];

const imageUploadList: string[] = [];

/*
?
*/

interface DefaultButton {
  specification: string;
  textOnButton: string;
}

interface TextRender {
  button: DefaultButton;
  clearTextTimeMS: number;
}

interface ImageUploader {
  button: DefaultButton;
  clearTextTimeMS: number;
}

export default function Home() {
  function generateListWithBooleans(
    buttons: DefaultButton[]
  ): Map<string, boolean> {
    const returnList: Map<string, boolean> = new Map();
    buttons.forEach((button) => {
      returnList.set(button.textOnButton, false);
    });

    for (const text of textRenderList) {
      returnList.set(text.button.textOnButton, false);
    }

    return returnList;
  }

  function generateListWithStrings(
    buttons: DefaultButton[]
  ): Map<string, string> {
    const returnList: Map<string, string> = new Map();

    for (const text of textRenderList) {
      returnList.set(text.button.textOnButton, "Nothing here yet");
    }

    return returnList;
  }

  const [clicked, setClicked] = useState<Map<string, boolean>>(
    generateListWithBooleans(defaultButtons)
  );

  const [texts, setText] = useState<Map<string, string>>(
    generateListWithStrings(defaultButtons)
  );

  const [clickedImageUpload, setClickedImageUpload] = useState<boolean>(false);

  function addToListWithBooleans(button: DefaultButton) {
    const resetClicked = new Map(clicked);
    resetClicked.set(button.textOnButton, false);
    setClicked(resetClicked);
  }

  async function handleClickBaseButton(link: string) {
    const res = await fetch("/api/testing/" + link, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: "John Doe" }),
    });
    const jsonRes = await res.json();
    console.log(jsonRes);
  }

  async function handleClickBaseText(link: string): Promise<string> {
    const res = await fetch("/api/testing/" + link, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: "John Doe" }),
    });

    const jsonRes = await res.json();
    const text: string = jsonRes.text;
    return text;
  }

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
            onClick={() => {
              handleClickBaseButton(defaultButton.specification);
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
            <a className="border-2 min-w-[500px] min-h-96 p-2 rounded-lg">
              {texts.get(textRender.button.textOnButton) !== ""
                ? texts.get(textRender.button.textOnButton) ===
                  "TEXT_GENERATING_"
                  ? "Waiting for text to come back"
                  : texts.get(textRender.button.textOnButton)
                : "Nothing here"}
            </a>
            <button
              className="p-1 h-10 w-40 border-2 border-black rounded-lg mt-3"
              onClick={async () => {
                const newClicked = new Map(clicked);
                newClicked.set(textRender.button.textOnButton, true);
                setClicked(newClicked);

                setTimeout(() => {
                  const resetClicked = new Map(clicked);
                  resetClicked.set(textRender.button.textOnButton, false);
                  setClicked(resetClicked);
                }, 300);

                const newT = new Map(texts);
                newT.set(textRender.button.textOnButton, "TEXT_GENERATING_");
                setText(newT);

                const newText = await handleClickBaseText(
                  textRender.button.specification
                );

                const newTexts = new Map(texts);
                newTexts.set(textRender.button.textOnButton, newText);
                setText(newTexts);
                setTimeout(() => {
                  const updatedTexts = new Map(texts);
                  updatedTexts.set(textRender.button.textOnButton, "");
                  setText(updatedTexts);
                }, textRender.clearTextTimeMS);
              }}
            >
              {clicked.get(textRender.button.textOnButton)
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
