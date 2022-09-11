import { API } from "revolt-api";
import { Log, Sleep } from "../../lib/globalUtils";
import type { AnimeEpisodeShape } from "../../lib/types/types";

interface Embed {
  icon_url?: string | null;
  url?: string | null;
  title?: string | null;
  description?: string | null;
  media?: string | null;
  colour?: string | null;
}

/**
 * Dispatch the anime update to the revolt channel
 * @param {AnimeEpisodeShape[]} Update
 */
export const TriggerAnimeUpdate = async (Update: AnimeEpisodeShape[]) => {
  Log(`New Anime Update of ${Update.length} animes`);
  if (Update.length === 0) return;

  const AnimeUpdateBot = NewBotClient();
  if (!AnimeUpdateBot) return;

  for (const embed of GenerateEmbeds(Update)) {
    await AnimeUpdateBot.post("/channels/01GBB2HC8KEGXBDM5NMWH22YCP/messages", {
      embeds: [embed],
    });
    await Sleep(5_000);
  }
};

const GenerateEmbeds = (Update: AnimeEpisodeShape[]): Embed[] =>
  Update.map(
    ({ Title, EpisodeId, TimeReleased, Img }): Embed => ({
      title: "👀 New Anime Episode Update!",
      description: `# ${Title.trim()}\n### ${EpisodeId.trim()}\n _${TimeReleased}_`,
      colour: "#f1c40f",
      icon_url: Img,
      url: "https://www.adkami.com/",
    })
  );

const NewBotClient = (): API | null => {
  if (!process.env.ANIME_UPDATES_BOT_TOKEN) return null;

  return new API({
    authentication: { revolt: process.env.ANIME_UPDATES_BOT_TOKEN },
  });
};
