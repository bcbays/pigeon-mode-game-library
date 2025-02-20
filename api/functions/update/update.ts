import InputPressHandler from "../../classes/InputPressHandler";
import InputTickHandler from "../../classes/InputTickHandler";
import getDefinables from "../getDefinables";
import state from "../../state";
import updateLevel from "./updateLevel";

const update = (): void => {
  if (state.values.world === null) {
    throw new Error("An attempt was made to update before world was loaded.");
  }
  if (state.values.hasInteracted) {
    navigator.getGamepads().forEach((gamepad: Gamepad | null): void => {
      if (gamepad) {
        gamepad.buttons.forEach(
          (button: GamepadButton, buttonIndex: number): void => {
            if (
              !state.values.heldGamepadButtons.includes(buttonIndex) &&
              Boolean(button.pressed)
            ) {
              state.setValues({
                heldGamepadButtons: [
                  ...state.values.heldGamepadButtons,
                  buttonIndex,
                ],
              });
              getDefinables(InputPressHandler).forEach(
                (inputPressHandler: InputPressHandler): void => {
                  inputPressHandler.handleGamepadButton(buttonIndex);
                }
              );
              getDefinables(InputTickHandler).forEach(
                (inputPressHandler: InputTickHandler<string>): void => {
                  inputPressHandler.handleGamepadButtonDown(buttonIndex);
                }
              );
            } else if (
              state.values.heldGamepadButtons.includes(buttonIndex) &&
              !button.pressed
            ) {
              state.setValues({
                heldGamepadButtons: state.values.heldGamepadButtons.filter(
                  (gamepadButtonIndex: number): boolean =>
                    buttonIndex !== gamepadButtonIndex
                ),
              });
              getDefinables(InputTickHandler).forEach(
                (inputPressHandler: InputTickHandler<string>): void => {
                  inputPressHandler.handleGamepadButtonUp(buttonIndex);
                }
              );
            }
          }
        );
      }
    });
    getDefinables(InputTickHandler).forEach(
      (inputTickHandler: InputTickHandler<string>): void => {
        inputTickHandler.attemptInput();
      }
    );
    if (state.values.levelID !== null) {
      updateLevel();
    }
  }
};

export default update;
