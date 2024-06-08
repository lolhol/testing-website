"use client";

import { useState } from "react";

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
];

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

export default function Home() {
  function generateListWithBooleans(
    buttons: DefaultButton[]
  ): Map<string, boolean> {
    const returnList: Map<string, boolean> = new Map();
    buttons.forEach((button) => {
      returnList.set(button.textOnButton, false);
    });
    return returnList;
  }

  const [clicked, setClicked] = useState<Map<string, boolean>>(
    generateListWithBooleans(defaultButtons)
  );

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

  async function handleClickBaseText(link: string) {
    const res = await fetch("/api/testing/" + link, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: "John Doe" }),
    });

    const jsonRes = await res.json();
    const text = jsonRes.text;
  }

  return (
    <main className="p-10 flex flex-col">
      <div className="w-full flex">
        {defaultButtons.map((defaultButton, index) => (
          <button
            key={index}
            className="w-40 h-20 border-2 border-black rounded-lg mx-5"
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
    </main>
  );
}
