import { useState } from "react";
import { Button, TextInput } from "@mantine/core";
import { useTranslation } from "react-i18next";

interface Props {
  handleSetName(name: string): void;
  takenNames: string[];
}

function PlayerNamer({ handleSetName, takenNames }: Props): JSX.Element {
  const { t } = useTranslation();
  const [inputText, setInputText] = useState("");

  const handleSetClick = () => {
    if (takenNames.includes(inputText)) {
      window.alert(t("player.name_taken_error"));
    } else if (inputText.length > 0) {
      handleSetName(inputText);
    } else {
      window.alert(t("player.empty_name_error"));
    }
  };

  return (
    <>
      <TextInput
        placeholder={String(t("player.enter_name"))}
        value={inputText}
        onChange={(e) => {
          setInputText(e.target.value);
        }}
      />
      <Button onClick={handleSetClick}>{String(t("player.set_name"))}</Button>
    </>
  );
}

export default PlayerNamer;
