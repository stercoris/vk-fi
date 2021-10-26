import R1IO from "r1-io";
import { TimePickerFragment } from "@Components/TimePicker/TimePicker";
import { subscribe, unsubscribe } from "bot/actions/subscribeToMailingActions";
import { goToPrevMenuAction } from "bot/actions/goBackNavigationAction";
import { BotContext } from "bot/rootMiddleware";

export const MailingMenu: R1IO.FC<BotContext> = async ({ user }) => {
  const UnsubscribeBtn = () => (
    <button onClick={unsubscribe} color="negative">
      Unsubscribe
    </button>
  );

  const SubscribeBtn = () => (
    <button onClick={subscribe} color="positive">
      Subscribe
    </button>
  );

  return (
    <menu>
      <row>{user.subscribed ? <UnsubscribeBtn /> : <SubscribeBtn />}</row>
      <TimePickerFragment user={user} />
      <row>
        <button onClick={goToPrevMenuAction()}>BACK</button>
      </row>
    </menu>
  );
};
