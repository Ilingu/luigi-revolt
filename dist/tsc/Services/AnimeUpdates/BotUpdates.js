"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TriggerAnimeUpdate = void 0;
const tslib_1 = require("tslib");
const revolt_api_1 = require("revolt-api");
const globalUtils_1 = require("../../lib/globalUtils");
const TriggerAnimeUpdate = (Update) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    (0, globalUtils_1.Log)(`New Anime Update of ${Update.length} animes`);
    if (Update.length === 0)
        return;
    const AnimeUpdateBot = NewBotClient();
    if (!AnimeUpdateBot)
        return;
    for (const embed of GenerateEmbeds(Update)) {
        yield AnimeUpdateBot.post("/channels/01GBB2HC8KEGXBDM5NMWH22YCP/messages", {
            embeds: [embed],
        });
        yield (0, globalUtils_1.Sleep)(5000);
    }
});
exports.TriggerAnimeUpdate = TriggerAnimeUpdate;
const GenerateEmbeds = (Update) => Update.map(({ Title, EpisodeId, TimeReleased, Img }) => ({
    title: "👀 New Anime Episode Update!",
    description: `# ${Title.trim()}\n### ${EpisodeId.trim()}\n _${TimeReleased}_`,
    colour: "#f1c40f",
    icon_url: Img,
    url: "https://www.adkami.com/",
}));
const NewBotClient = () => {
    if (!process.env.ANIME_UPDATES_BOT_TOKEN)
        return null;
    return new revolt_api_1.API({
        authentication: { revolt: process.env.ANIME_UPDATES_BOT_TOKEN },
    });
};
//# sourceMappingURL=BotUpdates.js.map