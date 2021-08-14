import { ButtonColor } from "vk-io";
import R1IO from "R1IO";
import { User } from "IUser";
import { GoBackButton } from "@Components/GoBackButton/GoBackButton";

interface MainMenuProps {
  user: User;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  user: { selectedWeek },
}) => (
  <menu>
    <row>
      <button color={ButtonColor.POSITIVE}>Schedule</button>
      <button
        color={
          selectedWeek === "Green" ? ButtonColor.POSITIVE : ButtonColor.NEGATIVE
        }
      >{`${selectedWeek} week`}</button>
    </row>
    <row>
      <GoBackButton />
    </row>
  </menu>
);
