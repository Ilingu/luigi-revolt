import { SendLuigiDailyMsg } from "./bot";
import { queryAllSubsChannels } from "./graphql/funcs";

export const DailyLuigi = async () => {
  const LuigiOfTheDay = generateLuigiOfDay();

  const { success, data: subsChannels } = await queryAllSubsChannels();
  if (!success || !subsChannels || subsChannels.length <= 0) return;

  subsChannels.forEach((ch) => SendLuigiDailyMsg(ch, LuigiOfTheDay));
};

const dateZero = new Date("08/25/2022").getTime();
const ONE_DAY_IN_MS = 86400000; // 1000 * 60 * 60 * 24
const generateLuigiOfDay = (): number => {
  const deltaTime = Date.now() - dateZero;
  const daysElapsed = Math.round(deltaTime / ONE_DAY_IN_MS);

  return daysElapsed;
};
