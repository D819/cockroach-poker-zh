import { useState } from "react";
import { Button, TextInput } from "@mantine/core";

interface Props {
  handleSetName(name: string): void;
  takenNames: string[];
}

function PlayerNamer({ handleSetName, takenNames }: Props): JSX.Element {
  const [inputText, setInputText] = useState("");

  const handleSetClick = () => {
    if (takenNames.includes(inputText)) {
      window.alert("Somebody is already using that name");
    } else if (inputText.length > 0) {
      handleSetName(inputText);
    } else {
      window.alert("Can't have an empty player name");
    }
  };

  return (
    <>
      <TextInput
        placeholder="Enter your name"
        value={inputText}
        onChange={(e) => {
          setInputText(e.target.value);
        }}
      />
      <Button onClick={handleSetClick}>
        Set player name
      </Button>
    </>
  );
}

export default PlayerNamer;
